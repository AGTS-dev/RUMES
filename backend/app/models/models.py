"""SQLAlchemy ORM models for the RUMES messenger."""
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    display_name: Mapped[str] = mapped_column(String(64), default="")
    avatar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    bio: Mapped[str] = mapped_column(Text, default="")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    messages: Mapped[list["Message"]] = relationship(back_populates="sender", cascade="all, delete-orphan")
    memberships: Mapped[list["ChatMember"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Chat(Base):
    """A conversation: private (direct) or group."""

    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(String(16), default="private")  # private | group
    title: Mapped[str | None] = mapped_column(String(128), nullable=True)  # for groups
    avatar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    members: Mapped[list["ChatMember"]] = relationship(back_populates="chat", cascade="all, delete-orphan")
    messages: Mapped[list["Message"]] = relationship(
        back_populates="chat", cascade="all, delete-orphan", order_by="Message.id"
    )


class ChatMember(Base):
    __tablename__ = "chat_members"
    __table_args__ = (UniqueConstraint("chat_id", "user_id", name="uq_chat_user"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(String(16), default="member")  # member | admin | owner
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    last_read_message_id: Mapped[int] = mapped_column(default=0)

    chat: Mapped[Chat] = relationship(back_populates="members")
    user: Mapped[User] = relationship(back_populates="memberships")


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id", ondelete="CASCADE"), index=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    body: Mapped[str] = mapped_column(Text, default="")
    attachment_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    reply_to_id: Mapped[int | None] = mapped_column(
        ForeignKey("messages.id", ondelete="SET NULL"), nullable=True
    )
    edited_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    chat: Mapped[Chat] = relationship(back_populates="messages")
    sender: Mapped[User] = relationship(back_populates="messages")
