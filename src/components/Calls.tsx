import { useState } from 'react';
import { mockCalls } from '../data/extendedMockData';
import CallModal from './CallModal';

type CallFilter = 'all' | 'missed' | 'incoming' | 'outgoing';

export default function Calls() {
  const [filter, setFilter] = useState<CallFilter>('all');
  const [callModal, setCallModal] = useState<{
    open: boolean;
    type: 'audio' | 'video';
    contactName: string;
    contactAvatar: string;
    contactAvatarColor: string;
  }>({
    open: false,
    type: 'audio',
    contactName: '',
    contactAvatar: '',
    contactAvatarColor: '',
  });

  const filteredCalls = mockCalls.filter(call => {
    if (filter === 'all') return true;
    return call.type === filter;
  });

  const formatCallTime = (date: Date) => {
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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallIcon = (type: string, callType: string) => {
    const isVideo = callType === 'video';
    const color = type === 'missed' ? 'var(--error-color, #ff4444)' : 
                  type === 'incoming' ? 'var(--success-color, #4caf50)' : 
                  'var(--info-color, #2196f3)';
    
    if (isVideo) {
      return (
        <svg width="16" height="16" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg width="16" height="16" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    );
  };

  const getCallTypeLabel = (type: string) => {
    switch (type) {
      case 'incoming': return 'Входящий';
      case 'outgoing': return 'Исходящий';
      case 'missed': return 'Пропущенный';
      default: return '';
    }
  };

  return (
    <div className="calls-panel">
      <div className="calls-header">
        <h1 className="calls-title">Звонки</h1>
      </div>

      <div className="calls-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button 
          className={`filter-btn ${filter === 'missed' ? 'active' : ''}`}
          onClick={() => setFilter('missed')}
        >
          Пропущенные
        </button>
        <button 
          className={`filter-btn ${filter === 'incoming' ? 'active' : ''}`}
          onClick={() => setFilter('incoming')}
        >
          Входящие
        </button>
        <button 
          className={`filter-btn ${filter === 'outgoing' ? 'active' : ''}`}
          onClick={() => setFilter('outgoing')}
        >
          Исходящие
        </button>
      </div>

      <div className="calls-list">
        {filteredCalls.map((call) => (
          <div key={call.id} className={`call-item ${call.type === 'missed' ? 'missed' : ''}`}>
            <div 
              className="avatar"
              style={{ backgroundColor: call.avatarColor }}
            >
              {call.avatar}
            </div>
            <div className="call-info">
              <div className="call-name">{call.contactName}</div>
              <div className="call-details">
                {getCallIcon(call.type, call.callType)}
                <span className="call-type">{getCallTypeLabel(call.type)}</span>
                {call.duration && (
                  <span className="call-duration"> • {formatDuration(call.duration)}</span>
                )}
              </div>
            </div>
            <div className="call-meta">
              <div className="call-time">{formatCallTime(call.timestamp)}</div>
              <button 
                className="icon-btn" 
                title="Позвонить снова"
                onClick={() => setCallModal({
                  open: true,
                  type: call.callType,
                  contactName: call.contactName,
                  contactAvatar: call.avatar,
                  contactAvatarColor: call.avatarColor,
                })}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {filteredCalls.length === 0 && (
          <div className="empty-state">
            <p>Звонки не найдены</p>
          </div>
        )}
      </div>

      <CallModal
        isOpen={callModal.open}
        onClose={() => setCallModal({ ...callModal, open: false })}
        contactName={callModal.contactName}
        contactAvatar={callModal.contactAvatar}
        contactAvatarColor={callModal.contactAvatarColor}
        callType={callModal.type}
      />
    </div>
  );
}
