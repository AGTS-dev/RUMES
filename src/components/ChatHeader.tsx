import { Chat } from '../data/mockData';

interface ChatHeaderProps {
  chat: Chat;
  onBack: () => void;
}

export default function ChatHeader({ chat, onBack }: ChatHeaderProps) {
  const handleSearch = () => {
    alert('Поиск в чате — функция в разработке');
    console.log('Search in chat clicked');
  };

  const handleCall = () => {
    alert('Звонок — функция в разработке');
    console.log('Call clicked');
  };

  const handleVideoCall = () => {
    alert('Видеозвонок — функция в разработке');
    console.log('Video call clicked');
  };

  const handleMenu = () => {
    alert('Меню чата — функция в разработке');
    console.log('Menu clicked');
  };

  return (
    <div className="chat-header">
      {/* Back button (mobile) */}
      <button
        onClick={onBack}
        className="icon-btn"
        style={{ marginRight: '8px' }}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Avatar */}
      <div 
        className={`chat-header-avatar ${chat.online ? 'online' : ''}`}
        style={{ backgroundColor: chat.avatarColor }}
      >
        {chat.avatar}
      </div>

      {/* Name and status */}
      <div className="chat-header-info">
        <div className="chat-header-name">{chat.name}</div>
        <div className={`chat-header-status ${chat.online ? 'online' : 'offline'}`}>
          {chat.isTyping ? 'печатает...' : chat.online ? 'в сети' : 'был(а) недавно'}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <button className="icon-btn" onClick={handleSearch} title="Поиск">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="icon-btn" onClick={handleCall} title="Звонок">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button className="icon-btn" onClick={handleVideoCall} title="Видеозвонок">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button className="icon-btn" onClick={handleMenu} title="Меню">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
