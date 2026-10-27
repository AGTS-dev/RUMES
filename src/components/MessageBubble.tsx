import { Message } from '../data/mockData';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showTail: boolean;
}

export default function MessageBubble({ message, isOwn, showTail }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = () => {
    if (message.status === 'read') {
      return (
        <svg className="w-4 h-4 text-[#5ca0d4] inline-block ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12l5 5L20 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 12l5 5L26 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    } else if (message.status === 'delivered') {
      return (
        <svg className="w-4 h-4 text-[#6c7883] inline-block ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12l5 5L20 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 12l5 5L26 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    } else {
      return (
        <svg className="w-3.5 h-3.5 text-[#6c7883] inline-block ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-0.5 ${showTail ? 'mt-2' : ''}`}>
      <div
        className={`relative max-w-[70%] px-3 py-1.5 rounded-lg ${
          isOwn
            ? 'bg-[#2b5278] text-white'
            : 'bg-[#182533] text-white'
        } ${showTail ? (isOwn ? 'rounded-tr-none' : 'rounded-tl-none') : ''}`}
      >
        <span className="text-[14.5px] leading-relaxed break-words">{message.text}</span>
        <span className="float-right mt-1 ml-2 flex items-center">
          <span className="text-[11px] text-[#6c7883] opacity-80">{formatTime(message.timestamp)}</span>
          {isOwn && getStatusIcon()}
        </span>
      </div>
    </div>
  );
}
