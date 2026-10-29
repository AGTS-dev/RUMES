import { Message } from '../data/mockData';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isGroup?: boolean;
}

export default function MessageBubble({ message, isOwn, isGroup }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const StatusIcon = () => {
    if (message.status === 'read') {
      return (
        <svg className="w-4 h-4 text-[#5ca0d4] inline-block ml-1" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1.5l6.5 6.5-1.5 1.5L8 4.5 3 9.5 1.5 8 8 1.5z"/>
          <path d="M14.5 1.5l1.5 1.5-8 8-4-4 1.5-1.5L8 8l6.5-6.5z" opacity="0.7"/>
        </svg>
      );
    } else if (message.status === 'delivered') {
      return (
        <svg className="w-4 h-4 text-telegram-gray inline-block ml-1" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1.5l6.5 6.5-1.5 1.5L8 4.5 3 9.5 1.5 8 8 1.5z"/>
          <path d="M14.5 1.5l1.5 1.5-8 8-4-4 1.5-1.5L8 8l6.5-6.5z" opacity="0.7"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-3.5 h-3.5 text-telegram-gray inline-block ml-1" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1.5l6.5 6.5-1.5 1.5L8 4.5 3 9.5 1.5 8 8 1.5z"/>
        </svg>
      );
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
      <div
        className={`relative max-w-[65%] px-2.5 py-1.5 ${
          isOwn ? 'msg-outgoing' : 'msg-incoming'
        }`}
      >
        {/* Sender name for groups */}
        {isGroup && !isOwn && message.senderName && (
          <p className="text-[13px] font-medium text-telegram-blue mb-0.5">
            {message.senderName}
          </p>
        )}

        {/* Message text */}
        <p className="text-[14px] text-white leading-relaxed break-words pr-16">
          {message.text}
        </p>

        {/* Time and status */}
        <div className="absolute bottom-1 right-2 flex items-center gap-0.5">
          <span className="text-[11px] text-white/60">{formatTime(message.timestamp)}</span>
          {isOwn && <StatusIcon />}
        </div>
      </div>
    </div>
  );
}
