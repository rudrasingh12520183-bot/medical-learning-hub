import React, { useState } from 'react';
import {
  User as UserIcon,
  Flame,
  Award,
  BookOpen,
  Brain,
  Bookmark,
  TrendingUp,
  RotateCcw,
  Shield,
  Clock,
  Sparkles,
  Stethoscope,
  Building,
  GraduationCap,
  Download,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface ProfileScreenProps {
  onOpenChapterMCQ: (chapterId: string) => void;
  onOpenInstall: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenChapterMCQ, onOpenInstall }) => {
  const { currentUser, switchUserRole, isAdmin, allUsers, login } = useAuth();
  const {
    books,
    progressList,
    bookmarksList,
    attemptsList,
    getBookProgress,
    getOverallStats,
    resetToDefaultSeed
  } = useData();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const stats = getOverallStats();

  const handleResetData = () => {
    resetToDefaultSeed();
    setIsResetConfirmOpen(false);
    alert('Curriculum and progress have been reset to default clean seed data.');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Student Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  currentUser?.avatarUrl ||
                  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
                }
                alt={currentUser?.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/30"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-sky-600 text-white rounded-lg shadow-xs">
                <Stethoscope className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {currentUser?.name || 'Medical Student'}
                </h2>
                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                  isAdmin
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                }`}>
                  {currentUser?.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentUser?.email}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser?.collegeOrHospital || 'AIIMS New Delhi'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Streak Widget */}
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 px-3.5 py-2 rounded-2xl text-amber-800 dark:text-amber-300">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            <div>
              <div className="text-sm font-black">{currentUser?.streakDays || 14} Days</div>
              <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">Study Streak</div>
            </div>
          </div>
        </div>

        {/* Global Progress Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.completedChapters} / {stats.totalChapters}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Chapters Read</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xl font-black text-sky-600 dark:text-sky-400">
              {stats.totalAttempts}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Quiz Attempts</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.averageAccuracy}%
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Avg Accuracy</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xl font-black text-purple-600 dark:text-purple-400">
              {bookmarksList.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Bookmarks</div>
          </div>
        </div>
      </div>

      {/* Progress Breakdown Separated by Textbook */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white px-1">
          Separate Subject Progress Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map(b => {
            const prog = getBookProgress(b.id);
            const colorClass =
              b.coverColor === 'rose'
                ? 'bg-rose-500'
                : b.coverColor === 'emerald'
                ? 'bg-emerald-500'
                : 'bg-sky-500';

            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {b.shortCode}
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {prog.percentage}%
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {b.title}
                </h4>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                    style={{ width: `${prog.percentage}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>{prog.completed} completed</span>
                  <span>{prog.total} total chapters</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Switching & CMS Management Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Account & Role Management
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          {allUsers.map(u => (
            <button
              key={u.id}
              onClick={() => login(u.email)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                currentUser?.id === u.id
                  ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-800 dark:text-sky-200 ring-2 ring-sky-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <img
                src={u.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80&auto=format&fit=crop&q=80'}
                alt={u.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>{u.name}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                ({u.role})
              </span>
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenInstall}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>App Download & Install on Phone</span>
            </button>

            <button
              onClick={() => switchUserRole(isAdmin ? 'student' : 'admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Switch to {isAdmin ? 'Student View' : 'Admin CMS Portal'}</span>
            </button>
          </div>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Reset Curriculum to Seed Data?
            </h3>
            <p className="text-xs text-slate-500">
              This will restore the original demo textbooks, clinical chapters, MCQs, and reset student test logs.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
