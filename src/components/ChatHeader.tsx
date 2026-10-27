import { Chat } from '../data/mockData';
import Avatar, { getGradient } from './Avatar';

interface ChatHeaderProps {
  chat: Chat;
  onBack: () => void;
}

export default function ChatHeader({ chat, onBack }: ChatHeaderProps) {
  return (
    <div className="glass h-16 flex items-center px-4 flex-shrink-0 relative z-10">
      {/* Back button (mobile) */}
      <button
        onClick={onBack}
        className="md:hidden mr-3 w-9 h-9 rounded-xl glass-light flex items-center justify-center text-gray-400 hover:text-violet-400 transition-all duration-200 active:scale-90"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Avatar */}
      <Avatar
        emoji={chat.avatar}
        online={chat.online}
        size="sm"
        gradient={getGradient(chat.id)}
      />

      {/* Name and status */}
      <div className="ml-3 flex-1 min-w-0">
        <h2 className="text-white font-semibold text-[15px] truncate">{chat.name}</h2>
        <p className="text-[12px] font-medium">
          {chat.isTyping ? (
            <span className="text-violet-400 animate-pulse">печатает...</span>
          ) : chat.online ? (
            <span className="text-emerald-400">в сети</span>
          ) : (
            <span className="text-gray-500">был(а) недавно</span>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button className="w-9 h-9 rounded-xl glass-light flex items-center justify-center text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-200 active:scale-90">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-xl glass-light flex items-center justify-center text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-200 active:scale-90">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-xl glass-light flex items-center justify-center text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-200 active:scale-90">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
