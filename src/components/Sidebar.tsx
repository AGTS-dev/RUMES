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
      const days_arr = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      return days_arr[date.getDay()];
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full relative overflow-hidden glass-panel">
      {/* Background orbs */}
      <div className="bg-orb w-72 h-72 bg-indigo-600 opacity-[0.07] -top-32 -left-32" />
      <div className="bg-orb w-56 h-56 bg-violet-500 opacity-[0.05] bottom-10 -right-20" />

      {/* Header */}
      <div className="relative z-10 px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold gradient-text">TeleChat</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="glass-btn w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="glass-btn w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full glass-input text-white placeholder-gray-500 rounded-xl px-4 py-2.5 pl-10 outline-none text-sm"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mx-4" />

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto relative z-10 px-2 py-2">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`chat-item flex items-center gap-3 px-3 py-2.5 mx-1 my-0.5 rounded-xl cursor-pointer ${
              activeChatId === chat.id ? 'active' : ''
            }`}
          >
            <Avatar
              emoji={chat.avatar}
              online={chat.online}
              size="md"
              gradient={getGradient(chat.id)}
            />

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="font-medium text-[14px] text-white/90 truncate">
                  {chat.name}
                </h3>
                <span className={`text-[11px] flex-shrink-0 font-medium ${
                  chat.unreadCount > 0 ? 'text-indigo-400' : 'text-gray-500'
                }`}>
                  {formatTime(chat.lastMessageTime)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2 mt-0.5">
                <p className="text-[13px] text-gray-500 truncate leading-snug">
                  {chat.isTyping ? (
                    <span className="text-indigo-400 italic">печатает...</span>
                  ) : (
                    chat.lastMessage
                  )}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="unread-badge flex-shrink-0 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="w-14 h-14 rounded-2xl glass-surface flex items-center justify-center mb-3">
              <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
