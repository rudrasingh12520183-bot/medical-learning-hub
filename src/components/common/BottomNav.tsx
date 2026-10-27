import React from 'react';
import {
  Home,
  BookOpen,
  Award,
  Bookmark,
  User,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export type TabKey = 'home' | 'books' | 'practice' | 'bookmarks' | 'profile' | 'admin';

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin } = useAuth();
  const { bookmarksList } = useData();

  const navItems = [
    { key: 'home' as TabKey, label: 'Home', icon: Home },
    { key: 'books' as TabKey, label: 'Books', icon: BookOpen },
    { key: 'practice' as TabKey, label: 'Practice', icon: Award },
    {
      key: 'bookmarks' as TabKey,
      label: 'Bookmarks',
      icon: Bookmark,
      badge: bookmarksList.length > 0 ? bookmarksList.length : undefined
    },
    { key: 'profile' as TabKey, label: 'Profile', icon: User },
    ...(isAdmin ? [{ key: 'admin' as TabKey, label: 'Admin CMS', icon: Settings, highlight: true }] : [])
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1 px-2 transition-colors">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className="flex flex-col items-center justify-center flex-1 py-1 px-2 group relative transition-transform active:scale-95"
            >
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? item.highlight
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                      : 'bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 transition-transform" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 transition-colors ${
                  isActive
                    ? item.highlight
                      ? 'text-amber-700 dark:text-amber-400 font-bold'
                      : 'text-sky-700 dark:text-sky-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
