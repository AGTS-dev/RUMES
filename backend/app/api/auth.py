"""Authentication endpoints: register, login, me."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.models import User
from app.schemas.schemas import LoginRequest, Token, UserCreate, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.scalar(
        select(User).where(or_(User.username == payload.username, User.email == payload.email))
    )
    if existing:
        field = "username" if existing.username == payload.username else "email"
        raise HTTPException(status_code=409, detail=f"{field} already taken")

    user = User(
        username=payload.username,
        email=payload.email,
        display_name=payload.display_name or payload.username,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    await db.flush()
    token = create_access_token(user.id)
    return Token(access_token=token)


@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await db.scalar(
        select(User).where(or_(User.username == payload.login, User.email == payload.login))
    )
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect login or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")
    return Token(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return current_user
