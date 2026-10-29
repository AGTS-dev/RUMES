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

  const StatusIcon = () => {
    if (message.status === 'read') {
      return (
        <svg className="w-3.5 h-3.5 text-indigo-300 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.3 2.3a1 1 0 0 1 1.4 1.4l-8 8a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.4L6 9.6l7.3-7.3z"/>
          <path d="M15.3 2.3a1 1 0 0 1 1.4 1.4l-8 8a1 1 0 0 1-1.4 0l-.5-.5 1.4-1.4.1.1 7-7z" opacity="0.7"/>
        </svg>
      );
    } else if (message.status === 'delivered') {
      return (
        <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.3 2.3a1 1 0 0 1 1.4 1.4l-8 8a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.4L6 9.6l7.3-7.3z"/>
          <path d="M15.3 2.3a1 1 0 0 1 1.4 1.4l-8 8a1 1 0 0 1-1.4 0l-.5-.5 1.4-1.4.1.1 7-7z" opacity="0.7"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-3 h-3 text-gray-500 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.3 2.3a1 1 0 0 1 1.4 1.4l-8 8a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.4L6 9.6l7.3-7.3z"/>
        </svg>
      );
    }
  };

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${showTail ? 'mt-2.5' : 'mt-0.5'} ${
        isLast ? (isOwn ? 'anim-fade-right' : 'anim-fade-left') : ''
      }`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] md:max-w-[60%] px-3 py-2 ${
          isOwn
            ? `msg-own ${showTail ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl'}`
            : `msg-other ${showTail ? 'rounded-2xl rounded-bl-sm' : 'rounded-2xl'}`
        }`}
      >
        <p className="text-[14px] leading-[1.45] text-white/95 break-words whitespace-pre-wrap pr-16">
          {message.text}
        </p>
        <div className={`absolute bottom-1.5 ${isOwn ? 'right-2.5' : 'right-2.5'} flex items-center gap-1 pointer-events-none`}>
          <span className="text-[10.5px] text-white/40 font-medium">{formatTime(message.timestamp)}</span>
          {isOwn && <StatusIcon />}
        </div>
      </div>
    </div>
  );
}
