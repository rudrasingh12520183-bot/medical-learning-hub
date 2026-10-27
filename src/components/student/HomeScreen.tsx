import React from 'react';
import {
  Flame,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Stethoscope,
  Smartphone,
  Download,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface HomeScreenProps {
  onSelectBook: (bookId: string) => void;
  onOpenChapter: (chapterId: string) => void;
  onNavigateTab: (tab: 'books' | 'practice' | 'bookmarks') => void;
  onOpenInstall: () => void;
  onOpenOfflineLibrary?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectBook,
  onOpenChapter,
  onNavigateTab,
  onOpenInstall,
  onOpenOfflineLibrary
}) => {
  const { currentUser } = useAuth();
  const { books, chapters, progressList, bookmarksList, getBookProgress, getOverallStats } = useData();

  const stats = getOverallStats();

  // Find recent chapter
  const recentProgress = [...progressList].sort(
    (a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
  )[0];

  const continueChapter = recentProgress
    ? chapters.find(c => c.id === recentProgress.chapterId)
    : chapters[0];

  const recentChaptersList = chapters
    .filter(c => c.isPublished)
    .slice(0, 3);

  const themeGradients: Record<string, { bg: string; badge: string; btn: string }> = {
    blue: {
      bg: 'from-sky-500/10 via-sky-500/5 to-transparent border-sky-200 dark:border-sky-900/50',
      badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
      btn: 'bg-sky-600 hover:bg-sky-700 text-white'
    },
    rose: {
      bg: 'from-rose-500/10 via-rose-500/5 to-transparent border-rose-200 dark:border-rose-900/50',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      btn: 'bg-rose-600 hover:bg-rose-700 text-white'
    },
    emerald: {
      bg: 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-200 dark:border-emerald-900/50',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white'
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white p-5 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-sky-300 text-xs font-semibold">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Clinical Residency & MBBS Prep</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Doctor'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              {currentUser?.collegeOrHospital || 'All India Institute of Medical Sciences'} • {currentUser?.yearOfStudy || 'Final Year'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{currentUser?.streakDays || 14} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold">
              <Award className="w-4 h-4 text-sky-400" />
              <span>{stats.completionPercentage}% Mastered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Install Phone App / Download Card */}
      <div className="bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10 dark:from-sky-950/40 dark:via-indigo-950/40 dark:to-emerald-950/40 rounded-3xl border border-sky-200/80 dark:border-sky-800/80 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-600/25 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Get the Phone App (Android & iPhone)
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Home Screen Icon
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 max-w-xl">
              Add the Medical Learning Hub icon to your phone screen. Opens in fullscreen without browser bars with offline study support!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {onOpenOfflineLibrary && (
            <button
              onClick={onOpenOfflineLibrary}
              className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer justify-center active:scale-95"
              title="Open Offline Study Materials Library"
            >
              <HardDrive className="w-4 h-4" />
              <span>Offline Library</span>
            </button>
          )}

          <button
            onClick={onOpenInstall}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-sky-600/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer justify-center active:scale-95"
          >
            <Download className="w-4 h-4 animate-bounce" />
            <span>Get App</span>
          </button>
        </div>
      </div>

      {/* Continue Learning Widget */}
      {continueChapter && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm medical-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Continue Learning
            </span>
            <span className="text-[11px] text-slate-500">
              {recentProgress ? `${recentProgress.readingPercent}% Read` : 'Start Chapter'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {continueChapter.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {continueChapter.description}
              </p>
            </div>

            <button
              onClick={() => onOpenChapter(continueChapter.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all shrink-0 cursor-pointer"
            >
              <span>Resume Study</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${recentProgress?.readingPercent || 15}%` }}
            />
          </div>
        </div>
      )}

      {/* CORE 3 TEXTBOOKS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Core Medical Textbooks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Three segregated clinical manuals with dedicated modules
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('books')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map(book => {
            const prog = getBookProgress(book.id);
            const style = themeGradients[book.coverColor] || themeGradients.blue;

            return (
              <div
                key={book.id}
                className={`flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl border ${style.bg} p-4 shadow-sm medical-card-hover relative overflow-hidden`}
              >
                {/* Book Cover Image Thumbnail */}
                <div className="relative h-32 rounded-2xl overflow-hidden mb-3.5 bg-slate-100 dark:bg-slate-800">
                  {book.coverImage && (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide backdrop-blur-md ${style.badge}`}>
                      {book.edition}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                      {book.shortCode.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold leading-snug line-clamp-1">
                      {book.title}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 flex-1">
                  {book.author && (
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Author: <span className="font-bold text-slate-900 dark:text-white">{book.author}</span>
                      {book.publisher && (
                        <span className="text-[10px] text-slate-400 block font-normal">
                          Publisher: {book.publisher}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <strong>{prog.total}</strong> Chapters
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {prog.completed}/{prog.total} ({prog.percentage}%)
                    </span>
                  </div>


                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        book.coverColor === 'rose'
                          ? 'bg-rose-500'
                          : book.coverColor === 'emerald'
                          ? 'bg-emerald-500'
                          : 'bg-sky-500'
                      }`}
                      style={{ width: `${prog.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => onSelectBook(book.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${style.btn}`}
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick MCQ Practice & Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Practice Banner Card */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
          <div className="space-y-2 relative z-10">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Clinical Case MCQs
            </span>
            <h3 className="text-lg font-bold leading-snug">
              Master Diagnostic Decision Making
            </h3>
            <p className="text-xs text-slate-300">
              Practice timed board-style questions with detailed rationale and guideline-backed explanations.
            </p>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between border-t border-indigo-800/60 relative z-10">
            <div className="text-xs text-indigo-200">
              Total Questions: <strong className="text-white">15+ High-Yield</strong>
            </div>
            <button
              onClick={() => onNavigateTab('practice')}
              className="px-3.5 py-1.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Practice Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Overall Progress Snapshot Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Overall Progress
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              {stats.completionPercentage}% Completed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {stats.completedChapters}/{stats.totalChapters}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Chapters</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-base font-extrabold text-sky-600 dark:text-sky-400">
                {stats.totalAttempts}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Tests Taken</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                {stats.averageAccuracy || 78}%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Avg Accuracy</div>
            </div>
          </div>

          {/* Bookmarks shortcut */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <strong>{bookmarksList.length}</strong> Saved Bookmarks
            </span>
            <button
              onClick={() => onNavigateTab('bookmarks')}
              className="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
            >
              Open Bookmarks
            </button>
          </div>
        </div>
      </div>

      {/* Recent Chapters List */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white px-1">
          Featured Chapters
        </h3>
        <div className="space-y-2">
          {recentChaptersList.map(chap => {
            const book = books.find(b => b.id === chap.bookId);
            const prog = progressList.find(p => p.chapterId === chap.id);

            return (
              <div
                key={chap.id}
                onClick={() => onOpenChapter(chap.id)}
                className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    prog?.isCompleted
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {prog?.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {book?.shortCode}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-sky-600 transition-colors">
                      {chap.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400">
                    {chap.estimatedMinutes} min
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
