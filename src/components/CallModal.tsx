import { useState, useEffect } from 'react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  contactAvatar: string;
  contactAvatarColor: string;
  callType: 'audio' | 'video';
}

export default function CallModal({ isOpen, onClose, contactName, contactAvatar, contactAvatarColor, callType }: CallModalProps) {
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCallState('ringing');
      setDuration(0);
      return;
    }

    // Имитация подключения через 3 секунды
    const connectTimer = setTimeout(() => {
      setCallState('connected');
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, [isOpen]);

  useEffect(() => {
    if (callState !== 'connected') return;

    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="call-modal-overlay">
      <div className="call-modal">
        <div className="call-modal-content">
          {/* Видео-превью (имитация) */}
          {callType === 'video' && callState === 'connected' && (
            <div className="call-video-preview">
              <div className="call-video-main">
                <div 
                  className="avatar-large"
                  style={{ backgroundColor: contactAvatarColor }}
                >
                  {contactAvatar}
                </div>
              </div>
              <div className="call-video-self">
                <div className="call-video-self-label">Вы</div>
              </div>
            </div>
          )}

          {/* Аудио-интерфейс */}
          {callType === 'audio' && (
            <div className="call-audio-interface">
              <div 
                className="avatar-xlarge"
                style={{ backgroundColor: contactAvatarColor }}
              >
                {contactAvatar}
              </div>
              <h2 className="call-contact-name">{contactName}</h2>
              <p className="call-status">
                {callState === 'ringing' && 'Вызов...'}
                {callState === 'connected' && formatDuration(duration)}
                {callState === 'ended' && 'Звонок завершён'}
              </p>
            </div>
          )}

          {/* Видео-интерфейс (когда ringing) */}
          {callType === 'video' && callState !== 'connected' && (
            <div className="call-audio-interface">
              <div 
                className="avatar-xlarge"
                style={{ backgroundColor: contactAvatarColor }}
              >
                {contactAvatar}
              </div>
              <h2 className="call-contact-name">{contactName}</h2>
              <p className="call-status">
                {callState === 'ringing' && 'Видеовызов...'}
                {callState === 'ended' && 'Звонок завершён'}
              </p>
            </div>
          )}

          {/* Кнопки управления */}
          <div className="call-controls">
            <button className="call-control-btn" title="Микрофон">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            {callType === 'video' && (
              <button className="call-control-btn" title="Камера">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            )}

            <button className="call-control-btn" title="Динамик">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>

            <button 
              className="call-control-btn end-call"
              onClick={handleEndCall}
              title="Завершить"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
