import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Brain,
  Award,
  Layers,
  Heart,
  Wind,
  Filter,
  Activity,
  Droplet,
  ShieldAlert,
  Bone,
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CircleDot,
  Crosshair,
  Sun,
  Compass,
  UserCheck,
  HeartPulse,
  Clock,
  AlertTriangle,
  Gauge,
  PieChart,
  Flame,
  Eye,
  Smile,
  ChevronDown,
  CloudDownload,
  HardDrive
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { offlineCacheService } from '../../services/offlineCacheService';

interface BooksScreenProps {
  selectedBookId: string;
  onSelectBook: (bookId: string) => void;
  onOpenChapter: (chapterId: string) => void;
}

// Icon dictionary for topics
const TOPIC_ICONS: Record<string, React.ElementType> = {
  Heart,
  Wind,
  Layers,
  Brain,
  Filter,
  Activity,
  Droplet,
  ShieldAlert,
  Bone,
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CircleDot,
  Crosshair,
  Sun,
  Compass,
  UserCheck,
  HeartPulse,
  Clock,
  AlertTriangle,
  Gauge,
  PieChart,
  Flame,
  Eye,
  Smile
};

export const BooksScreen: React.FC<BooksScreenProps> = ({
  selectedBookId,
  onSelectBook,
  onOpenChapter
}) => {
  const { books, subjects, chapters, progressList, getBookProgress } = useData();
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);

  const currentBook = books.find(b => b.id === selectedBookId) || books[0];
  const bookSubjects = subjects.filter(s => s.bookId === currentBook?.id && s.isPublished);
  const bookProgress = currentBook ? getBookProgress(currentBook.id) : { completed: 0, total: 0, percentage: 0 };

  const themeColors: Record<string, { tabActive: string; accent: string; badge: string }> = {
    blue: {
      tabActive: 'bg-sky-600 text-white shadow-md shadow-sky-600/25',
      accent: 'text-sky-600 dark:text-sky-400',
      badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300'
    },
    rose: {
      tabActive: 'bg-rose-600 text-white shadow-md shadow-rose-600/25',
      accent: 'text-rose-600 dark:text-rose-400',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
    },
    emerald: {
      tabActive: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25',
      accent: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
    }
  };

  const style = themeColors[currentBook?.coverColor || 'blue'];

  const toggleSubject = (subId: string) => {
    setExpandedSubjectId(prev => (prev === subId ? null : subId));
  };

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* 3 Separate Books Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {books.map(b => {
          const isSelected = b.id === currentBook?.id;
          return (
            <button
              key={b.id}
              onClick={() => {
                onSelectBook(b.id);
                setExpandedSubjectId(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? style.tabActive
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="capitalize">{b.shortCode}</span>
            </button>
          );
        })}
      </div>

      {/* Book Banner */}
      {currentBook && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide ${style.badge}`}>
                  {currentBook.edition}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Category: {currentBook.shortCode}
                </span>
                {currentBook.author && (
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                    Author: <strong className="text-slate-900 dark:text-white">{currentBook.author}</strong>
                  </span>
                )}
                {currentBook.publisher && (
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    • Publisher: {currentBook.publisher}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {currentBook.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                {currentBook.description}
              </p>
            </div>


            <div className="text-right sm:text-right shrink-0">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {bookProgress.percentage}%
              </span>
              <div className="text-[11px] text-slate-500">
                {bookProgress.completed} of {bookProgress.total} chapters completed
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                currentBook.coverColor === 'rose'
                  ? 'bg-rose-500'
                  : currentBook.coverColor === 'emerald'
                  ? 'bg-emerald-500'
                  : 'bg-sky-500'
              }`}
              style={{ width: `${bookProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Topics / Subjects List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Clinical Topics & Subjects ({bookSubjects.length})
            </h3>
            <p className="text-xs text-slate-500">
              Select a topic to explore curriculum chapters, MCQs, and mind maps
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {bookSubjects.map(sub => {
            const subChapters = chapters.filter(c => c.subjectId === sub.id && c.isPublished);
            const isExpanded = expandedSubjectId === sub.id;
            const IconComponent = TOPIC_ICONS[sub.iconName] || Layers;

            // Completed count in this subject
            const completedInSub = subChapters.filter(c => {
              const p = progressList.find(pr => pr.chapterId === c.id);
              return p?.isCompleted;
            }).length;

            return (
              <div
                key={sub.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
              >
                {/* Subject Header */}
                <div
                  onClick={() => toggleSubject(sub.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.badge}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {sub.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {sub.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        offlineCacheService.cacheSubjectChapters(sub.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      title="Download all chapters in this subject for offline study"
                    >
                      <CloudDownload className="w-4 h-4" />
                    </button>

                    <span className="text-xs font-semibold text-slate-500">
                      {completedInSub > 0 && (
                        <span className="text-emerald-600 font-bold mr-1">
                          {completedInSub}/{subChapters.length} ✓
                        </span>
                      )}
                      {subChapters.length} {subChapters.length === 1 ? 'chap' : 'chaps'}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Chapters List when expanded */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 p-2 sm:p-3 space-y-2">
                    {subChapters.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        No chapters published under this topic yet.
                      </div>
                    ) : (
                      subChapters.map(chap => {
                        const prog = progressList.find(p => p.chapterId === chap.id);
                        const isCached = offlineCacheService.isChapterCached(chap.id);

                        return (
                          <div
                            key={chap.id}
                            onClick={() => onOpenChapter(chap.id)}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all cursor-pointer group gap-2"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                prog?.isCompleted
                                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                              }`}>
                                {prog?.isCompleted ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <BookOpen className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                                    {chap.title}
                                  </h5>
                                  {isCached && (
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      <span>Offline</span>
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                  {chap.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0 text-[10px] text-slate-500">
                              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">
                                <Clock className="w-3 h-3" /> {chap.estimatedMinutes}m
                              </span>
                              <span className="flex items-center gap-1 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-md font-medium">
                                <Award className="w-3 h-3" /> MCQs
                              </span>
                              <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md font-medium">
                                <Brain className="w-3 h-3" /> Mind Map
                              </span>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
