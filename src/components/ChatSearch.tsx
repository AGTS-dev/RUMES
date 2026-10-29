import { useState, useEffect } from 'react';
import { Message } from '../data/mockData';

interface ChatSearchProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onNavigateToMessage: (messageId: string) => void;
}

export default function ChatSearch({ isOpen, onClose, messages, onNavigateToMessage }: ChatSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Message[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const filtered = messages.filter(msg =>
      msg.text.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, messages]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="chat-search-overlay">
      <div className="chat-search-panel">
        <div className="chat-search-header">
          <input
            type="text"
            placeholder="Поиск в чате..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="chat-search-input"
            autoFocus
          />
          <button className="chat-search-close" onClick={onClose}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="chat-search-results">
          {query && results.length === 0 && (
            <div className="chat-search-empty">Ничего не найдено</div>
          )}
          
          {results.map((msg) => (
            <button
              key={msg.id}
              className="chat-search-result"
              onClick={() => {
                onNavigateToMessage(msg.id);
                onClose();
              }}
            >
              <div className="chat-search-result-text">
                {msg.text.length > 60 ? msg.text.substring(0, 60) + '...' : msg.text}
              </div>
              <div className="chat-search-result-time">
                {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
