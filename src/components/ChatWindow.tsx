import { useEffect, useRef } from 'react';
import { Chat, currentUser } from '../data/mockData';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (chatId: string, text: string) => void;
  onBack: () => void;
}

export default function ChatWindow({ chat, onSendMessage, onBack }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

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
    <div className="flex flex-col h-full relative overflow-hidden">
      <ChatHeader chat={chat} onBack={onBack} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto chat-bg px-4 py-3">
        {messageGroups.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex justify-center my-3">
              <span className="bg-telegram-panel/80 text-telegram-gray text-[13px] font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                {group.date}
              </span>
            </div>

            {/* Messages */}
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

        {/* Typing indicator */}
        {chat.isTyping && (
          <div className="flex justify-start mb-1">
            <div className="msg-incoming px-3 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-telegram-gray rounded-full typing-dot-1" />
                <span className="w-2 h-2 bg-telegram-gray rounded-full typing-dot-2" />
                <span className="w-2 h-2 bg-telegram-gray rounded-full typing-dot-3" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={(text) => onSendMessage(chat.id, text)} />
    </div>
  );
}
