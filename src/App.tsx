import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { mockChats, Chat, Message } from './data/mockData';

function App() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const activeChat = chats.find(chat => chat.id === activeChatId) || null;

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
    setIsMobileChatOpen(true);
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ));
  }, []);

  const handleSendMessage = useCallback((chatId: string, text: string) => {
    const newMessage: Message = {
      id: `${chatId}-${Date.now()}`,
      text,
      timestamp: new Date(),
      senderId: 'me',
      status: 'sent',
    };

    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: text,
            lastMessageTime: new Date(),
          }
        : chat
    ));

    // Simulate typing
    setTimeout(() => {
      setChats(prev => prev.map(chat =>
        chat.id === chatId ? { ...chat, isTyping: true } : chat
      ));
    }, 500);

    // Simulate reply
    setTimeout(() => {
      const replies = [
        'Интересно! Расскажи подробнее 👀',
        'Хорошо, понял!',
        'Отличная идея! 💡',
        'Ок, сделаю 👌',
        'Согласен! 👍',
        'Давай обсудим позже',
        'Круто! 🔥',
        'Спасибо за информацию!',
        'Звучит здорово! 🎉',
        'Да, конечно!',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const replyMessage: Message = {
        id: `${chatId}-reply-${Date.now()}`,
        text: randomReply,
        timestamp: new Date(),
        senderId: chatId,
        status: 'delivered',
      };

      setChats(prev => prev.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, replyMessage],
              lastMessage: randomReply,
              lastMessageTime: new Date(),
              isTyping: false,
            }
          : chat
      ));
    }, 2000 + Math.random() * 2000);
  }, []);

  const handleBack = useCallback(() => {
    setIsMobileChatOpen(false);
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#0b0d14] relative">
      {/* Global background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="bg-orb w-[600px] h-[600px] bg-indigo-600 opacity-[0.03] top-1/4 left-1/4" />
        <div className="bg-orb w-[500px] h-[500px] bg-violet-500 opacity-[0.02] bottom-0 right-1/4" />
      </div>

      {/* Sidebar */}
      <div className={`${isMobileChatOpen ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[360px] lg:w-[400px] flex-shrink-0 relative z-20 border-r border-white/5`}>
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Chat Window */}
      <div className={`${isMobileChatOpen ? 'flex' : 'hidden md:flex'} flex-col flex-1 min-w-0 relative z-10`}>
        {activeChat ? (
          <div className="h-full anim-fade-up">
            <ChatWindow
              chat={activeChat}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
            />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden glass-panel">
      {/* Background orbs */}
      <div className="bg-orb w-80 h-80 bg-indigo-600 opacity-[0.05] top-1/4 left-1/4 anim-float" />
      <div className="bg-orb w-64 h-64 bg-violet-500 opacity-[0.04] bottom-1/4 right-1/4 anim-float" style={{ animationDelay: '1.5s' }} />

      <div className="text-center relative z-10 anim-fade-up">
        {/* Icon */}
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-2xl glass-surface flex items-center justify-center shadow-xl">
            <span className="text-4xl anim-float">💬</span>
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 opacity-60 blur-sm" />
          <div className="absolute -bottom-1 -left-2 w-4 h-4 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 opacity-40 blur-sm" />
        </div>

        <h2 className="text-xl font-semibold gradient-text mb-2">TeleChat Messenger</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
          Выберите чат из списка, чтобы начать общение
        </p>

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 typing-dot-1" />
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 typing-dot-2" />
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 typing-dot-3" />
        </div>
      </div>
    </div>
  );
}

export default App;
