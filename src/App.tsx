import { useState, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import LeftSidebar from './components/LeftSidebar';
import ResizableChatList from './components/ResizableChatList';
import ChatWindow from './components/ChatWindow';
import Contacts from './components/Contacts';
import Calls from './components/Calls';
import SavedMessages from './components/SavedMessages';
import Settings from './components/Settings';
import { mockChats, Chat, Message } from './data/mockData';

type TabType = 'chats' | 'contacts' | 'calls' | 'saved' | 'settings';
type FilterType = 'all' | 'personal' | 'groups' | 'channels' | 'bots';

function AppContent() {
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

    setTimeout(() => {
      setChats(prev => prev.map(chat =>
        chat.id === chatId ? { ...chat, isTyping: true } : chat
      ));
    }, 500);

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

  const handleClearHistory = useCallback((chatId: string) => {
    if (confirm('Очистить историю сообщений?')) {
      setChats(prev => prev.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [], lastMessage: 'История очищена' }
          : chat
      ));
    }
  }, []);

  const handleBack = useCallback(() => {
    setIsMobileChatOpen(false);
  }, []);

  // Настройки
  if (activeTab === 'settings') {
    return (
      <div className="app-container">
        <LeftSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onMenuClick={() => {}}
          onSearchClick={() => {}}
        />
        <Settings />
      </div>
    );
  }

  // Не чаты
  if (activeTab !== 'chats') {
    let contentComponent;
    
    switch (activeTab) {
      case 'contacts':
        contentComponent = <Contacts />;
        break;
      case 'calls':
        contentComponent = <Calls />;
        break;
      case 'saved':
        contentComponent = <SavedMessages />;
        break;
      default:
        contentComponent = <PlaceholderPanel tab={activeTab} />;
    }
    
    return (
      <div className="app-container">
        <LeftSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onMenuClick={() => {}}
          onSearchClick={() => {}}
        />
        <div className="chat-window-wrapper">
          {contentComponent}
        </div>
      </div>
    );
  }

  // Чаты
  return (
    <div className="app-container">
      <LeftSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMenuClick={() => {}}
        onSearchClick={() => {}}
      />

      <ResizableChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        isMobileHidden={isMobileChatOpen}
      />

      <div className="chat-window-wrapper">
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
            onClearHistory={handleClearHistory}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}

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
      flex: 1,
      height: '100%',
      background: 'var(--bg-primary)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ 
          width: '120px',
          height: '120px',
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '56px'
        }}>
          {tabIcons[tab]}
        </div>
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: 500, 
          color: 'var(--text-secondary)', 
          marginBottom: '8px' 
        }}>
          {tabNames[tab]}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
          Раздел в разработке
        </p>
      </div>
    </div>
  );
}

function EmptyChatState() {
  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-primary)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '120px', 
          height: '120px', 
          margin: '0 auto 20px', 
          borderRadius: '50%', 
          background: 'var(--bg-secondary)',
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
          color: 'var(--text-secondary)', 
          marginBottom: '8px' 
        }}>
          RUMES
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
          Выберите чат для начала общения
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
