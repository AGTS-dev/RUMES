"""In-memory WebSocket connection manager for real-time message delivery.

For a single-process deployment this is sufficient. To scale horizontally,
replace the internals with Redis pub/sub (the public interface stays the same).
"""
import asyncio
import json
from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        # user_id -> set of active sockets
        self.user_sockets: dict[int, set[WebSocket]] = defaultdict(set)
        # chat_id -> set of (user_id, socket) currently "in" that chat (typing indicators)
        self.chat_sockets: dict[int, set[tuple[int, WebSocket]]] = defaultdict(set)
        self._lock = asyncio.Lock()

    async def connect(self, user_id: int, ws: WebSocket) -> None:
        await ws.accept()
        async with self._lock:
            self.user_sockets[user_id].add(ws)

    def disconnect(self, user_id: int, ws: WebSocket) -> None:
        self.user_sockets[user_id].discard(ws)
        if not self.user_sockets[user_id]:
            self.user_sockets.pop(user_id, None)
        for members in list(self.chat_sockets.values()):
            members.discard((user_id, ws))

    async def send_to_user(self, user_id: int, event: dict) -> None:
        """Send a JSON event to all open sockets of a user."""
        message = json.dumps(event, ensure_ascii=False, default=str)
        for ws in list(self.user_sockets.get(user_id, ())):
            try:
                await ws.send_text(message)
            except Exception:
                self.user_sockets[user_id].discard(ws)

    async def broadcast_to_chat(
        self, chat_id: int, event: dict, member_ids: list[int], exclude_user: int | None = None
    ) -> None:
        """Deliver an event to every member of the chat (by membership ids)."""
        targets = set(member_ids)
        for uid, _ws in self.chat_sockets.get(chat_id, set()):
            targets.add(uid)
        targets.discard(exclude_user)
        for uid in targets:
            await self.send_to_user(uid, event)

    def join_chat(self, user_id: int, ws: WebSocket, chat_id: int) -> None:
        self.chat_sockets[chat_id].add((user_id, ws))

    def leave_chat(self, user_id: int, ws: WebSocket, chat_id: int) -> None:
        self.chat_sockets[chat_id].discard((user_id, ws))

    def is_online(self, user_id: int) -> bool:
        return bool(self.user_sockets.get(user_id))


manager = ConnectionManager()
