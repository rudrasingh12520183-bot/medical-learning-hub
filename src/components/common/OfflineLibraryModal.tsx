import React, { useState, useEffect } from 'react';
import {
  X,
  Wifi,
  WifiOff,
  CloudDownload,
  CheckCircle2,
  Trash2,
  BookOpen,
  Award,
  Brain,
  HardDrive,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { offlineCacheService, OfflineCachedChapterInfo } from '../../services/offlineCacheService';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useData } from '../../context/DataContext';

interface OfflineLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChapter: (chapterId: string) => void;
}

export const OfflineLibraryModal: React.FC<OfflineLibraryModalProps> = ({
  isOpen,
  onClose,
  onOpenChapter
}) => {
  const { isOnline, isSimulatedOffline, toggleSimulateOffline } = useOnlineStatus();
  const { books, chapters } = useData();
  const [cachedChapters, setCachedChapters] = useState<OfflineCachedChapterInfo[]>([]);
  const [isBulkCaching, setIsBulkCaching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'medicine' | 'gynecology' | 'obstetrics'>('all');

  const refreshList = () => {
    setCachedChapters(offlineCacheService.getAllCachedChapters());
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
    }
    const unsub = offlineCacheService.subscribe(() => {
      refreshList();
    });
    return unsub;
  }, [isOpen]);

  if (!isOpen) return null;

  const stats = offlineCacheService.getStats();

  const handleRemove = async (chapterId: string) => {
    await offlineCacheService.removeChapter(chapterId);
    refreshList();
  };

  const handleClearAll = async () => {
    if (confirm('Clear all cached offline chapters? You can re-download them anytime.')) {
      await offlineCacheService.clearAllOfflineCache();
      refreshList();
    }
  };

  const handleBulkCacheBook = async (bookId: string) => {
    setIsBulkCaching(true);
    await offlineCacheService.cacheBookChapters(bookId);
    setIsBulkCaching(false);
    refreshList();
  };

  const filteredChapters = cachedChapters.filter(c => {
    if (activeFilter === 'all') return true;
    return c.bookShortCode.toLowerCase() === activeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md p-1.5 ring-2 ring-white/20 shadow-md shrink-0 flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">
                  Offline Learning Library
                </h3>
                <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-full">
                  Service Worker Ready
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Chapters and study materials accessible anytime without internet connection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-100 text-xs">
          {/* Status and Simulation Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${isOnline ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-amber-100 dark:bg-amber-950 text-amber-600'}`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Network Status:</span>
                  <span className={isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                    {isOnline ? 'Online (Active Sync)' : 'Offline Mode'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {cachedChapters.length} chapter{cachedChapters.length === 1 ? '' : 's'} stored locally (~{stats.totalKb} KB)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={toggleSimulateOffline}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSimulatedOffline
                    ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                }`}
                title="Toggle offline simulation to test learning without internet"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>{isSimulatedOffline ? 'Resume Online' : 'Simulate Offline'}</span>
              </button>
            </div>
          </div>

          {/* Bulk Download Actions */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 block">
              1-Click Offline Download by Textbook:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {books.map(b => (
                <button
                  key={b.id}
                  disabled={isBulkCaching}
                  onClick={() => handleBulkCacheBook(b.id)}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 transition-all text-left group cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-emerald-600">
                      {b.shortCode}
                    </span>
                    <CloudDownload className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {b.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Download all chapters
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${activeFilter === 'all' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'}`}
              >
                All ({cachedChapters.length})
              </button>
              <button
                onClick={() => setActiveFilter('medicine')}
                className={`px-2.5 py-1 rounded-lg transition-all ${activeFilter === 'medicine' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'}`}
              >
                Medicine
              </button>
              <button
                onClick={() => setActiveFilter('gynecology')}
                className={`px-2.5 py-1 rounded-lg transition-all ${activeFilter === 'gynecology' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'}`}
              >
                Gynecology
              </button>
              <button
                onClick={() => setActiveFilter('obstetrics')}
                className={`px-2.5 py-1 rounded-lg transition-all ${activeFilter === 'obstetrics' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'}`}
              >
                Obstetrics
              </button>
            </div>

            {cachedChapters.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-rose-600 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Cached Chapters List */}
          <div className="space-y-2">
            {filteredChapters.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                <CloudDownload className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  No chapters cached yet for this section
                </p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Any chapter you open is automatically cached for offline study, or click &quot;Download all chapters&quot; above to pre-cache an entire subject.
                </p>
              </div>
            ) : (
              filteredChapters.map(item => (
                <div
                  key={item.chapterId}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-emerald-400 transition-all flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.bookShortCode}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium truncate">
                        {item.subjectTitle}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        • {item.approxSizeKb} KB
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h4>

                    {/* Features badges */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ready Offline</span>
                      </span>
                      {item.hasStudyMaterial && (
                        <span className="flex items-center gap-0.5">
                          <BookOpen className="w-3 h-3 text-sky-500" />
                          <span>Notes</span>
                        </span>
                      )}
                      {item.mcqCount > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Award className="w-3 h-3 text-purple-500" />
                          <span>{item.mcqCount} MCQs</span>
                        </span>
                      )}
                      {item.hasMindMap && (
                        <span className="flex items-center gap-0.5">
                          <Brain className="w-3 h-3 text-emerald-500" />
                          <span>Mind Map</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenChapter(item.chapterId);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>Study</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handleRemove(item.chapterId)}
                      title="Remove from offline cache"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Service Worker automatically caches visited chapters</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
