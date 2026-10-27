import React, { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  Award,
  Brain,
  Trash2,
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { BookmarkType } from '../../types';

interface BookmarksScreenProps {
  onOpenChapter: (chapterId: string) => void;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ onOpenChapter }) => {
  const { bookmarksList, toggleBookmark } = useData();
  const [filterType, setFilterType] = useState<BookmarkType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = bookmarksList.filter(bm => {
    const matchesFilter = filterType === 'all' || bm.type === filterType;
    const matchesSearch =
      !searchQuery.trim() ||
      bm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bm.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const typeIcons: Record<BookmarkType, React.ElementType> = {
    chapter: BookOpen,
    studyMaterial: Sparkles,
    mcq: Award,
    mindMap: Brain
  };

  const typeLabels: Record<BookmarkType, string> = {
    chapter: 'Chapter',
    studyMaterial: 'Study Note',
    mcq: 'High-Yield MCQ',
    mindMap: 'Mind Map'
  };

  const typeColors: Record<BookmarkType, string> = {
    chapter: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    studyMaterial: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    mcq: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    mindMap: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
  };

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            My Bookmarked Items
          </h2>
          <p className="text-xs text-slate-500">
            Quick revision repository for saved chapters, pearls, high-yield MCQs, and concept graphs
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          {bookmarksList.length} Items Saved
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(['all', 'chapter', 'studyMaterial', 'mcq', 'mindMap'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterType === tab
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {tab === 'all' ? 'All Bookmarks' : typeLabels[tab as BookmarkType]}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved bookmarks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No Bookmarks Found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the bookmark icon while reading chapters, solving clinical MCQs, or browsing mind maps to save them here for rapid review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookmarks.map(bm => {
            const Icon = typeIcons[bm.type] || Bookmark;
            const badgeClass = typeColors[bm.type];

            return (
              <div
                key={bm.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 group hover:border-sky-300 dark:hover:border-sky-700 transition-all"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${badgeClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${badgeClass}`}>
                        {typeLabels[bm.type]}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(bm.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {bm.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {bm.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenChapter(bm.chapterId)}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Open in Chapter"
                  >
                    <span className="hidden sm:inline">Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() =>
                      toggleBookmark(bm.type, bm.targetId, bm.chapterId, bm.bookId, bm.title, bm.subtitle)
                    }
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
