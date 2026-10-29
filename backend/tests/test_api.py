"""End-to-end API tests using FastAPI TestClient with an in-memory SQLite DB."""
import os
import tempfile

# Configure env BEFORE importing the app
_tmpdb = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
_tmpdb.close()
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{_tmpdb.name}"
os.environ["SECRET_KEY"] = "test-secret"

import pytest
from fastapi.testclient import TestClient

from app.main import app  # noqa: E402


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def _register(client, username, email, password="secret123"):
    r = client.post(
        "/api/v1/auth/register",
        json={"username": username, "email": email, "password": password},
    )
    assert r.status_code == 201, r.text
    return r.json()["access_token"]


def _auth(token):
    return {"Authorization": f"Bearer {token}"}


def test_healthcheck(client):
    r = client.get("/healthcheck")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_register_login_me(client):
    token = _register(client, "alice", "alice@example.com")
    # duplicate registration -> 409
    r = client.post(
        "/api/v1/auth/register",
        json={"username": "alice", "email": "other@example.com", "password": "secret123"},
    )
    assert r.status_code == 409

    # login by username
    r = client.post("/api/v1/auth/login", json={"login": "alice", "password": "secret123"})
    assert r.status_code == 200
    token = r.json()["access_token"]

    # wrong password
    r = client.post("/api/v1/auth/login", json={"login": "alice", "password": "bad"})
    assert r.status_code == 401

    # me
    r = client.get("/api/v1/auth/me", headers=_auth(token))
    assert r.status_code == 200
    assert r.json()["username"] == "alice"

    # unauthenticated request rejected
    assert client.get("/api/v1/auth/me").status_code == 401


def test_user_search_and_profile(client):
    _register(client, "bob", "bob@example.com")
    token = client.post(
        "/api/v1/auth/login", json={"login": "bob", "password": "secret123"}
    ).json()["access_token"]

    r = client.get("/api/v1/users/search?q=ali", headers=_auth(token))
    assert r.status_code == 200
    assert any(u["username"] == "alice" for u in r.json())

    alice_id = next(u["id"] for u in r.json() if u["username"] == "alice")
    r = client.get(f"/api/v1/users/{alice_id}", headers=_auth(token))
    assert r.status_code == 200

    # update profile
    r = client.patch(
        "/api/v1/users/me", json={"bio": "hello world"}, headers=_auth(token)
    )
    assert r.status_code == 200 and r.json()["bio"] == "hello world"


def test_private_chat_flow(client):
    tok_a = client.post("/api/v1/auth/login", json={"login": "alice", "password": "secret123"}).json()["access_token"]
    users = client.get("/api/v1/users/search?q=bob", headers=_auth(tok_a)).json()
    bob_id = next(u["id"] for u in users if u["username"] == "bob")

    # create private chat
    r = client.post("/api/v1/chats", json={"type": "private", "with_user_id": bob_id}, headers=_auth(tok_a))
    assert r.status_code == 201, r.text
    chat_id = r.json()["id"]

    # idempotent — second call returns same chat
    r2 = client.post("/api/v1/chats", json={"type": "private", "with_user_id": bob_id}, headers=_auth(tok_a))
    assert r2.json()["id"] == chat_id

    # alice sends a message
    r = client.post(f"/api/v1/chats/{chat_id}/messages", json={"body": "Привет, Боб!"}, headers=_auth(tok_a))
    assert r.status_code == 201
    msg_id = r.json()["id"]
    assert r.json()["body"] == "Привет, Боб!"

    # bob logs in and sees history
    tok_b = client.post("/api/v1/auth/login", json={"login": "bob", "password": "secret123"}).json()["access_token"]
    r = client.get(f"/api/v1/chats/{chat_id}/messages", headers=_auth(tok_b))
    assert r.status_code == 200 and len(r.json()) == 1

    # unread count visible in chat list
    r = client.get("/api/v1/chats", headers=_auth(tok_b))
    summary = next(s for s in r.json() if s["chat"]["id"] == chat_id)
    assert summary["unread_count"] == 1

    # mark read
    r = client.post(f"/api/v1/chats/{chat_id}/read/{msg_id}", headers=_auth(tok_b))
    assert r.status_code == 204
    r = client.get("/api/v1/chats", headers=_auth(tok_b))
    summary = next(s for s in r.json() if s["chat"]["id"] == chat_id)
    assert summary["unread_count"] == 0

    # outsider cannot access the chat
    tok_c = _register(client, "eve", "eve@example.com")
    r = client.get(f"/api/v1/chats/{chat_id}/messages", headers=_auth(tok_c))
    assert r.status_code == 404


def test_message_edit_delete_permissions(client):
    tok_a = client.post("/api/v1/auth/login", json={"login": "alice", "password": "secret123"}).json()["access_token"]
    tok_b = client.post("/api/v1/auth/login", json={"login": "bob", "password": "secret123"}).json()["access_token"]
    users = client.get("/api/v1/users/search?q=bob", headers=_auth(tok_a)).json()
    bob_id = next(u["id"] for u in users if u["username"] == "bob")
    chat_id = client.post(
        "/api/v1/chats", json={"type": "private", "with_user_id": bob_id}, headers=_auth(tok_a)
    ).json()["id"]

    msg = client.post(f"/api/v1/chats/{chat_id}/messages", json={"body": "original"}, headers=_auth(tok_a)).json()

    # bob cannot edit alice's message
    r = client.patch(f"/api/v1/chats/{chat_id}/messages/{msg['id']}", json={"body": "hacked"}, headers=_auth(tok_b))
    assert r.status_code == 403

    # alice edits her own message
    r = client.patch(f"/api/v1/chats/{chat_id}/messages/{msg['id']}", json={"body": "edited"}, headers=_auth(tok_a))
    assert r.status_code == 200 and r.json()["edited_at"] is not None

    # bob (a member of the private chat) can delete alice's message — Telegram-like
    r = client.delete(f"/api/v1/chats/{chat_id}/messages/{msg['id']}", headers=_auth(tok_b))
    assert r.status_code == 204

    # deleted messages are excluded from history
    history = client.get(f"/api/v1/chats/{chat_id}/messages", headers=_auth(tok_a)).json()
    assert all(m["id"] != msg["id"] for m in history)


