import { Message } from '../data/mockData';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showTail: boolean;
  isLast: boolean;
}

export default function MessageBubble({ message, isOwn, showTail, isLast }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = () => {
    if (message.status === 'read') {
      return (
        <svg className="w-3.5 h-3.5 text-cyan-400 inline-block ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M1 12l5 5L17 6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 12l5 5L23 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    } else if (message.status === 'delivered') {
      return (
        <svg className="w-3.5 h-3.5 text-gray-500 inline-block ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M1 12l5 5L17 6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 12l5 5L23 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    } else {
      return (
        <svg className="w-3 h-3 text-gray-500 inline-block ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
  };

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${showTail ? 'mt-3' : 'mt-0.5'} ${
        isLast ? (isOwn ? 'message-own' : 'message-other') : ''
      }`}
    >
      <div
        className={`relative max-w-[75%] sm:max-w-[65%] px-3.5 py-2 transition-all duration-200 ${
          isOwn
            ? showTail
              ? 'rounded-2xl rounded-tr-md bg-gradient-to-br from-violet-600 to-violet-700 shadow-lg shadow-violet-500/10'
              : 'rounded-2xl rounded-tr-md bg-gradient-to-br from-violet-600 to-violet-700'
            : showTail
              ? 'rounded-2xl rounded-tl-md glass-light shadow-lg shadow-black/5'
              : 'rounded-2xl rounded-tl-md glass-light'
        }`}
      >
        <p className="text-[14px] leading-relaxed text-white/95 break-words pr-12 sm:pr-14">
          {message.text}
        </p>
        <div className={`absolute bottom-1.5 ${isOwn ? 'right-2.5' : 'right-2.5'} flex items-center gap-0.5`}>
          <span className="text-[10px] text-white/40 font-medium">{formatTime(message.timestamp)}</span>
          {isOwn && getStatusIcon()}
        </div>
      </div>
    </div>
  );
}
