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

  return (
    <div className={`message-row ${isOwn ? 'own' : 'other'}`}>
      <div className={`message-bubble ${isOwn ? 'outgoing' : 'incoming'}`}>
        {/* Sender name for groups */}
        {isGroup && !isOwn && message.senderName && (
          <div className="message-sender">{message.senderName}</div>
        )}

        {/* Message text */}
        <div className="message-text">{message.text}</div>

        {/* Time and status */}
        <div className="message-meta">
          <span className="message-time">{formatTime(message.timestamp)}</span>
          {isOwn && (
            <svg className="message-status" viewBox="0 0 16 16" fill="currentColor">
              {message.status === 'read' ? (
                <>
                  <path d="M8 1.5l6.5 6.5-1.5 1.5L8 4.5 3 9.5 1.5 8 8 1.5z" style={{ color: '#5ca0d4' }}/>
                  <path d="M14.5 1.5l1.5 1.5-8 8-4-4 1.5-1.5L8 8l6.5-6.5z" opacity="0.7" style={{ color: '#5ca0d4' }}/>
                </>
              ) : message.status === 'delivered' ? (
                <>
                  <path d="M8 1.5l6.5 6.5-1.5 1.5L8 4.5 3 9.5 1.5 8 8 1.5z"/>
                  <path d="M14.5 1.5l1.5 1.5-8 8-4-4 1.5-1.5L8 8l6.5-6.5z" opacity="0.7"/>
                </>
              ) : (
                <path d="M8 1.5l6.5 6.5-1.5 1.5L8 4.5 3 9.5 1.5 8 8 1.5z"/>
              )}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
