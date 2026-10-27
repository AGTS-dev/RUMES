import { Chat } from '../data/mockData';

interface ChatHeaderProps {
  chat: Chat;
  onBack: () => void;
}

export default function ChatHeader({ chat, onBack }: ChatHeaderProps) {
  return (
    <div className="h-14 bg-[#17212b] border-b border-[#0e1621] flex items-center px-4 flex-shrink-0">
      {/* Back button (mobile) */}
      <button
        onClick={onBack}
        className="md:hidden mr-2 text-[#6c7883] hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#2b5278] flex items-center justify-center text-xl">
          {chat.avatar}
        </div>
        {chat.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4dcd5e] rounded-full border-2 border-[#17212b]"></div>
        )}
      </div>

      {/* Name and status */}
      <div className="ml-3 flex-1">
        <h2 className="text-white font-medium text-[15px]">{chat.name}</h2>
        <p className="text-[13px] text-[#6c7883]">
          {chat.isTyping ? (
            <span className="text-[#5ca0d4]">печатает...</span>
          ) : chat.online ? (
            <span className="text-[#6c7883]">в сети</span>
          ) : (
            <span>был(а) недавно</span>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="text-[#6c7883] hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="text-[#6c7883] hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button className="text-[#6c7883] hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
