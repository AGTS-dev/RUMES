import { Search, Edit3 } from 'lucide-react';
import { Chat } from '../data/mockData';

type FilterType = 'all' | 'personal' | 'groups' | 'channels' | 'bots';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function ChatList({ 
  chats, 
  activeChatId, 
  onSelectChat, 
  searchQuery, 
  onSearchChange,
  activeFilter,
  onFilterChange
}: ChatListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Вчера';
    } else if (days < 7) {
      const days_arr = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      return days_arr[date.getDay()];
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
  };

  const filters = [
    { id: 'all' as FilterType, label: 'Все' },
    { id: 'personal' as FilterType, label: 'Личные' },
    { id: 'groups' as FilterType, label: 'Группы' },
    { id: 'channels' as FilterType, label: 'Каналы' },
    { id: 'bots' as FilterType, label: 'Боты' },
  ];

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (activeFilter) {
      case 'personal':
        return !chat.isGroup && !chat.isChannel && !chat.isBot && chat.id !== '6';
      case 'groups':
        return chat.isGroup;
      case 'channels':
        return chat.isChannel;
      case 'bots':
        return chat.isBot;
      default:
        return true;
    }
  });

  return (
    <div className="chat-list-panel">
      {/* Header */}
      <div className="header">
        <h1 style={{ fontSize: '17px', fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>RUMES</h1>
        <button className="icon-btn">
          <Edit3 size={20} strokeWidth={1.8} />
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 12px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          <Search
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: 'var(--text-tertiary)'
            }}
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`tab ${activeFilter === filter.id ? 'active' : ''}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
          >
            {/* Avatar */}
            <div 
              className={`avatar ${chat.online ? 'online' : ''}`}
              style={{ backgroundColor: chat.avatarColor }}
            >
              {chat.avatar}
            </div>

            {/* Chat Info */}
            <div className="chat-info">
              <div className="chat-name">{chat.name}</div>
              <div className={`chat-preview ${chat.isTyping ? 'typing' : ''}`}>
                {chat.isTyping ? 'печатает...' : chat.lastMessage}
              </div>
            </div>

            {/* Meta */}
            <div className="chat-meta">
              <div className={`chat-time ${chat.unreadCount > 0 ? 'unread' : ''}`}>
                {formatTime(chat.lastMessageTime)}
              </div>
              {chat.unreadCount > 0 && (
                <div className="unread-badge">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredChats.length === 0 && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '60px 20px',
            color: 'var(--text-tertiary)'
          }}>
            <Search size={48} strokeWidth={1} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px' }}>Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
