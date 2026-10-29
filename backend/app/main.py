"""RUMES backend application entry point.

Run (from the `backend/` directory):
    uvicorn app.main:app --reload
"""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import auth, chats, files, messages, users, ws
from app.core.config import get_settings
from app.db.session import engine
from app.models.models import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (use Alembic migrations for production).
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


settings = get_settings()

app = FastAPI(
    title=f"{settings.app_name} API",
    description="Backend for the RUMES messenger frontend",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST API under /api/v1
API_PREFIX = "/api/v1"
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(users.router, prefix=API_PREFIX)
app.include_router(chats.router, prefix=API_PREFIX)
app.include_router(messages.router, prefix=API_PREFIX)
app.include_router(files.router, prefix=API_PREFIX)

# Realtime WebSocket endpoint at /ws
app.include_router(ws.router)

# Serve uploaded files
uploads_path = Path(settings.upload_dir)
uploads_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")


@app.get("/healthcheck", tags=["system"])
async def healthcheck() -> dict:
    return {"status": "ok", "app": settings.app_name}
