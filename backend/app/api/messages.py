"""Message endpoints: history, send, edit, delete — with realtime fan-out."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.chats import get_chat_for_member
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import ChatMember, Message, User
from app.schemas.schemas import MessageOut, MessageSend, MessageUpdate
from app.ws_manager import manager

router = APIRouter(prefix="/chats/{chat_id}/messages", tags=["messages"])


async def _member_ids(db: AsyncSession, chat_id: int) -> list[int]:
    rows = await db.scalars(select(ChatMember.user_id).where(ChatMember.chat_id == chat_id))
    return list(rows)


def _to_out(msg: Message) -> dict:
    return MessageOut.model_validate(msg).model_dump(mode="json")


@router.get("", response_model=list[MessageOut])
async def list_messages(
    chat_id: int,
    before_id: int | None = Query(default=None, description="paginate: messages with id < before_id"),
    limit: int = Query(default=50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # membership check (raises 404 if not a member)
    await get_chat_for_member(db, chat_id, user)

    stmt = (
        select(Message)
        .where(Message.chat_id == chat_id)
        .options(selectinload(Message.sender))
        .order_by(Message.id.desc())
        .limit(limit)
    )
    if before_id is not None:
        stmt = stmt.where(Message.id < before_id)
    rows = list(await db.scalars(stmt))
    rows.reverse()  # chronological order for the client
    return rows


@router.post("", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
async def send_message(
    chat_id: int,
    payload: MessageSend,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    await get_chat_for_member(db, chat_id, user)
    if not payload.body.strip() and not payload.attachment_url:
        raise HTTPException(status_code=422, detail="Message body or attachment is required")

    msg = Message(
        chat_id=chat_id,
        sender_id=user.id,
        body=payload.body,
        attachment_url=payload.attachment_url,
        reply_to_id=payload.reply_to_id,
    )
    db.add(msg)
    await db.flush()
    await db.refresh(msg, ["sender"])

    member_ids = await _member_ids(db, chat_id)
    await manager.broadcast_to_chat(
        chat_id, {"type": "message.new", "data": _to_out(msg)}, member_ids
    )
    return msg


@router.patch("/{message_id}", response_model=MessageOut)
async def edit_message(
    chat_id: int,
    message_id: int,
    payload: MessageUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    await get_chat_for_member(db, chat_id, user)
    msg = await db.scalar(
        select(Message)
        .where(Message.id == message_id, Message.chat_id == chat_id)
        .options(selectinload(Message.sender))
    )
    if msg is None or msg.is_deleted:
        raise HTTPException(status_code=404, detail="Message not found")
    if msg.sender_id != user.id:
        raise HTTPException(status_code=403, detail="Only the author can edit a message")

    from app.models.models import utcnow

    msg.body = payload.body
    msg.edited_at = utcnow()
    await db.flush()

    member_ids = await _member_ids(db, chat_id)
    await manager.broadcast_to_chat(
        chat_id, {"type": "message.edited", "data": _to_out(msg)}, member_ids
    )
    return msg


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(
    chat_id: int,
    message_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    chat = await get_chat_for_member(db, chat_id, user)
    msg = await db.scalar(select(Message).where(Message.id == message_id, Message.chat_id == chat_id))
    if msg is None or msg.is_deleted:
        raise HTTPException(status_code=404, detail="Message not found")

    membership = next(m for m in chat.members if m.user_id == user.id)
    is_author = msg.sender_id == user.id
    if chat.type == "private":
        allowed = True  # either participant of a direct chat can delete (Telegram-like)
    else:
        is_admin = membership.role in ("owner", "admin")
        allowed = is_author or is_admin
    if not allowed:
        raise HTTPException(status_code=403, detail="Not allowed to delete this message")

    msg.is_deleted = True
    msg.body = ""
    msg.attachment_url = None
    await db.flush()

    member_ids = await _member_ids(db, chat_id)
    await manager.broadcast_to_chat(
        chat_id,
        {"type": "message.deleted", "data": {"id": msg.id, "chat_id": chat_id}},
        member_ids,
    )
    return None
