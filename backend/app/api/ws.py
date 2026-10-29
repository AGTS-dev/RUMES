"""WebSocket endpoint for realtime events.

Connect:  ws://<host>/ws?token=<jwt>

Client -> server messages (JSON):
    {"action": "ping"}                          -> {"type": "pong"}
    {"action": "subscribe", "chat_id": 1}       -> join chat room (typing)
    {"action": "unsubscribe", "chat_id": 1}
    {"action": "typing", "chat_id": 1}          -> relayed to other members as
                                                   {"type": "typing", "chat_id", "user_id"}

Server -> client events:
    {"type": "message.new" | "message.edited" | "message.deleted", "data": ...}
    {"type": "presence", "user_id": ..., "online": true|false}
    {"type": "typing", "chat_id": ..., "user_id": ...}
"""
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.models import Chat, ChatMember, User
from app.api.deps import get_user_from_ws_token
from app.ws_manager import manager

router = APIRouter()


async def _member_ids(db: AsyncSession, chat_id: int) -> list[int]:
    rows = await db.scalars(select(ChatMember.user_id).where(ChatMember.chat_id == chat_id))
    return list(rows)


@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket, token: str = "", db: AsyncSession = Depends(get_db)):
    if not token:
        await ws.close(code=4401)
        return
    try:
        user = await get_user_from_ws_token(db, token)
    except Exception:
        await ws.close(code=4401)
        return

    was_online = manager.is_online(user.id)
    await manager.connect(user.id, ws)
    if not was_online:
        # notify contacts about coming online
        chat_ids = await db.scalars(
            select(ChatMember.chat_id).where(ChatMember.user_id == user.id)
        )
        for cid in chat_ids:
            members = await _member_ids(db, cid)
            for uid in members:
                if uid != user.id:
                    await manager.send_to_user(uid, {"type": "presence", "user_id": user.id, "online": True})

    joined_chats: set[int] = set()
    try:
        while True:
            event = await ws.receive_json()
            action = event.get("action")

            if action == "ping":
                await ws.send_json({"type": "pong"})

            elif action == "subscribe":
                chat_id = int(event.get("chat_id", 0))
                ok = await db.scalar(
                    select(Chat.id).where(
                        Chat.id == chat_id,
                        Chat.members.any(ChatMember.user_id == user.id),
                    )
                )
                if ok:
                    manager.join_chat(user.id, ws, chat_id)
                    joined_chats.add(chat_id)

            elif action == "unsubscribe":
                chat_id = int(event.get("chat_id", 0))
                manager.leave_chat(user.id, ws, chat_id)
                joined_chats.discard(chat_id)

            elif action == "typing":
                chat_id = int(event.get("chat_id", 0))
                if chat_id in joined_chats:
                    await manager.broadcast_to_chat(
                        chat_id,
                        {"type": "typing", "chat_id": chat_id, "user_id": user.id},
                        member_ids=[],
                        exclude_user=user.id,
                    )
    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(user.id, ws)
        for cid in joined_chats:
            manager.leave_chat(user.id, ws, cid)
        if not manager.is_online(user.id):
            chat_ids = await db.scalars(
                select(ChatMember.chat_id).where(ChatMember.user_id == user.id)
            )
            for cid in chat_ids:
                members = await _member_ids(db, cid)
                for uid in members:
                    if uid != user.id:
                        await manager.send_to_user(uid, {"type": "presence", "user_id": user.id, "online": False})
