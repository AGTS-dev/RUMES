import { Chat } from '../data/mockData';

interface ChatHeaderProps {
  chat: Chat;
  onBack: () => void;
}

export default function ChatHeader({ chat, onBack }: ChatHeaderProps) {
  return (
    <div className="h-14 bg-telegram-panel border-b border-telegram flex items-center px-4 flex-shrink-0">
      {/* Back button (mobile) */}
      <button
        onClick={onBack}
        className="icon-btn md:hidden mr-2 w-10 h-10 rounded-full flex items-center justify-center text-telegram-gray hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-[14px]"
          style={{ backgroundColor: chat.avatarColor }}
        >
          {chat.avatar}
        </div>
        {chat.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4dcd5e] rounded-full border-2 border-telegram-panel" />
        )}
      </div>

      {/* Name and status */}
      <div className="ml-3 flex-1 min-w-0">
        <h2 className="text-[15px] font-medium text-white truncate">{chat.name}</h2>
        <p className="text-[13px]">
          {chat.isTyping ? (
            <span className="text-telegram-blue">печатает...</span>
          ) : chat.online ? (
            <span className="text-telegram-blue">в сети</span>
          ) : (
            <span className="text-telegram-gray">был(а) недавно</span>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button className="icon-btn w-10 h-10 rounded-full flex items-center justify-center text-telegram-gray hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="icon-btn w-10 h-10 rounded-full flex items-center justify-center text-telegram-gray hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button className="icon-btn w-10 h-10 rounded-full flex items-center justify-center text-telegram-gray hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button className="icon-btn w-10 h-10 rounded-full flex items-center justify-center text-telegram-gray hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
