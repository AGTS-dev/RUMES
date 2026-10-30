# RUMES Messenger

Мессенджер с React-фронтендом и FastAPI-бэкендом: чаты, сообщения в реальном времени по WebSocket, файлы, темы оформления (включая «Windows 98» и «Россия»), обои чата, resizable-список чатов, мобильная навигация.

> **Важно понимать текущее состояние.** Бэкенд полностью рабочий (REST + WebSocket, тесты проходят), но фронтенд **пока не подключён к нему**: UI работает на моковых данных (`src/data/mockData.ts`, `extendedMockData.ts`) с демо-автоответами через `setTimeout`. Разделы «Контакты», «Звонки», «Сохранённые» и сами звонки — только визуальные заглушки, WebRTC не реализован. Интеграционный слой (API-клиент, страницы логина) — это то, что предстоит написать. Подробности в разделах [Архитектура](#-архитектура-и-текущее-состояние) и [Что не реализовано](#-что-не-реализовано--plan-b).

---

## 📦 Содержание репозитория

```
.
├── index.html              # точка входа Vite (корень = frontend)
├── package.json            # фронтенд: React 18 + TS + Vite 6 + Tailwind v4
├── vite.config.js          # dev-сервер :3000 + proxy на бэкенд (:8000)
├── tsconfig.json
├── src/                    # исходники фронтенда
├── backend/                # FastAPI-бэкенд (приложение `app`)
│   ├── app/main.py         # точка входа: uvicorn app.main:app
│   ├── app/api/            # auth, users, chats, messages, files, ws
│   ├── app/core/           # config (.env), security (JWT + bcrypt)
│   ├── app/db/session.py   # async SQLAlchemy engine
│   ├── app/models/         # таблицы (User, Chat, ChatMember, Message, ...)
│   ├── app/schemas/        # pydantic-схемы запросов/ответов
│   ├── tests/test_api.py   # e2e-тесты REST + WS
│   ├── requirements.txt        # runtime-зависимости
│   ├── requirements-dev.txt    # + pytest, httpx
│   └── .env.example            # шаблон конфигурации
├── API_SPEC.md             # спецификация НЕКОТОРЫХ эндпоинтов (см. оговорку ниже)
├── UPDATES.md              # журнал изменений фронтенда
└── LICENSE                 # AGPL-3.0
```

⚠️ `API_SPEC.md` описывает `/api/contacts`, `/api/calls`, `/api/saved-messages` — они на бэкенде **не реализованы**. Реальный контракт бэкенда — раздел [API](#-api-бэкенда) ниже и автодокументация `/docs`.

---

## ⚙️ Требования

| Компонент | Минимум | Проверено на |
|---|---|---|
| Node.js | 18+ | v20.x |
| npm | 9+ | вместе с Node 20 |
| Python | 3.10+ (asyncio-синтаксис в коде) | 3.12 |
| ОС | любая (Linux/macOS/Windows WSL) | Linux |

Бэкенду не нужна внешняя СУБД для старта: по умолчанию используется SQLite (`backend/rumes.db` создаётся автоматически). Для продакшена предусмотрен PostgreSQL (см. [Конфигурация](#-конфигурация)).

---

## 🚀 Быстрый старт (dev)

Нужны **два терминала**: один для бэкенда, один для фронтенда.

### Терминал 1 — бэкенд (порт 8000)

```bash
cd backend

# изолированное окружение (рекомендуется)
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

pip install -r requirements.txt

# конфигурация
cp .env.example .env               # затем поменяйте SECRET_KEY!

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Проверка:

```bash
curl http://localhost:8000/healthcheck     # -> {"status":"ok","app":"RUMES"}
# интерактивная документация: http://localhost:8000/docs
```

### Терминал 2 — фронтенд (порт 3000)

```bash
# из корня репозитория
npm install
npm run dev
```

Откройте **http://localhost:3000** (важно: именно 3000, а не 5173 — порт зафиксирован `strictPort`).

Dev-сервер настроен с proxy: запросы на `/api`, `/uploads` и `/ws` прозрачно перенаправляются на бэкенд (`http://localhost:8000`), поэтому фронтенд может использовать одно origins-относительные URL и CORS в dev не мешает. Адрес бэкенда можно переопределить переменной окружения `VITE_BACKEND_URL` при запуске Vite.

### Что дальше

Фронтенд сразу покажет интерфейс мессенджера — но с **моковыми данными** и локальными автоответами. Чтобы проверить живой бэкенд, воспользуйтесь `http://localhost:8000/docs` или примерами из curl-секции ниже.

---

## 🧪 Тесты бэкенда

```bash
cd backend
source .venv/bin/activate
pip install -r requirements-dev.txt
pytest -q
```

Ожидается **9 passed**. Тесты поднимают приложение с временной SQLite-базой и покрывают: healthcheck, регистрацию/логин/JWT, поиск пользователей, личные и групповые чаты, отправку/редактирование/удаление сообщений (включая права), пагинацию, отметки прочтения, загрузку файлов и WebSocket-события.

> Примечание: если в вашей системе установлен сломанный глобальный плагин pytest (например, старый `libtmux` конфликтует с pytest ≥9), запускайте в виртуальном окружении, где ставились зависимости из `requirements-dev.txt`, либо добавьте `-p no:libtmux`.

---

## 🏭 Production-сборка фронтенда

```bash
npm run typecheck     # проверка типов (tsc --noEmit)
npm run build         # результат в dist/
npm run preview       # локальный предпросмотр собранного билда
```

`dist/` — статические файлы. Раздавайте их любым веб-сервером, **обязательно настроив reverse-proxy** на бэкенд для путей `/api`, `/ws` (WebSocket!) и `/uploads`. Пример nginx:

```nginx
server {
    listen 80;
    root /var/www/rumes/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:8000;
    }

    location /ws {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
```

Бэкенд в production:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
```

> WebSocket-менеджер хранит соединения **в памяти процесса**, поэтому `--workers > 1` без внешнего брокера (Redis pub/sub) приведёт к тому, что события будут доходить только клиентам внутри того же воркера. Оставьте 1 воркер или вынесите паблиш в Redis.

---

## 🔧 Конфигурация

Все настройки бэкенда — переменные окружения (или `backend/.env`, см. `backend/.env.example`):

| Переменная | По умолчанию | Описание |
|---|---|---|
| `SECRET_KEY` | `change-me-in-production` | Ключ подписи JWT. **Обязательно замените.** Длина < 32 байт вызывает предупреждение PyJWT. Генерация: `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `DEBUG` | `false` | Отладочный режим |
| `DATABASE_URL` | `sqlite+aiosqlite:///./rumes.db` | Строка подключения SQLAlchemy (asyncio-драйвер обязателен) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Время жизни JWT (24 ч) |
| `CORS_ORIGINS` | `["http://localhost:3000","http://localhost:5173"]` | JSON-массив разрешённых origin'ов фронтенда — **для продакшена обязательно дополнить своим доменом** |
| `UPLOAD_DIR` | `./uploads` | Каталог загруженных файлов (относительно `backend/`) |
| `MAX_UPLOAD_SIZE_MB` | `32` | Лимит размера файла |

Переменные фронтенда:

| Переменная | Где задаётся | Описание |
|---|---|---|
| `VITE_BACKEND_URL` | env при запуске `npm run dev` | Цель dev-proxy, по умолчанию `http://localhost:8000` |

### PostgreSQL вместо SQLite

```bash
pip install "psycopg[binary]"   # или asyncpg
```

```ini
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/rumes
```

Таблицы создаются на старте через `Base.metadata.create_all` — этого достаточно для первого запуска и разработки. **Для эволюции схемы подключите Alembic** (миграций в репозитории нет): иначе изменение моделей не применится к существующей базе.

---

## 📡 API бэкенда

Префикс REST — `/api/v1`, авторизация — `Authorization: Bearer <JWT>` (кроме register/login). Актуальная схема всегда видна в Swagger UI: `http://localhost:8000/docs`.

### Auth
| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/v1/auth/register` | `{username, email, password}` → `{access_token, token_type}` (201) |
| POST | `/api/v1/auth/login` | `{login (username или email), password}` → токен |
| GET | `/api/v1/auth/me` | Текущий пользователь |

### Users
| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/v1/users/search?q=` | Поиск по username/display_name |
| GET | `/api/v1/users/{id}` | Профиль |
| PATCH | `/api/v1/users/me` | Обновить display_name/avatar_url/bio/email |

### Chats
| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/v1/chats` | Список чатов c `members`, `last_message`, `unread_count` (отсортирован по активности) |
| POST | `/api/v1/chats` | Создать: `{type:"private", with_user_id}` или `{type:"group", title, member_ids}`; приватный чат переиспользуется |
| GET | `/api/v1/chats/{id}` | Детали |
| GET | `/api/v1/chats/{id}/members` | Участники |
| POST | `/api/v1/chats/{id}/members` | Добавить участника `{user_id}` |
| POST | `/api/v1/chats/{id}/read/{message_id}` | Отметить прочтение до сообщения (204) |

### Messages (`/api/v1/chats/{chat_id}/messages`)
| Метод | Путь | Описание |
|---|---|---|
| GET | `?before_id=&limit=50` | История, хронологическом порядке; удалённые фильтруются; пагинация «страница назад» через `before_id` |
| POST | `{body, attachment_url?, reply_to_id?}` | Отправить |
| PATCH | `/{message_id}` | Редактировать (только автор) |
| DELETE | `/{message_id}` | Soft-delete (только автор) |

### Files
| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/v1/files` | multipart-загрузка (`file`), whitelist расширений, лимит `MAX_UPLOAD_SIZE_MB`; ответ содержит URL вида `/uploads/<uuid>.<ext>` |

### WebSocket
Подключение: `ws://<host>/ws?token=<JWT>` (без токена — закрытие с кодом 4401).

Клиент → сервер:
```json
{"action": "ping"}                                    // -> {"type":"pong"}
{"action": "subscribe",   "chat_id": 1}               // получать события чата
{"action": "unsubscribe", "chat_id": 1}
{"action": "typing",      "chat_id": 1}
```

Сервер → клиент:
```json
{"type": "message.new" | "message.edited" | "message.deleted", "data": { ...Message }}
{"type": "typing",   "chat_id": 1, "user_id": 2}
{"type": "presence", "user_id": 2, "online": true}
```

Отдельный одноразовый сокет отметок прочтения: `ws://<host>/ws/messages/read?token=<JWT>`, сообщение `{"action":"read","chat_id":1,"up_to_id":42}`.

### Мини-скрипт проверки живого бэкенда (curl)

```bash
B=http://localhost:8000/api/v1
T1=$(curl -s -X POST $B/auth/register -H 'Content-Type: application/json' \
  -d '{"username":"alice","email":"a@x.io","password":"secret123"}' | python -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')
T2=$(curl -s -X POST $B/auth/register -H 'Content-Type: application/json' \
  -d '{"username":"bob","email":"b@x.io","password":"secret123"}' | python -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')
UID2=$(curl -s $B/auth/me -H "Authorization: Bearer $T2" | python -c 'import sys,json;print(json.load(sys.stdin)["id"])')
CID=$(curl -s -X POST $B/chats -H "Authorization: Bearer $T1" -H 'Content-Type: application/json' \
  -d "{\"type\":\"private\",\"with_user_id\":$UID2}" | python -c 'import sys,json;print(json.load(sys.stdin)["id"])')
curl -s -X POST $B/chats/$CID/messages -H "Authorization: Bearer $T1" \
  -H 'Content-Type: application/json' -d '{"body":"Привет, мир!"}'
curl -s "$B/chats" -H "Authorization: Bearer $T2" | python -m json.tool
```

---

## 🗂 Архитектура и текущее состояние

### Фронтенд (`src/`)

```
src/
├── main.tsx                      # точка входа
├── App.tsx                       # состояние приложения, табы, мок-автоответы
├── index.css                     # Tailwind v4 (@import "tailwindcss") + CSS-переменные тем
├── contexts/ThemeContext.tsx     # 5 тем: Dark / Light / Custom / Windows 98 / Россия
├── data/
│   ├── mockData.ts               # ✗ мок: чаты и сообщения
│   └── extendedMockData.ts       # ✗ мок: контакты, звонки, сохранённые
└── components/
    ├── LeftSidebar.tsx           # навигация по разделам, hamburger на мобильных
    ├── ResizableChatList.tsx     # drag-resize со snap: 70 / 360 / 600 px
    ├── ChatList.tsx              # список чатов, compact mode (<150px — только аватары)
    ├── ChatWindow.tsx            # окно переписки
    ├── ChatHeader.tsx            # заголовок чата, кнопки звонков
    ├── ChatMenu.tsx              # меню чата (поиск, mute, очистка)
    ├── ChatSearch.tsx            # поиск по сообщениям
    ├── MessageBubble.tsx         # пузырь сообщения, статусы ✓/✓✓
    ├── MessageInput.tsx          # ввод + прикрепление
    ├── EmojiPicker.tsx           # 300+ эмодзи, 5 категорий
    ├── CallModal.tsx             # ✗ имитация звонка (таймер), без WebRTC
    ├── Contacts.tsx              # ✗ мок-раздел
    ├── Calls.tsx                 # ✗ мок-раздел
    ├── SavedMessages.tsx         # ✗ мок-раздел
    ├── WallpaperPicker.tsx       # 15 обоев (Хохлома, Гжель, Кокошник...)
    ├── FolderManager.tsx         # папки чатов (localStorage)
    └── Settings.tsx              # 5 вкладок настроек
```

Стили: Tailwind CSS v4 подключён как Vite-плагин (`@tailwindcss/vite`), но **основная часть интерфейса написана на кастомных CSS-классах** (`message-bubble`, `sidebar-*` и т.п.) в `src/index.css` с CSS-переменными для тем. Утилиты Tailwind используются точечно.

Настройки хранятся в localStorage: `rumes-theme`, `rumes-custom-accent`, `rumes-custom-colors`, `rumes-wallpaper`, `rumes-folders`.

### Бэкенд (`backend/app/`)
FastAPI + SQLAlchemy 2.0 (async) + Pydantic v2 + PyJWT + bcrypt. Модели: `User`, `Chat`, `ChatMember` (+`last_read_message_id`), `Message` (+soft-delete, edits, attachments, replies). Реалтайм — собственный in-memory `ws_manager`.

### Модель данных и её расхождение с UI
Бэкенд отдаёт числовые `id`, поля `avatar_url`, `body`, `created_at`, `is_deleted`. Фронтенд ожидает строковые `id`, `text`, `timestamp`, `senderId`, `status: sent/delivered/read`, `avatarColor`, `unreadCount`. При интеграции понадобится адаптер (маппинг ответов API в типы `src/data/mockData.ts`) либо расширение схем бэкенда. Статусы доставки «delivered/read» на сервере не отслеживаются per-message — есть только счётчик непрочитанного и отметка прочтения до id.

---

## 🧭 Что не реализовано / plan-b

Честный список того, чего **нет** в репозитории, если вы рассчитывали получить готовый мессенджер «под ключ»:

1. **Интеграция фронта с бэком** — в `src/` нет ни одного `fetch`/`WebSocket`/`import.meta.env`. Нужны: API-клиент с JWT, страница логина/регистрации, хуки `useChats`/`useMessages`, замена моков в `App.tsx`. Dev-proxy уже настроен — останется писать код против относительных URL `/api/v1/...` и `/ws`.
2. **Эндпоинты контактов, звонков, сохранённых сообщений** — описаны в `API_SPEC.md`, отсутствуют в коде.
3. **Звонки** — только модальное окно с таймером. Нет WebRTC, сигнализации поверх `/ws`, учёта истории звонков на сервере.
4. **Миграции БД** — только `create_all` на старте. Для продакшена нужен Alembic.
5. **Docker/CI** — нет Dockerfile, docker-compose, workflow'ов.
6. **Rate limiting, refresh-токены, верификация email, шифрование** — отсутствуют; JWT живёт 24 ч, выход — перевход по паролю.
7. **Групповые read-receipts в UI** — событие `message.read` по WS отсутствует, есть REST-отметка и одноразовый WS-сокет.

Минимальный план подключения:
- `src/api/client.ts`: `fetch`-обёртка с токеном в localStorage;
- `src/api/socket.ts`: `new WebSocket(`${location.origin.replace(/^http/, 'ws')}/ws?token=${token}`)` + auto-reconnect + heartbeat `ping`;
- экран `Login/Register`, после успеха — загрузка `GET /api/v1/chats` вместо `mockChats`;
- маппер `apiMessage -> Message` (id→string, body→text, created_at→timestamp);
- отправка сообщений через `POST .../messages` вместо `setTimeout`-автоответчика.

---

## ❖ Возможные проблемы (troubleshooting)

| Симптом | Причина / решение |
|---|---|
| `ModuleNotFoundError: greenlet` при импорте app | Ставьте зависимости из `requirements.txt` целиком — там `sqlalchemy[asyncio]`, который тянет greenlet |
| Порт 3000 занят, Vite падает | Включён `strictPort`; освободите порт или измените `server.port`/`hmr.port` в `vite.config.js` (и синхронно `CORS_ORIGINS`) |
| 401/4401 в WebSocket | Не передаётся `?token=` или истёк JWT (24 ч) — перевход |
| Реалтайм не приходит при нескольких воркерах | In-memory менеджер сокетов; см. примечание про `--workers` |
| Файлы не открываются по URL из ответа API | `UPLOAD_DIR` должен быть доступен процессу; в dev путь `/uploads` проксируется Vite, в prod — nginx |
| Предупреждение `InsecureKeyLengthWarning` | Короткий `SECRET_KEY` — сгенерируйте длинный (см. таблицу конфигурации) |
| Стили «поехали» после правок | Интерфейс опирается на кастомные классы в `src/index.css`; Tailwind-утилиты сканируются по `src/**` автоматически (v4, content-лист не нужен) |

---

## 📄 Лицензия

**GNU AGPL v3.0** (файл `LICENSE`). Обратите внимание: старый README ошибочно указывал MIT — юридически значим текст файла `LICENSE`, это AGPL-3.0. Практическое следствие: если вы изменёте этот код и предоставите сервис пользователям по сети, вы обязаны опубликовать исходники модифицированной версии под той же лицензией.

**RUMES Messenger** — рабочий бэкенд + готовый UI-фронтенд; интеграция между ними — ваша следующая задача. 🚀
