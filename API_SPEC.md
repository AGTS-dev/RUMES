# API Specification для RUMES Messenger

Этот документ описывает API endpoints, необходимые для реализации бэкенда мессенджера RUMES.

## 📋 Содержание

1. [Контакты](#контакты)
2. [Звонки](#звонки)
3. [Сохранённые сообщения](#сохранённые-сообщения)
4. [Структуры данных](#структуры-данных)
5. [WebSocket события](#websocket-события)

---

## Контакты

### GET /api/contacts

Получить список всех контактов пользователя.

**Response:**
```json
{
  "contacts": [
    {
      "id": "c1",
      "name": "Алексей Петров",
      "avatar": "АП",
      "avatarColor": "#e17076",
      "phone": "+7 (999) 123-45-67",
      "username": "@alexey_petrov",
      "online": true,
      "lastSeen": "2026-01-15T10:30:00Z",
      "bio": "Frontend разработчик"
    }
  ]
}
```

### GET /api/contacts/:id

Получить информацию о конкретном контакте.

**Response:**
```json
{
  "id": "c1",
  "name": "Алексей Петров",
  "avatar": "АП",
  "avatarColor": "#e17076",
  "phone": "+7 (999) 123-45-67",
  "username": "@alexey_petrov",
  "online": true,
  "lastSeen": "2026-01-15T10:30:00Z",
  "bio": "Frontend разработчик"
}
```

### POST /api/contacts

Добавить новый контакт.

**Request:**
```json
{
  "name": "Иван Иванов",
  "phone": "+7 (999) 111-22-33",
  "username": "@ivan_ivanov",
  "bio": "Backend разработчик"
}
```

**Response:**
```json
{
  "id": "c9",
  "name": "Иван Иванов",
  "avatar": "ИИ",
  "avatarColor": "#6ec9cb",
  "phone": "+7 (999) 111-22-33",
  "username": "@ivan_ivanov",
  "online": false,
  "bio": "Backend разработчик"
}
```

### PUT /api/contacts/:id

Обновить информацию о контакте.

**Request:**
```json
{
  "name": "Иван Петров",
  "bio": "Senior Backend разработчик"
}
```

### DELETE /api/contacts/:id

Удалить контакт.

**Response:** `204 No Content`

---

## Звонки

### GET /api/calls

Получить историю звонков.

**Query Parameters:**
- `type` (optional): `all` | `missed` | `incoming` | `outgoing`
- `limit` (optional): количество записей (по умолчанию 50)
- `offset` (optional): смещение для пагинации

**Response:**
```json
{
  "calls": [
    {
      "id": "call1",
      "contactId": "c1",
      "contactName": "Алексей Петров",
      "avatar": "АП",
      "avatarColor": "#e17076",
      "type": "incoming",
      "callType": "video",
      "timestamp": "2026-01-15T14:30:00Z",
      "duration": 342
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

### POST /api/calls

Создать запись о звонке (вызывается при завершении звонка).

**Request:**
```json
{
  "contactId": "c1",
  "type": "outgoing",
  "callType": "video",
  "duration": 120
}
```

**Response:**
```json
{
  "id": "call9",
  "contactId": "c1",
  "contactName": "Алексей Петров",
  "avatar": "АП",
  "avatarColor": "#e17076",
  "type": "outgoing",
  "callType": "video",
  "timestamp": "2026-01-15T16:00:00Z",
  "duration": 120
}
```

### DELETE /api/calls/:id

Удалить запись о звонке из истории.

**Response:** `204 No Content`

### DELETE /api/calls

Очистить всю историю звонков.

**Response:** `204 No Content`

---

## Сохранённые сообщения

### GET /api/saved-messages

Получить список сохранённых сообщений.

**Query Parameters:**
- `type` (optional): `all` | `text` | `link` | `note`
- `limit` (optional): количество записей (по умолчанию 50)
- `offset` (optional): смещение для пагинации

**Response:**
```json
{
  "messages": [
    {
      "id": "saved1",
      "text": "https://react.dev/learn — отличная документация по React",
      "timestamp": "2026-01-15T10:00:00Z",
      "fromChat": "Избранное",
      "fromChatAvatar": "⭐",
      "fromChatColor": "#5ca0d4",
      "type": "link"
    }
  ],
  "total": 50,
  "limit": 50,
  "offset": 0
}
```

### POST /api/saved-messages

Сохранить сообщение.

**Request:**
```json
{
  "text": "Важная ссылка: https://example.com",
  "fromChat": "Избранное",
  "fromChatAvatar": "⭐",
  "fromChatColor": "#5ca0d4",
  "type": "link"
}
```

**Response:**
```json
{
  "id": "saved9",
  "text": "Важная ссылка: https://example.com",
  "timestamp": "2026-01-15T16:30:00Z",
  "fromChat": "Избранное",
  "fromChatAvatar": "⭐",
  "fromChatColor": "#5ca0d4",
  "type": "link"
}
```

### PUT /api/saved-messages/:id

Обновить сохранённое сообщение.

**Request:**
```json
{
  "text": "Обновлённый текст сообщения"
}
```

### DELETE /api/saved-messages/:id

Удалить сохранённое сообщение.

**Response:** `204 No Content`

---

## Структуры данных

### Contact

```typescript
interface Contact {
  id: string;                    // Уникальный идентификатор
  name: string;                  // Имя контакта
  avatar: string;                // Инициалы или эмодзи для аватара
  avatarColor: string;           // Цвет фона аватара (HEX)
  phone: string;                 // Телефон
  username?: string;             // Username (опционально)
  online: boolean;               // Статус онлайн
  lastSeen?: Date;               // Последний раз был в сети
  bio?: string;                  // Краткое описание
}
```

### Call

```typescript
interface Call {
  id: string;                    // Уникальный идентификатор
  contactId: string;             // ID контакта
  contactName: string;           // Имя контакта (для отображения)
  avatar: string;                // Аватар контакта
  avatarColor: string;           // Цвет аватара
  type: 'incoming' | 'outgoing' | 'missed';  // Тип звонка
  callType: 'audio' | 'video';   // Тип звонка (аудио/видео)
  timestamp: Date;               // Время звонка
  duration?: number;             // Длительность в секундах (опционально)
}
```

### SavedMessage

```typescript
interface SavedMessage {
  id: string;                    // Уникальный идентификатор
  text: string;                  // Текст сообщения
  timestamp: Date;               // Время сохранения
  fromChat?: string;             // Название чата, откуда сохранено
  fromChatAvatar?: string;       // Аватар чата
  fromChatColor?: string;        // Цвет аватара чата
  type: 'text' | 'link' | 'note';  // Тип сообщения
}
```

---

## WebSocket события

### Контакты

#### contact:online
```json
{
  "event": "contact:online",
  "data": {
    "contactId": "c1",
    "online": true
  }
}
```

#### contact:offline
```json
{
  "event": "contact:offline",
  "data": {
    "contactId": "c1",
    "lastSeen": "2026-01-15T10:30:00Z"
  }
}
```

### Звонки

#### call:incoming
```json
{
  "event": "call:incoming",
  "data": {
    "callId": "call9",
    "contactId": "c1",
    "contactName": "Алексей Петров",
    "callType": "video"
  }
}
```

#### call:ended
```json
{
  "event": "call:ended",
  "data": {
    "callId": "call9",
    "duration": 120
  }
}
```

#### call:missed
```json
{
  "event": "call:missed",
  "data": {
    "callId": "call9",
    "contactId": "c1"
  }
}
```

### Сохранённые сообщения

#### saved-message:created
```json
{
  "event": "saved-message:created",
  "data": {
    "id": "saved9",
    "text": "Новое сохранённое сообщение",
    "timestamp": "2026-01-15T16:30:00Z"
  }
}
```

#### saved-message:deleted
```json
{
  "event": "saved-message:deleted",
  "data": {
    "id": "saved9"
  }
}
```

---

## Примечания для бэкенд-разработчиков

### Аутентификация
- Все endpoints требуют JWT токен в заголовке `Authorization: Bearer <token>`
- WebSocket соединения также требуют аутентификацию при подключении

### Пагинация
- Использовать `limit` и `offset` для пагинации
- Возвращать `total` для отображения общего количества записей

### Валидация
- `phone`: формат +7 (XXX) XXX-XX-XX
- `username`: начинается с @, только латинские буквы, цифры и _
- `avatarColor`: HEX формат (#RRGGBB)
- `duration`: положительное число в секундах

### Индексы для базы данных
```sql
-- Контакты
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_username ON contacts(username);

-- Звонки
CREATE INDEX idx_calls_user_id ON calls(user_id);
CREATE INDEX idx_calls_contact_id ON calls(contact_id);
CREATE INDEX idx_calls_timestamp ON calls(timestamp DESC);
CREATE INDEX idx_calls_type ON calls(type);

-- Сохранённые сообщения
CREATE INDEX idx_saved_messages_user_id ON saved_messages(user_id);
CREATE INDEX idx_saved_messages_timestamp ON saved_messages(timestamp DESC);
CREATE INDEX idx_saved_messages_type ON saved_messages(type);
```

### Кэширование
- Контакты: кэшировать на 5 минут
- История звонков: кэшировать на 1 минуту
- Сохранённые сообщения: кэшировать на 5 минут

### Безопасность
- Шифровать телефонные номера в базе данных
- Валидировать все входные данные
- Ограничивать частоту запросов (rate limiting)
- Логировать все действия с контактами и звонками

---

## Тестовые данные

В папке `src/data/extendedMockData.ts` находятся моковые данные для тестирования фронтенда:
- `mockContacts` - 8 контактов
- `mockCalls` - 8 записей о звонках
- `mockSavedMessages` - 8 сохранённых сообщений

Эти данные можно использовать для тестирования API endpoints.

---

## Следующие шаги

1. Реализовать REST API endpoints согласно спецификации
2. Настроить WebSocket сервер для real-time обновлений
3. Интегрировать с существующей системой аутентификации
4. Настроить базу данных с необходимыми индексами
5. Реализовать валидацию и обработку ошибок
6. Добавить rate limiting и кэширование
7. Написать unit и integration тесты
8. Создать документацию для фронтенд-разработчиков

---

**Версия API:** 1.0.0  
**Дата создания:** 2026-01-15  
**Статус:** Готово к реализации
