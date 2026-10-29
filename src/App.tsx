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

  // Render middle panel content based on active tab
  const renderMiddlePanel = () => {
    if (activeTab !== 'chats') {
      return <PlaceholderPanel tab={activeTab} />;
    }
    return (
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
    );
  };

  // Render right panel content
  const renderRightPanel = () => {
    if (activeTab !== 'chats') {
      return <PlaceholderPanel tab={activeTab} />;
    }
    if (activeChat) {
      return (
        <ChatWindow
          chat={activeChat}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
        />
      );
    }
    return <EmptyChatState />;
  };

  return (
    <div className="app-container">
      {/* Left Sidebar (70px) */}
      <LeftSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMenuClick={() => console.log('Menu clicked')}
        onSearchClick={() => console.log('Search clicked')}
      />

      {/* Chat List */}
      <div className={`chat-list-wrapper ${isMobileChatOpen ? 'hidden-mobile' : ''}`}>
        {renderMiddlePanel()}
      </div>

      {/* Chat Window */}
      <div className={`chat-window-wrapper ${!activeChat && activeTab === 'chats' && !isMobileChatOpen ? '' : ''} ${activeTab !== 'chats' ? '' : ''}`}>
        {renderRightPanel()}
      </div>
    </div>
  );
}

// Placeholder for non-chats tabs
function PlaceholderPanel({ tab }: { tab: TabType }) {
  const tabNames: Record<TabType, string> = {
    chats: 'Чаты',
    contacts: 'Контакты',
    calls: 'Звонки',
    saved: 'Сохранённое',
    settings: 'Настройки',
  };

  const tabIcons: Record<TabType, string> = {
    chats: '💬',
    contacts: '👥',
    calls: '📞',
    saved: '⭐',
    settings: '⚙️',
  };

  return (
    <div style={{ 
      width: '360px',
      height: '100%',
      background: '#17212b',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      borderRight: '1px solid #202b36'
    }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '16px',
          opacity: 0.5
        }}>
          {tabIcons[tab]}
        </div>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 500, 
          color: '#6c7883', 
          marginBottom: '8px' 
        }}>
          {tabNames[tab]}
        </h2>
        <p style={{ fontSize: '14px', color: '#6c7883' }}>
          Раздел в разработке
        </p>
      </div>
    </div>
  );
}

// Empty state for chat window
function EmptyChatState() {
  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#0e1621'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '120px', 
          height: '120px', 
          margin: '0 auto 20px', 
          borderRadius: '50%', 
          background: '#17212b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px'
        }}>
          💬
        </div>
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: 500, 
          color: '#6c7883', 
          marginBottom: '8px' 
        }}>
          Telegram Web
        </h2>
        <p style={{ fontSize: '14px', color: '#6c7883' }}>
          Выберите чат для начала общения
        </p>
      </div>
    </div>
  );
}

export default App;
