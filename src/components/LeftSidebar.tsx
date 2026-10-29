import { 
  Menu, Search, MessageCircle, Users, Phone, Bookmark, Settings
} from 'lucide-react';
import { currentUser } from '../data/mockData';

type TabType = 'chats' | 'contacts' | 'calls' | 'saved' | 'settings';

interface LeftSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export default function LeftSidebar({ activeTab, onTabChange, onMenuClick, onSearchClick }: LeftSidebarProps) {
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
    <div className="w-[70px] h-full bg-telegram-panel flex flex-col items-center py-2 border-r border-telegram flex-shrink-0">
      {/* Top icons */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {icons.map((item) => {
          const Icon = item.icon;
          const isActive = 'tab' in item && item.tab === activeTab;
          
          return (
            <button
              key={item.id}
              onClick={'action' in item ? item.action : () => onTabChange(item.tab!)}
              className={`sidebar-icon w-12 h-12 rounded-xl flex items-center justify-center ${
                isActive ? 'active' : 'text-telegram-gray hover:text-white'
              }`}
            >
              <Icon size={22} strokeWidth={1.8} />
            </button>
          );
        })}
      </div>

      {/* User avatar at bottom */}
      <div className="mt-auto mb-2">
        <div 
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: currentUser.avatarColor }}
        >
          {currentUser.avatar}
        </div>
      </div>
    </div>
  );
}
