import { useState, useCallback } from 'react';
import LeftSidebar from './components/LeftSidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import { mockChats, Chat, Message } from './data/mockData';

type TabType = 'chats' | 'contacts' | 'calls' | 'saved' | 'settings';
type FilterType = 'all' | 'personal' | 'groups' | 'channels' | 'bots';

function App() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

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
    <div className="h-screen w-screen flex overflow-hidden bg-telegram-bg">
      {/* Left Sidebar (70px) */}
      <div className="hidden md:block">
        <LeftSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onMenuClick={() => console.log('Menu clicked')}
          onSearchClick={() => console.log('Search clicked')}
        />
      </div>

      {/* Chat List */}
      <div className={`${isMobileChatOpen ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[380px] lg:w-[420px] flex-shrink-0`}>
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Chat Window */}
      <div className={`${isMobileChatOpen ? 'flex' : 'hidden md:flex'} flex-col flex-1 min-w-0`}>
        {activeChat ? (
          <div className="h-full anim-fade">
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
    <div className="flex-1 flex items-center justify-center chat-bg">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-telegram-panel flex items-center justify-center">
          <svg className="w-10 h-10 text-telegram-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-telegram-gray mb-2">Telegram Web</h2>
        <p className="text-[14px] text-telegram-gray">
          Выберите чат для начала общения
        </p>
      </div>
    </div>
  );
}

export default App;
