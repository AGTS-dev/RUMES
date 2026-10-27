import { Chat } from '../data/mockData';

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
    <div className="flex flex-col h-full bg-[#17212b] border-r border-[#0e1621]">
      {/* Search */}
      <div className="p-2 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#242f3d] text-white placeholder-[#6c7883] rounded-lg px-4 py-2 pl-10 outline-none focus:bg-[#2b3a4a] transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6c7883]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-center px-3 py-2 cursor-pointer transition-colors hover:bg-[#202b36] ${
              activeChatId === chat.id ? 'bg-[#2b5278]' : ''
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#2b5278] flex items-center justify-center text-2xl">
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4dcd5e] rounded-full border-2 border-[#17212b]"></div>
              )}
            </div>

            {/* Chat Info */}
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium text-[15px] truncate">{chat.name}</h3>
                <span className="text-[12px] text-[#6c7883] flex-shrink-0 ml-2">
                  {formatTime(chat.lastMessageTime)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className="text-[14px] text-[#6c7883] truncate">
                  {chat.isTyping ? (
                    <span className="text-[#5ca0d4]">печатает...</span>
                  ) : (
                    chat.lastMessage
                  )}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 flex-shrink-0 bg-[#5ca0d4] text-white text-[12px] rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
