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

  const shouldShowTail = (index: number) => {
    if (index === 0) return true;
    return chat.messages[index].senderId !== chat.messages[index - 1].senderId;
  };

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
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Background orbs for chat */}
      <div className="bg-orb w-96 h-96 bg-violet-600 -top-40 -right-40 opacity-10" />
      <div className="bg-orb w-72 h-72 bg-cyan-500 -bottom-20 -left-20 opacity-10" />

      <ChatHeader chat={chat} onBack={onBack} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 relative z-10">
        {messageGroups.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex justify-center my-4">
              <span className="glass-light text-gray-400 text-[11px] font-medium px-4 py-1.5 rounded-full backdrop-blur-md">
                {group.date}
              </span>
            </div>

            {/* Messages */}
            {group.messages.map(({ message, index }, groupMsgIndex) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUser.id}
                showTail={shouldShowTail(index)}
                isLast={index === chat.messages.length - 1}
              />
            ))}
          </div>
        ))}

        {/* Typing indicator */}
        {chat.isTyping && (
          <div className="flex justify-start mt-3 animate-fade-in-up">
            <div className="glass-light px-4 py-3 rounded-2xl rounded-tl-md shadow-lg shadow-black/5">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-violet-400 rounded-full typing-dot-1" />
                <span className="w-2 h-2 bg-violet-400 rounded-full typing-dot-2" />
                <span className="w-2 h-2 bg-violet-400 rounded-full typing-dot-3" />
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
