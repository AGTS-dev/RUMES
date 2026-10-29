import { useState, useRef, useEffect } from 'react';
import ChatList from './ChatList';
import { Chat } from '../data/mockData';

type FilterType = 'all' | 'personal' | 'groups' | 'channels' | 'bots';

interface ResizableChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  isMobileHidden: boolean;
}

export default function ResizableChatList({
  chats,
  activeChatId,
  onSelectChat,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  isMobileHidden,
}: ResizableChatListProps) {
  const [width, setWidth] = useState(360);
  const [isResizing, setIsResizing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX - 70; // 70px для левого сайдбара
      if (newWidth >= 70 && newWidth <= 600) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <div 
      ref={wrapperRef}
      className={`chat-list-wrapper ${isMobileHidden ? 'hidden-mobile' : ''}`}
      style={{ width: `${width}px` }}
    >
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={onSelectChat}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />
      <div
        className="resize-handle"
        onMouseDown={() => setIsResizing(true)}
      />
    </div>
  );
}
