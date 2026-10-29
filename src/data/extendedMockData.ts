export interface Contact {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  phone: string;
  username?: string;
  online: boolean;
  lastSeen?: Date;
  bio?: string;
}

export interface Call {
  id: string;
  contactId: string;
  contactName: string;
  avatar: string;
  avatarColor: string;
  type: 'incoming' | 'outgoing' | 'missed';
  callType: 'audio' | 'video';
  timestamp: Date;
  duration?: number; // в секундах
}

export interface SavedMessage {
  id: string;
  text: string;
  timestamp: Date;
  fromChat?: string;
  fromChatAvatar?: string;
  fromChatColor?: string;
  type: 'text' | 'link' | 'note';
}

export const mockContacts: Contact[] = [
  {
    id: 'c1',
    name: 'Алексей Петров',
    avatar: 'АП',
    avatarColor: '#e17076',
    phone: '+7 (999) 123-45-67',
    username: '@alexey_petrov',
    online: true,
    bio: 'Frontend разработчик',
  },
  {
    id: 'c2',
    name: 'Мария Иванова',
    avatar: 'МИ',
    avatarColor: '#7bc862',
    phone: '+7 (999) 234-56-78',
    username: '@maria_ivanova',
    online: true,
    bio: 'UI/UX дизайнер',
  },
  {
    id: 'c3',
    name: 'Дмитрий Козлов',
    avatar: 'ДК',
    avatarColor: '#e17076',
    phone: '+7 (999) 345-67-89',
    username: '@dmitry_kozlov',
    online: false,
    lastSeen: new Date(2026, 0, 15, 10, 30),
    bio: 'Backend разработчик',
  },
  {
    id: 'c4',
    name: 'Елена Сидорова',
    avatar: 'ЕС',
    avatarColor: '#faa05a',
    phone: '+7 (999) 456-78-90',
    username: '@elena_sidorova',
    online: true,
    bio: 'Project Manager',
  },
  {
    id: 'c5',
    name: 'Андрей Волков',
    avatar: 'АВ',
    avatarColor: '#6ec9cb',
    phone: '+7 (999) 567-89-01',
    username: '@andrey_volkov',
    online: false,
    lastSeen: new Date(2026, 0, 14, 18, 0),
    bio: 'QA инженер',
  },
  {
    id: 'c6',
    name: 'Ольга Новикова',
    avatar: 'ОН',
    avatarColor: '#faa05a',
    phone: '+7 (999) 678-90-12',
    username: '@olga_novikova',
    online: false,
    lastSeen: new Date(2026, 0, 13, 22, 0),
    bio: 'Маркетолог',
  },
  {
    id: 'c7',
    name: 'Сергей Морозов',
    avatar: 'СМ',
    avatarColor: '#6ec9cb',
    phone: '+7 (999) 789-01-23',
    username: '@sergey_morozov',
    online: false,
    lastSeen: new Date(2026, 0, 12, 15, 0),
    bio: 'DevOps инженер',
  },
  {
    id: 'c8',
    name: 'Наталья Кузнецова',
    avatar: 'НК',
    avatarColor: '#e17076',
    phone: '+7 (999) 890-12-34',
    username: '@natalia_kuznetsova',
    online: true,
    bio: 'HR менеджер',
  },
];

