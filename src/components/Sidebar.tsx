import { Chat } from '../data/mockData';
import Avatar, { getGradient } from './Avatar';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Sidebar({ chats, activeChatId, onSelectChat, searchQuery, onSearchChange }: SidebarProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Вчера';
    } else if (days < 7) {
      return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="bg-orb w-64 h-64 bg-violet-600 -top-20 -left-20" />
      <div className="bg-orb w-48 h-48 bg-cyan-500 bottom-20 -right-10" />

      {/* Header */}
      <div className="relative z-10 px-4 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold gradient-text tracking-tight">TeleChat</h1>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl glass-light flex items-center justify-center text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-200 active:scale-90">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button className="w-9 h-9 rounded-xl glass-light flex items-center justify-center text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-200 active:scale-90">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Поиск чатов..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full glass-light text-white placeholder-gray-500 rounded-2xl px-5 py-2.5 pl-11 outline-none input-glow transition-all duration-300 text-sm"
          />
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto relative z-10 px-2 pb-2">
        {filteredChats.map((chat, index) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`chat-item flex items-center px-3 py-3 mx-1 my-0.5 rounded-2xl cursor-pointer ${
              activeChatId === chat.id ? 'active' : ''
            }`}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            {/* Avatar */}
            <div className={activeChatId === chat.id ? 'scale-105 transition-transform duration-200' : 'transition-transform duration-200'}>
              <Avatar
                emoji={chat.avatar}
                online={chat.online}
                size="md"
                gradient={getGradient(chat.id)}
              />
            </div>

            {/* Chat Info */}
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className={`font-semibold text-sm truncate transition-colors duration-200 ${
                  activeChatId === chat.id ? 'text-white' : 'text-gray-200'
                }`}>
                  {chat.name}
                </h3>
                <span className={`text-[11px] flex-shrink-0 ml-2 font-medium transition-colors duration-200 ${
                  chat.unreadCount > 0 ? 'text-violet-400' : 'text-gray-500'
                }`}>
                  {formatTime(chat.lastMessageTime)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-[13px] text-gray-500 truncate leading-tight">
                  {chat.isTyping ? (
                    <span className="text-violet-400 font-medium">печатает...</span>
                  ) : (
                    chat.lastMessage
                  )}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 flex-shrink-0 bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg shadow-violet-500/30">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
