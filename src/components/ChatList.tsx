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
    <div className="flex flex-col h-full bg-telegram-panel border-r border-telegram flex-shrink-0">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between flex-shrink-0">
        <h1 className="text-[17px] font-medium text-white">Telegram</h1>
        <button className="icon-btn w-10 h-10 rounded-full flex items-center justify-center text-telegram-gray hover:text-white">
          <Edit3 size={20} strokeWidth={1.8} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full input-telegram text-white placeholder-telegram-gray rounded-xl px-4 py-2 pl-10 text-[14px]"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-telegram-gray"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-3 border-b border-telegram flex-shrink-0">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`tab px-3 py-2.5 text-[13px] font-medium ${
              activeFilter === filter.id ? 'active' : ''
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`chat-item flex items-center px-3 py-2 ${
              activeChatId === chat.id ? 'active' : ''
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div 
                className="w-[54px] h-[54px] rounded-full flex items-center justify-center text-white font-medium text-[18px]"
                style={{ backgroundColor: chat.avatarColor }}
              >
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4dcd5e] rounded-full border-2 border-telegram-panel" />
              )}
            </div>

            {/* Chat Info */}
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[15px] font-medium text-white truncate">
                  {chat.name}
                </h3>
                <span className={`text-[12px] flex-shrink-0 ml-2 ${
                  chat.unreadCount > 0 ? 'text-telegram-blue' : 'text-telegram-gray'
                }`}>
                  {formatTime(chat.lastMessageTime)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className="text-[14px] text-telegram-gray truncate flex-1">
                  {chat.isTyping ? (
                    <span className="text-telegram-blue">печатает...</span>
                  ) : (
                    chat.lastMessage
                  )}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 flex-shrink-0 bg-telegram-blue text-white text-[12px] font-medium rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1.5">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-telegram-gray">
            <Search size={48} strokeWidth={1} className="mb-3 opacity-30" />
            <p className="text-[14px]">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
