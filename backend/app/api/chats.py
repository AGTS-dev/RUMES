"""Chat endpoints: list, create, detail, members, read markers."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import Chat, ChatMember, Message, User
from app.schemas.schemas import ChatCreate, ChatOut, ChatSummary, MemberAdd, MessageOut, UserOut

router = APIRouter(prefix="/chats", tags=["chats"])


async def get_chat_for_member(db: AsyncSession, chat_id: int, user: User) -> Chat:
    chat = await db.scalar(
        select(Chat)
        .options(selectinload(Chat.members).selectinload(ChatMember.user))
        .where(Chat.id == chat_id, Chat.members.any(ChatMember.user_id == user.id))
    )
    if chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


@router.get("", response_model=list[ChatSummary])
async def list_chats(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    chats = await db.scalars(
        select(Chat)
        .join(ChatMember, ChatMember.chat_id == Chat.id)
        .where(ChatMember.user_id == user.id)
        .options(selectinload(Chat.members).selectinload(ChatMember.user))
        .order_by(Chat.id.desc())
    )
    result: list[ChatSummary] = []
    for chat in chats:
        membership = next(m for m in chat.members if m.user_id == user.id)
        last_msg = await db.scalar(
            select(Message)
            .where(Message.chat_id == chat.id, Message.is_deleted.is_(False))
            .order_by(Message.id.desc())
            .limit(1)
        )
        unread = await db.scalar(
            select(func.count(Message.id)).where(
                Message.chat_id == chat.id,
                Message.id > membership.last_read_message_id,
                Message.sender_id != user.id,
                Message.is_deleted.is_(False),
            )
        )
        result.append(
            ChatSummary(
                chat=ChatOut.model_validate(chat),
                members=[UserOut.model_validate(m.user) for m in chat.members],
                last_message=MessageOut.model_validate(last_msg) if last_msg else None,
                unread_count=unread or 0,
            )
        )
    # most recent activity first
    result.sort(key=lambda s: (s.last_message.id if s.last_message else 0, s.chat.id), reverse=True)
    return result


@router.post("", response_model=ChatOut, status_code=status.HTTP_201_CREATED)
async def create_chat(payload: ChatCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    if payload.type == "private":
        if payload.with_user_id is None:
            raise HTTPException(status_code=422, detail="with_user_id is required for private chats")
        if payload.with_user_id == user.id:
            raise HTTPException(status_code=422, detail="Cannot chat with yourself")
        other = await db.get(User, payload.with_user_id)
        if other is None or not other.is_active:
            raise HTTPException(status_code=404, detail="User not found")

        # reuse existing private chat if any
        existing = await db.scalar(
            select(Chat)
            .join(ChatMember, ChatMember.chat_id == Chat.id)
            .where(Chat.type == "private", ChatMember.user_id.in_([user.id, other.id]))
            .group_by(Chat.id)
            .having(func.count(ChatMember.id) == 2)
        )
        if existing:
            return existing

        chat = Chat(type="private")
        db.add(chat)
        await db.flush()
        db.add_all(
            [
                ChatMember(chat_id=chat.id, user_id=user.id, role="member"),
                ChatMember(chat_id=chat.id, user_id=other.id, role="member"),
            ]
        )
    else:  # group
        if not payload.title or not payload.title.strip():
            raise HTTPException(status_code=422, detail="title is required for group chats")
        chat = Chat(type="group", title=payload.title.strip())
        db.add(chat)
        await db.flush()
        member_ids = {user.id, *payload.member_ids}
        found = await db.scalars(select(User.id).where(User.id.in_(member_ids), User.is_active.is_(True)))
        valid_ids = set(found)
        if not valid_ids.issuperset(member_ids):
            raise HTTPException(status_code=422, detail="Some member ids do not exist")
        for uid in valid_ids:
            db.add(ChatMember(chat_id=chat.id, user_id=uid, role="owner" if uid == user.id else "member"))
    await db.flush()
    return chat


@router.get("/{chat_id}", response_model=ChatOut)
async def get_chat(chat_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await get_chat_for_member(db, chat_id, user)


@router.get("/{chat_id}/members", response_model=list[UserOut])
async def chat_members(chat_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    chat = await get_chat_for_member(db, chat_id, user)
    return [m.user for m in chat.members]


@router.post("/{chat_id}/members", response_model=list[UserOut], status_code=status.HTTP_201_CREATED)
async def add_member(
    chat_id: int,
    payload: MemberAdd,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    chat = await get_chat_for_member(db, chat_id, user)
    if chat.type != "group":
        raise HTTPException(status_code=400, detail="Cannot add members to a private chat")
    if payload.user_id == user.id:
        raise HTTPException(status_code=422, detail="You are already a member")
    other = await db.get(User, payload.user_id)
    if other is None or not other.is_active:
        raise HTTPException(status_code=404, detail="User not found")
    already = await db.scalar(
        select(ChatMember).where(ChatMember.chat_id == chat.id, ChatMember.user_id == payload.user_id)
    )
    if already:
        raise HTTPException(status_code=409, detail="User is already a member")
    db.add(ChatMember(chat_id=chat.id, user_id=payload.user_id))
    await db.flush()
    await db.refresh(chat, ["members"])
    return [m.user for m in chat.members]


@router.post("/{chat_id}/read/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def mark_read(
    chat_id: int,
    message_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    chat = await get_chat_for_member(db, chat_id, user)
    membership = next(m for m in chat.members if m.user_id == user.id)
    if message_id > membership.last_read_message_id:
        membership.last_read_message_id = message_id
        await db.flush()
    return None