def test_group_message_delete_permissions(client):
    """In groups only the author or an admin/owner can delete."""
    tok_a = client.post("/api/v1/auth/login", json={"login": "alice", "password": "secret123"}).json()["access_token"]
    tok_e = client.post("/api/v1/auth/login", json={"login": "eve", "password": "secret123"}).json()["access_token"]
    eve_id = client.get("/api/v1/auth/me", headers=_auth(tok_e)).json()["id"]

    chat_id = client.post(
        "/api/v1/chats",
        json={"type": "group", "title": "PermTest", "member_ids": [eve_id]},
        headers=_auth(tok_a),
    ).json()["id"]

    msg = client.post(f"/api/v1/chats/{chat_id}/messages", json={"body": "by alice"}, headers=_auth(tok_a)).json()
    # eve is a plain member -> forbidden
    r = client.delete(f"/api/v1/chats/{chat_id}/messages/{msg['id']}", headers=_auth(tok_e))
    assert r.status_code == 403
    # alice is owner -> allowed
    r = client.delete(f"/api/v1/chats/{chat_id}/messages/{msg['id']}", headers=_auth(tok_a))
    assert r.status_code == 204


def test_group_chat(client):
    tok_a = client.post("/api/v1/auth/login", json={"login": "alice", "password": "secret123"}).json()["access_token"]
    users = client.get("/api/v1/users/search?q=bo", headers=_auth(tok_a)).json()
    bob_id = next(u["id"] for u in users if u["username"] == "bob")

    r = client.post(
        "/api/v1/chats",
        json={"type": "group", "title": "Team", "member_ids": [bob_id]},
        headers=_auth(tok_a),
    )
    assert r.status_code == 201
    chat_id = r.json()["id"]

    members = client.get(f"/api/v1/chats/{chat_id}/members", headers=_auth(tok_a)).json()
    assert {m["username"] for m in members} == {"alice", "bob"}

    # add eve
    tok_e = client.post("/api/v1/auth/login", json={"login": "eve", "password": "secret123"}).json()["access_token"]
    eve_id = client.get("/api/v1/auth/me", headers=_auth(tok_e)).json()["id"]
    r = client.post(f"/api/v1/chats/{chat_id}/members", json={"user_id": eve_id}, headers=_auth(tok_a))
    assert r.status_code == 201
    assert len(r.json()) == 3

    # duplicate add -> 409
    r = client.post(f"/api/v1/chats/{chat_id}/members", json={"user_id": eve_id}, headers=_auth(tok_a))
    assert r.status_code == 409


def test_file_upload(client, tmp_path):
    tok = client.post("/api/v1/auth/login", json={"login": "alice", "password": "secret123"}).json()["access_token"]
    content = b"fake image bytes"
    r = client.post(
        "/api/v1/files",
        files={"file": ("photo.png", content, "image/png")},
        headers=_auth(tok),
    )
    assert r.status_code == 201, r.text
    url = r.json()["url"]
    assert url.startswith("/uploads/")
    # served statically
    r = client.get(url)
    assert r.status_code == 200 and r.content == content

    # disallowed extension
    r = client.post(
        "/api/v1/files",
        files={"file": ("virus.exe", b"xx", "application/octet-stream")},
        headers=_auth(tok),
    )
    assert r.status_code == 400


def test_websocket_realtime(client):
    tok_a = client.post("/api/v1/auth/login", json={"login": "alice", "password": "secret123"}).json()["access_token"]
    tok_b = client.post("/api/v1/auth/login", json={"login": "bob", "password": "secret123"}).json()["access_token"]
    users = client.get("/api/v1/users/search?q=ali", headers=_auth(tok_b)).json()
    alice_id = next(u["id"] for u in users if u["username"] == "alice")
    chat_id = client.post(
        "/api/v1/chats", json={"type": "private", "with_user_id": alice_id}, headers=_auth(tok_b)
    ).json()["id"]

    with client.websocket_connect(f"/ws?token={tok_b}") as ws:
        ws.send_json({"action": "subscribe", "chat_id": chat_id})
        # alice sends via REST; bob should receive realtime event
        client.post(
            f"/api/v1/chats/{chat_id}/messages",
            json={"body": "realtime hello"},
            headers=_auth(tok_a),
        )
        event = ws.receive_json()
        assert event["type"] == "message.new"
        assert event["data"]["body"] == "realtime hello"
        assert event["data"]["sender"]["username"] == "alice"

        # ping/pong
        ws.send_json({"action": "ping"})
        assert ws.receive_json()["type"] == "pong"

    # invalid token is rejected
    from starlette.websockets import WebSocketDisconnect

    with pytest.raises(WebSocketDisconnect):
        with client.websocket_connect("/ws?token=garbage") as ws:
            ws.receive_json()
