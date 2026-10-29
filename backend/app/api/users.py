"""User profile and search endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import User
from app.schemas.schemas import UserOut, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/search", response_model=list[UserOut])
async def search_users(
    q: str = Query(min_length=1, max_length=64),
    limit: int = Query(default=20, le=50),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    pattern = f"%{q}%"
    rows = await db.scalars(
        select(User)
        .where(
            User.is_active.is_(True),
            or_(User.username.ilike(pattern), User.display_name.ilike(pattern)),
        )
        .order_by(func.lower(User.username))
        .limit(limit)
    )
    return list(rows)


@router.get("/{user_id}", response_model=UserOut)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    user = await db.get(User, user_id)
    if user is None or not user.is_active:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/me", response_model=UserOut)
async def update_me(
    payload: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = payload.model_dump(exclude_unset=True)
    if "email" in data and data["email"] != current_user.email:
        clash = await db.scalar(select(User).where(User.email == data["email"], User.id != current_user.id))
        if clash:
            raise HTTPException(status_code=409, detail="email already taken")
    for key, value in data.items():
        setattr(current_user, key, value)
    await db.flush()
    return current_user
