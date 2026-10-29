import { useState } from 'react';
import { mockContacts } from '../data/extendedMockData';

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatLastSeen = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'был(а) недавно';
    if (hours < 24) return `был(а) ${hours} ч. назад`;
    const days = Math.floor(hours / 24);
    return `был(а) ${days} дн. назад`;
  };

  return (
    <div className="contacts-panel">
      <div className="contacts-header">
        <h1 className="contacts-title">Контакты</h1>
        <button className="icon-btn">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="contacts-search">
        <input
          type="text"
          placeholder="Поиск контактов"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="contacts-list">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="contact-item">
            <div 
              className={`avatar ${contact.online ? 'online' : ''}`}
              style={{ backgroundColor: contact.avatarColor }}
            >
              {contact.avatar}
            </div>
            <div className="contact-info">
              <div className="contact-name">{contact.name}</div>
              <div className="contact-status">
                {contact.online ? 'в сети' : formatLastSeen(contact.lastSeen)}
              </div>
            </div>
            <div className="contact-actions">
              <button className="icon-btn" title="Позвонить">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button className="icon-btn" title="Видеозвонок">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <div className="empty-state">
            <p>Контакты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
