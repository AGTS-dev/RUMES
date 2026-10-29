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

  const handleBack = useCallback(() => {
    setIsMobileChatOpen(false);
  }, []);

  return (
    <div className="app-container">
      {/* Left Sidebar (70px) - hidden on mobile */}
      <LeftSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMenuClick={() => {}}
        onSearchClick={() => {}}
      />

      {/* Chat List - hidden on mobile when chat is open */}
      <div 
        className={`chat-list-wrapper ${isMobileChatOpen ? 'hidden-mobile' : ''}`}
      >
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

      {/* Chat Window - hidden on mobile when no chat selected */}
      <div 
        className={`chat-window-wrapper ${!isMobileChatOpen && !activeChat ? 'hidden-mobile' : ''} ${!isMobileChatOpen && activeChat ? '' : ''}`}
      >
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
          />
        ) : (
          <div className="chat-window-panel" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 16px', 
                borderRadius: '50%', 
                background: '#17212b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="40" height="40" fill="none" stroke="#6c7883" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#6c7883', marginBottom: '8px' }}>
                Telegram Web
              </h2>
              <p style={{ fontSize: '14px', color: '#6c7883' }}>
                Выберите чат для начала общения
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
