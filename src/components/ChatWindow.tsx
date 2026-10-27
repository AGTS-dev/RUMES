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

  const handleSend = (text: string) => {
    onSendMessage(chat.id, text);
  };

  // Determine if we should show tail (first message in group)
  const shouldShowTail = (index: number) => {
    if (index === 0) return true;
    return chat.messages[index].senderId !== chat.messages[index - 1].senderId;
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: { message: typeof chat.messages[0]; index: number }[] }[] = [];
    let currentDate = '';

    chat.messages.forEach((message, index) => {
      const dateStr = message.timestamp.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
      });

      if (dateStr !== currentDate) {
        currentDate = dateStr;
        groups.push({ date: dateStr, messages: [] });
      }

      groups[groups.length - 1].messages.push({ message, index });
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col h-full">
      <ChatHeader chat={chat} onBack={onBack} />

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-2"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23182533' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#0e1621',
        }}
      >
        {messageGroups.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex justify-center my-3">
              <span className="bg-[#182533]/80 text-[#6c7883] text-[13px] px-3 py-1 rounded-full backdrop-blur-sm">
                {group.date}
              </span>
            </div>

            {/* Messages */}
            {group.messages.map(({ message, index }) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUser.id}
                showTail={shouldShowTail(index)}
              />
            ))}
          </div>
        ))}

        {/* Typing indicator */}
        {chat.isTyping && (
          <div className="flex justify-start mt-2">
            <div className="bg-[#182533] px-4 py-2 rounded-lg rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#6c7883] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-[#6c7883] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-[#6c7883] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={handleSend} />
    </div>
  );
}
