"""Pydantic schemas (request/response models)."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------- User ----------
class UserBase(BaseModel):
    username: str
    email: EmailStr
    display_name: str = ""
    avatar_url: str | None = None
    bio: str = ""


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=32, pattern=r"^[a-zA-Z0-9_]+$")
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    display_name: str = ""


class UserUpdate(BaseModel):
    display_name: str | None = None
    avatar_url: str | None = None
    bio: str | None = None
    email: EmailStr | None = None


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


# ---------- Auth ----------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    login: str  # username or email
    password: str


# ---------- Chat ----------
class ChatCreate(BaseModel):
    """type=private -> create/find direct chat with `with_user_id`;
    type=group -> requires `title` and optional `member_ids`."""

    type: str = Field(pattern=r"^(private|group)$")
    with_user_id: int | None = None
    title: str | None = None
    member_ids: list[int] = []


class ChatOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    title: str | None
    avatar_url: str | None
    created_at: datetime


class ChatSummary(BaseModel):
    """Chat + last message + unread count, for the chat list."""

    chat: ChatOut
    members: list[UserOut]
    last_message: "MessageOut | None" = None
    unread_count: int = 0


class MemberAdd(BaseModel):
    user_id: int


# ---------- Message ----------
class MessageSend(BaseModel):
    body: str = Field(max_length=4096)
    attachment_url: str | None = None
    reply_to_id: int | None = None


class MessageUpdate(BaseModel):
    body: str = Field(min_length=1, max_length=4096)


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    chat_id: int
    sender_id: int
    body: str
    attachment_url: str | None
    reply_to_id: int | None
    edited_at: datetime | None
    is_deleted: bool
    created_at: datetime
    sender: UserOut | None = None


ChatSummary.model_rebuild()