export const mockCalls: Call[] = [
  {
    id: 'call1',
    contactId: 'c1',
    contactName: 'Алексей Петров',
    avatar: 'АП',
    avatarColor: '#e17076',
    type: 'incoming',
    callType: 'video',
    timestamp: new Date(2026, 0, 15, 14, 30),
    duration: 342,
  },
  {
    id: 'call2',
    contactId: 'c2',
    contactName: 'Мария Иванова',
    avatar: 'МИ',
    avatarColor: '#7bc862',
    type: 'outgoing',
    callType: 'audio',
    timestamp: new Date(2026, 0, 15, 12, 0),
    duration: 156,
  },
  {
    id: 'call3',
    contactId: 'c4',
    contactName: 'Елена Сидорова',
    avatar: 'ЕС',
    avatarColor: '#faa05a',
    type: 'missed',
    callType: 'video',
    timestamp: new Date(2026, 0, 15, 10, 15),
  },
  {
    id: 'call4',
    contactId: 'c3',
    contactName: 'Дмитрий Козлов',
    avatar: 'ДК',
    avatarColor: '#e17076',
    type: 'outgoing',
    callType: 'video',
    timestamp: new Date(2026, 0, 14, 18, 0),
    duration: 1823,
  },
  {
    id: 'call5',
    contactId: 'c5',
    contactName: 'Андрей Волков',
    avatar: 'АВ',
    avatarColor: '#6ec9cb',
    type: 'incoming',
    callType: 'audio',
    timestamp: new Date(2026, 0, 14, 15, 30),
    duration: 89,
  },
  {
    id: 'call6',
    contactId: 'c6',
    contactName: 'Ольга Новикова',
    avatar: 'ОН',
    avatarColor: '#faa05a',
    type: 'missed',
    callType: 'audio',
    timestamp: new Date(2026, 0, 14, 12, 0),
  },
  {
    id: 'call7',
    contactId: 'c7',
    contactName: 'Сергей Морозов',
    avatar: 'СМ',
    avatarColor: '#6ec9cb',
    type: 'outgoing',
    callType: 'audio',
    timestamp: new Date(2026, 0, 13, 20, 0),
    duration: 445,
  },
  {
    id: 'call8',
    contactId: 'c8',
    contactName: 'Наталья Кузнецова',
    avatar: 'НК',
    avatarColor: '#e17076',
    type: 'incoming',
    callType: 'video',
    timestamp: new Date(2026, 0, 13, 16, 30),
    duration: 612,
  },
];

export const mockSavedMessages: SavedMessage[] = [
  {
    id: 'saved1',
    text: 'https://react.dev/learn — отличная документация по React',
    timestamp: new Date(2026, 0, 15, 10, 0),
    fromChat: 'Избранное',
    fromChatAvatar: '⭐',
    fromChatColor: '#5ca0d4',
    type: 'link',
  },
  {
    id: 'saved2',
    text: 'Не забыть: купить молоко, хлеб, яйца',
    timestamp: new Date(2026, 0, 15, 9, 0),
    fromChat: 'Избранное',
    fromChatAvatar: '⭐',
    fromChatColor: '#5ca0d4',
    type: 'note',
  },
  {
    id: 'saved3',
    text: 'Встреча с командой завтра в 10:00, подготовка презентации',
    timestamp: new Date(2026, 0, 14, 18, 30),
    fromChat: 'Команда разработки',
    fromChatAvatar: 'КР',
    fromChatColor: '#6ec9cb',
    type: 'text',
  },
  {
    id: 'saved4',
    text: 'https://github.com/facebook/react — репозиторий React',
    timestamp: new Date(2026, 0, 14, 15, 0),
    fromChat: 'Алексей Петров',
    fromChatAvatar: 'АП',
    fromChatColor: '#e17076',
    type: 'link',
  },
  {
    id: 'saved5',
    text: 'Идеи для проекта: мессенджер, таск-менеджер, CRM система',
    timestamp: new Date(2026, 0, 13, 12, 0),
    fromChat: 'Избранное',
    fromChatAvatar: '⭐',
    fromChatColor: '#5ca0d4',
    type: 'note',
  },
  {
    id: 'saved6',
    text: 'Дедлайн по проекту — 20 января, нужно успеть сделать тесты',
    timestamp: new Date(2026, 0, 12, 16, 0),
    fromChat: 'Елена Сидорова',
    fromChatAvatar: 'ЕС',
    fromChatColor: '#faa05a',
    type: 'text',
  },
  {
    id: 'saved7',
    text: 'https://tailwindcss.com — утилитарный CSS фреймворк',
    timestamp: new Date(2026, 0, 11, 14, 0),
    fromChat: 'Мария Иванова',
    fromChatAvatar: 'МИ',
    fromChatColor: '#7bc862',
    type: 'link',
  },
  {
    id: 'saved8',
    text: 'Позвонить маме в воскресенье',
    timestamp: new Date(2026, 0, 10, 10, 0),
    fromChat: 'Избранное',
    fromChatAvatar: '⭐',
    fromChatColor: '#5ca0d4',
    type: 'note',
  },
];
