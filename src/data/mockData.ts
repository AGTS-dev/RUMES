export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  senderId: string;
  senderName?: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
  messages: Message[];
  isTyping?: boolean;
  isGroup?: boolean;
  isChannel?: boolean;
  isBot?: boolean;
}

export const currentUser = {
  id: 'me',
  name: 'Вы',
  avatar: 'А',
  avatarColor: '#5ca0d4',
};

export const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Алексей Петров',
    avatar: 'АП',
    avatarColor: '#e17076',
    lastMessage: 'Привет! Как дела с проектом?',
    lastMessageTime: new Date(2026, 0, 15, 14, 30),
    unreadCount: 2,
    online: true,
    messages: [
      { id: '1-1', text: 'Привет! Как дела?', timestamp: new Date(2026, 0, 15, 10, 0), senderId: '1', status: 'read' },
      { id: '1-2', text: 'Привет! Всё отлично, работаю над новым проектом 🚀', timestamp: new Date(2026, 0, 15, 10, 5), senderId: 'me', status: 'read' },
      { id: '1-3', text: 'Круто! Что за проект?', timestamp: new Date(2026, 0, 15, 10, 10), senderId: '1', status: 'read' },
      { id: '1-4', text: 'Делаю клон Telegram на React', timestamp: new Date(2026, 0, 15, 10, 15), senderId: 'me', status: 'read' },
      { id: '1-5', text: 'Вау, звучит интересно! Покажешь когда будет готово?', timestamp: new Date(2026, 0, 15, 14, 25), senderId: '1', status: 'delivered' },
      { id: '1-6', text: 'Привет! Как дела с проектом?', timestamp: new Date(2026, 0, 15, 14, 30), senderId: '1', status: 'delivered' },
    ],
  },
  {
    id: '2',
    name: 'Мария Иванова',
    avatar: 'МИ',
    avatarColor: '#7bc862',
    lastMessage: 'Дизайн готов, отправляю макеты',
    lastMessageTime: new Date(2026, 0, 15, 12, 0),
    unreadCount: 0,
    online: true,
    messages: [
      { id: '2-1', text: 'Привет, Маша! Как продвигается дизайн?', timestamp: new Date(2026, 0, 15, 9, 0), senderId: 'me', status: 'read' },
      { id: '2-2', text: 'Привет! Уже почти закончила основные экраны', timestamp: new Date(2026, 0, 15, 9, 30), senderId: '2', status: 'read' },
      { id: '2-3', text: 'Отлично! Жду макеты', timestamp: new Date(2026, 0, 15, 9, 35), senderId: 'me', status: 'read' },
      { id: '2-4', text: 'Дизайн готов, отправляю макеты', timestamp: new Date(2026, 0, 15, 12, 0), senderId: '2', status: 'read' },
    ],
  },
  {
    id: '3',
    name: 'Команда разработки',
    avatar: 'КР',
    avatarColor: '#6ec9cb',
    lastMessage: 'Деплой в 18:00, все готовы?',
    lastMessageTime: new Date(2026, 0, 15, 11, 0),
    unreadCount: 5,
    online: false,
    isGroup: true,
    messages: [
      { id: '3-1', text: 'Всем привет! Напоминаю про релиз', timestamp: new Date(2026, 0, 15, 8, 0), senderId: '3-leader', senderName: 'Иван Сидоров', status: 'read' },
      { id: '3-2', text: 'Фронт готов, тестирую', timestamp: new Date(2026, 0, 15, 9, 0), senderId: 'me', status: 'read' },
      { id: '3-3', text: 'Бэкенд тоже на финальной стадии', timestamp: new Date(2026, 0, 15, 9, 15), senderId: '3-backend', senderName: 'Дмитрий Козлов', status: 'read' },
      { id: '3-4', text: 'Отлично! Какие баги остались?', timestamp: new Date(2026, 0, 15, 10, 0), senderId: '3-leader', senderName: 'Иван Сидоров', status: 'read' },
      { id: '3-5', text: 'Пара мелких, исправлю до обеда', timestamp: new Date(2026, 0, 15, 10, 30), senderId: 'me', status: 'read' },
      { id: '3-6', text: 'Деплой в 18:00, все готовы?', timestamp: new Date(2026, 0, 15, 11, 0), senderId: '3-leader', senderName: 'Иван Сидоров', status: 'delivered' },
    ],
  },
  {
    id: '4',
    name: 'Дмитрий Козлов',
    avatar: 'ДК',
    avatarColor: '#e17076',
    lastMessage: 'Спасибо за помощь! 🙏',
    lastMessageTime: new Date(2026, 0, 14, 20, 0),
    unreadCount: 0,
    online: false,
    messages: [
      { id: '4-1', text: 'Дим, можешь помочь с настройкой Docker?', timestamp: new Date(2026, 0, 14, 15, 0), senderId: 'me', status: 'read' },
      { id: '4-2', text: 'Конечно! Что именно нужно?', timestamp: new Date(2026, 0, 14, 15, 10), senderId: '4', status: 'read' },
      { id: '4-3', text: 'Нужно настроить multi-stage build', timestamp: new Date(2026, 0, 14, 15, 15), senderId: 'me', status: 'read' },
      { id: '4-4', text: 'Скинул тебе пример конфига в почту', timestamp: new Date(2026, 0, 14, 16, 0), senderId: '4', status: 'read' },
      { id: '4-5', text: 'Спасибо за помощь! 🙏', timestamp: new Date(2026, 0, 14, 20, 0), senderId: 'me', status: 'read' },
    ],
  },
  {
    id: '5',
    name: 'Елена Сидорова',
    avatar: 'ЕС',
    avatarColor: '#faa05a',
    lastMessage: 'Встреча перенесена на завтра',
    lastMessageTime: new Date(2026, 0, 14, 16, 0),
    unreadCount: 1,
    online: true,
    messages: [
      { id: '5-1', text: 'Добрый день! Напоминаю про встречу в 15:00', timestamp: new Date(2026, 0, 14, 10, 0), senderId: '5', status: 'read' },
      { id: '5-2', text: 'Да, буду вовремя', timestamp: new Date(2026, 0, 14, 10, 5), senderId: 'me', status: 'read' },
      { id: '5-3', text: 'Встреча перенесена на завтра', timestamp: new Date(2026, 0, 14, 16, 0), senderId: '5', status: 'delivered' },
    ],
  },
  {
    id: '6',
    name: 'Избранное',
    avatar: '⭐',
    avatarColor: '#5ca0d4',
    lastMessage: 'Не забыть: купить молоко',
    lastMessageTime: new Date(2026, 0, 13, 9, 0),
    unreadCount: 0,
    online: false,
    messages: [
      { id: '6-1', text: 'Ссылка на документацию: https://react.dev', timestamp: new Date(2026, 0, 12, 14, 0), senderId: 'me', status: 'read' },
      { id: '6-2', text: 'Идеи для проекта: мессенджер, таск-менеджер', timestamp: new Date(2026, 0, 13, 9, 0), senderId: 'me', status: 'read' },
    ],
  },
  {
    id: '7',
    name: 'Андрей Волков',
    avatar: 'АВ',
    avatarColor: '#6ec9cb',
    lastMessage: 'Го в кино в пятницу?',
    lastMessageTime: new Date(2026, 0, 13, 18, 0),
    unreadCount: 0,
    online: false,
    messages: [
      { id: '7-1', text: 'Здорово! Какие планы на выходные?', timestamp: new Date(2026, 0, 13, 17, 0), senderId: '7', status: 'read' },
      { id: '7-2', text: 'Пока свободен, а что предлагаешь?', timestamp: new Date(2026, 0, 13, 17, 30), senderId: 'me', status: 'read' },
      { id: '7-3', text: 'Го в кино в пятницу?', timestamp: new Date(2026, 0, 13, 18, 0), senderId: '7', status: 'read' },
    ],
  },
  {
    id: '8',
    name: 'Telegram News',
    avatar: '📢',
    avatarColor: '#5ca0d4',
    lastMessage: 'Новое обновление Telegram 10.5!',
    lastMessageTime: new Date(2026, 0, 13, 10, 0),
    unreadCount: 3,
    online: false,
    isChannel: true,
    messages: [
      { id: '8-1', text: 'Telegram получил крупное обновление!', timestamp: new Date(2026, 0, 12, 9, 0), senderId: '8', status: 'read' },
      { id: '8-2', text: 'Добавлены новые функции для групп', timestamp: new Date(2026, 0, 12, 15, 0), senderId: '8', status: 'read' },
      { id: '8-3', text: 'Новое обновление Telegram 10.5!', timestamp: new Date(2026, 0, 13, 10, 0), senderId: '8', status: 'delivered' },
    ],
  },
  {
    id: '9',
    name: 'Ольга Новикова',
    avatar: 'ОН',
    avatarColor: '#faa05a',
    lastMessage: 'Фото с вечеринки отправила в облако',
    lastMessageTime: new Date(2026, 0, 12, 22, 0),
    unreadCount: 0,
    online: false,
    messages: [
      { id: '9-1', text: 'Как прошла вечеринка?', timestamp: new Date(2026, 0, 12, 20, 0), senderId: 'me', status: 'read' },
      { id: '9-2', text: 'Было супер! 🎉', timestamp: new Date(2026, 0, 12, 20, 30), senderId: '9', status: 'read' },
      { id: '9-3', text: 'Фото с вечеринки отправила в облако', timestamp: new Date(2026, 0, 12, 22, 0), senderId: '9', status: 'read' },
    ],
  },
  {
    id: '10',
    name: 'Dev Bot',
    avatar: '🤖',
    avatarColor: '#7bc862',
    lastMessage: 'Ваш код успешно деплоен ✅',
    lastMessageTime: new Date(2026, 0, 12, 15, 0),
    unreadCount: 0,
    online: false,
    isBot: true,
    messages: [
      { id: '10-1', text: '/deploy production', timestamp: new Date(2026, 0, 12, 14, 55), senderId: 'me', status: 'read' },
      { id: '10-2', text: 'Начинаю деплой...', timestamp: new Date(2026, 0, 12, 14, 56), senderId: '10', status: 'read' },
      { id: '10-3', text: 'Ваш код успешно деплоен ✅', timestamp: new Date(2026, 0, 12, 15, 0), senderId: '10', status: 'read' },
    ],
  },
  {
    id: '11',
    name: 'Семейный чат',
    avatar: '👨‍👩‍👧',
    avatarColor: '#e17076',
    lastMessage: 'Мама: Не забудьте позвонить бабушке',
    lastMessageTime: new Date(2026, 0, 12, 12, 0),
    unreadCount: 0,
    online: false,
    isGroup: true,
    messages: [
      { id: '11-1', text: 'Всем привет!', timestamp: new Date(2026, 0, 12, 10, 0), senderId: '11-mom', senderName: 'Мама', status: 'read' },
      { id: '11-2', text: 'Привет!', timestamp: new Date(2026, 0, 12, 10, 5), senderId: 'me', status: 'read' },
      { id: '11-3', text: 'Не забудьте позвонить бабушке', timestamp: new Date(2026, 0, 12, 12, 0), senderId: '11-mom', senderName: 'Мама', status: 'read' },
    ],
  },
  {
    id: '12',
    name: 'Сергей Морозов',
    avatar: 'СМ',
    avatarColor: '#6ec9cb',
    lastMessage: 'До встречи на конференции!',
    lastMessageTime: new Date(2026, 0, 11, 18, 0),
    unreadCount: 0,
    online: false,
    messages: [
      { id: '12-1', text: 'Будешь на конференции в следующем месяце?', timestamp: new Date(2026, 0, 11, 15, 0), senderId: '12', status: 'read' },
      { id: '12-2', text: 'Да, уже купил билет', timestamp: new Date(2026, 0, 11, 15, 30), senderId: 'me', status: 'read' },
      { id: '12-3', text: 'Отлично! Увидимся там', timestamp: new Date(2026, 0, 11, 16, 0), senderId: '12', status: 'read' },
      { id: '12-4', text: 'До встречи на конференции!', timestamp: new Date(2026, 0, 11, 18, 0), senderId: 'me', status: 'read' },
    ],
  },
];
