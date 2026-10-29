"""File upload endpoint for message attachments."""
import re
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.models.models import User

router = APIRouter(prefix="/files", tags=["files"])

ALLOWED_EXTENSIONS = {
    # images
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
    # documents
    ".pdf", ".txt", ".md", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    # media
    ".mp3", ".wav", ".ogg", ".m4a", ".mp4", ".webm", ".mov",
    # archives
    ".zip", ".rar", ".7z",
}
SAFE_NAME_RE = re.compile(r"^[A-Za-z0-9._ -]+$")


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile,
    _: User = Depends(get_current_user),
):
    settings = get_settings()
    if not file.filename or not SAFE_NAME_RE.match(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file name")
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type '{ext}' is not allowed")

    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    chunk_size = 1024 * 1024
    written = 0
    out_dir = Path(settings.upload_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    stored_name = f"{uuid.uuid4().hex}{ext}"
    out_path = out_dir / stored_name

    with out_path.open("wb") as sink:
        while chunk := await file.read(chunk_size):
            written += len(chunk)
            if written > max_bytes:
                sink.close()
                out_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=413,
                    detail=f"File exceeds the limit of {settings.max_upload_size_mb} MB",
                )
            sink.write(chunk)

    if written == 0:
        out_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="Empty file")

    return {"url": f"/uploads/{stored_name}", "name": file.filename, "size": written}
