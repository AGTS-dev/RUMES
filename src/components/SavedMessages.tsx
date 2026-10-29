import { useState } from 'react';
import { mockSavedMessages } from '../data/extendedMockData';

export default function SavedMessages() {
  const [savedMessages, setSavedMessages] = useState(mockSavedMessages);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = savedMessages.filter(msg =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    if (hours < 24) {
      return `вчера, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} дн. назад`;
    }
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleDelete = (id: string) => {
    setSavedMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'link':
        return (
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'note':
        return (
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
    }
  };

  return (
    <div className="saved-panel">
      <div className="saved-header">
        <h1 className="saved-title">Сохранённые сообщения</h1>
      </div>

      <div className="saved-search">
        <input
          type="text"
          placeholder="Поиск в сохранённых"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="saved-list">
        {filteredMessages.map((msg) => (
          <div key={msg.id} className="saved-item">
            <div className="saved-item-header">
              {msg.fromChat && (
                <div className="saved-from">
                  <div 
                    className="avatar-small"
                    style={{ backgroundColor: msg.fromChatColor }}
                  >
                    {msg.fromChatAvatar}
                  </div>
                  <span className="saved-from-name">{msg.fromChat}</span>
                </div>
              )}
              <div className="saved-time">{formatMessageTime(msg.timestamp)}</div>
            </div>
            
            <div className="saved-content">
              <div className="saved-type-icon">
                {getTypeIcon(msg.type)}
              </div>
              <div className="saved-text">{msg.text}</div>
            </div>

            <div className="saved-actions">
              <button className="icon-btn" title="Копировать">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button 
                className="icon-btn" 
                title="Удалить"
                onClick={() => handleDelete(msg.id)}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="empty-state">
            <p>Сохранённые сообщения не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
