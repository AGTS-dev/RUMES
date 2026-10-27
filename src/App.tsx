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

    // Simulate typing indicator
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
        'Давай обсудим это позже',
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
    <div className="h-screen w-screen flex overflow-hidden bg-[#0a0a0f] relative">
      {/* Global background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/3 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <div className={`${isMobileChatOpen ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[360px] lg:w-[400px] flex-shrink-0 relative z-20 border-r border-white/5 animate-slide-in-left`}>
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
          <div className="h-full animate-fade-in-up">
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
    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="text-center relative z-10 animate-fade-in-up">
        {/* Animated icon */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-2xl shadow-violet-500/10">
            <span className="text-5xl animate-float">💬</span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 opacity-60 blur-sm" />
          <div className="absolute -bottom-1 -left-2 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-violet-400 opacity-40 blur-sm" />
        </div>

        <h2 className="text-2xl font-bold gradient-text mb-2">TeleChat Messenger</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
          Выберите чат из списка слева, чтобы начать общение
        </p>

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 typing-dot-1" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 typing-dot-2" />
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 typing-dot-3" />
        </div>
      </div>
    </div>
  );
}

export default App;
