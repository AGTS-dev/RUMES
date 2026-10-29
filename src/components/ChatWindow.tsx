import { useEffect, useRef, useState } from 'react';
import { Chat, currentUser } from '../data/mockData';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import CallModal from './CallModal';
import ChatSearch from './ChatSearch';
import { useTheme } from '../contexts/ThemeContext';

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (chatId: string, text: string) => void;
  onBack: () => void;
  onClearHistory: (chatId: string) => void;
}

export default function ChatWindow({ chat, onSendMessage, onBack, onClearHistory }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [callModal, setCallModal] = useState<{ open: boolean; type: 'audio' | 'video' }>({ open: false, type: 'audio' });
  const [searchOpen, setSearchOpen] = useState(false);
  const { wallpaper } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const shouldShowTail = (index: number) => {
    if (index === 0) return true;
    return chat.messages[index].senderId !== chat.messages[index - 1].senderId;
  };

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: typeof chat.messages }[] = [];
    let currentDate = '';

    chat.messages.forEach((message) => {
      const dateStr = message.timestamp.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
      });

      if (dateStr !== currentDate) {
        currentDate = dateStr;
        groups.push({ date: dateStr, messages: [] });
      }

      groups[groups.length - 1].messages.push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="chat-window-panel">
      <ChatHeader
        chat={chat}
        onBack={onBack}
        onCall={(type) => setCallModal({ open: true, type })}
        onSearch={() => setSearchOpen(true)}
        onClearHistory={() => onClearHistory(chat.id)}
      />

      <div 
        className="messages-container"
        data-wallpaper={wallpaper}
      >
        {messageGroups.map((group) => (
          <div key={group.date}>
            <div className="date-separator">
              <span className="date-separator-text">{group.date}</span>
            </div>

            {group.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUser.id}
                isGroup={chat.isGroup}
              />
            ))}
          </div>
        ))}

        {chat.isTyping && (
          <div className="message-row other">
            <div className="message-bubble incoming">
              <div className="typing-indicator">
                <span className="typing-dot typing-dot-1" />
                <span className="typing-dot typing-dot-2" />
                <span className="typing-dot typing-dot-3" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={(text) => onSendMessage(chat.id, text)} />

      <CallModal
        isOpen={callModal.open}
        onClose={() => setCallModal({ open: false, type: callModal.type })}
        contactName={chat.name}
        contactAvatar={chat.avatar}
        contactAvatarColor={chat.avatarColor}
        callType={callModal.type}
      />

      <ChatSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        messages={chat.messages}
        onNavigateToMessage={(id) => {
          const el = document.getElementById(`msg-${id}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
      />
    </div>
  );
}
