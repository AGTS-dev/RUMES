import { Menu, Search, MessageCircle, Users, Phone, Bookmark, Settings } from 'lucide-react';
import { currentUser } from '../data/mockData';

type TabType = 'chats' | 'contacts' | 'calls' | 'saved' | 'settings';

interface LeftSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onMenuClick: () => void;
  onSearchClick: () => void;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export default function LeftSidebar({ activeTab, onTabChange, onMenuClick, onSearchClick, isMobileOpen, onClose }: LeftSidebarProps) {
  const icons = [
    { id: 'menu' as const, icon: Menu, action: onMenuClick },
    { id: 'search' as const, icon: Search, action: onSearchClick },
    { id: 'chats' as const, icon: MessageCircle, tab: 'chats' as TabType },
    { id: 'contacts' as const, icon: Users, tab: 'contacts' as TabType },
    { id: 'calls' as const, icon: Phone, tab: 'calls' as TabType },
    { id: 'saved' as const, icon: Bookmark, tab: 'saved' as TabType },
    { id: 'settings' as const, icon: Settings, tab: 'settings' as TabType },
  ];

  return (
    <div className={`left-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Top icons */}
      <div className="flex flex-col items-center flex-1">
        {icons.map((item) => {
          const Icon = item.icon;
          const isActive = 'tab' in item && item.tab === activeTab;
          
          return (
            <button
              key={item.id}
              onClick={'action' in item ? item.action : () => onTabChange(item.tab!)}
              className={`sidebar-icon ${isActive ? 'active' : ''}`}
            >
              <Icon size={22} strokeWidth={1.8} />
            </button>
          );
        })}
      </div>

      {/* User avatar at bottom */}
      <div className="mb-2">
        <div 
          className="avatar"
          style={{ backgroundColor: currentUser.avatarColor, width: '44px', height: '44px', fontSize: '16px' }}
        >
          {currentUser.avatar}
        </div>
      </div>
    </div>
  );
}
