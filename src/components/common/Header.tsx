import React from 'react';
import {
  Search,
  BookOpen,
  UserCheck,
  Shield,
  Smartphone,
  Tablet,
  Maximize2,
  Download,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenInstall: () => void;
  onOpenOfflineLibrary?: () => void;
  activeViewMode: 'phone' | 'tablet' | 'full';
  onChangeViewMode: (mode: 'phone' | 'tablet' | 'full') => void;
  selectedBookId: string;
  onSelectBook: (bookId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenInstall,
  onOpenOfflineLibrary,
  activeViewMode,
  onChangeViewMode,
  selectedBookId,
  onSelectBook
}) => {
  const { currentUser, isAdmin, switchUserRole } = useAuth();
  const { books } = useData();

  const selectedBook = books.find(b => b.id === selectedBookId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Android Top Status Bar Simulation on mobile/tablet frames */}
      <div className="flex items-center justify-between px-4 py-1.5 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sky-600 dark:text-sky-400">09:41</span>
          <span className="text-[10px] bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded font-mono">
            5G
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Viewport frame selector */}
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 rounded-lg p-0.5 text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onChangeViewMode('phone')}
              title="Android Phone View"
              className={`p-1 rounded transition-colors ${activeViewMode === 'phone' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs' : 'hover:text-slate-900'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('tablet')}
              title="Android Tablet View"
              className={`p-1 rounded transition-colors ${activeViewMode === 'tablet' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs' : 'hover:text-slate-900'}`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('full')}
              title="Full Screen View"
              className={`p-1 rounded transition-colors ${activeViewMode === 'full' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs' : 'hover:text-slate-900'}`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Role Switcher */}
          <button
            onClick={() => switchUserRole(isAdmin ? 'student' : 'admin')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
              isAdmin
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 ring-1 ring-amber-400/40'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
            }`}
            title="Click to toggle between Student view and Admin CMS"
          >
            {isAdmin ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
            <span>{isAdmin ? 'Admin Mode' : 'Student Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">
                Medical Learning Hub
              </h1>
              {isAdmin && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500 text-white">
                  CMS
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {selectedBook ? selectedBook.title : 'Medicine • Gynecology • Obstetrics'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Book Selector */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-medium">
            {books.map(b => (
              <button
                key={b.id}
                onClick={() => onSelectBook(b.id)}
                className={`px-2.5 py-1 rounded-md transition-all capitalize ${
                  selectedBookId === b.id
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {b.shortCode}
              </button>
            ))}
          </div>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Global Search"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Search curriculum...</span>
          </button>

          {/* Offline Library Button */}
          {onOpenOfflineLibrary && (
            <button
              onClick={onOpenOfflineLibrary}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="View Offline Cached Materials & Chapters"
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden lg:inline">Offline</span>
            </button>
          )}

          {/* Install / Download App Button */}
          <button
            onClick={onOpenInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-xs shadow-sky-600/30 transition-all cursor-pointer ring-1 ring-white/20 active:scale-95"
            title="Download & Install App on Phone"
          >
            <Download className="w-3.5 h-3.5 animate-bounce" />
            <span className="font-bold">Get App</span>
          </button>
        </div>
      </div>
    </header>
  );
};
