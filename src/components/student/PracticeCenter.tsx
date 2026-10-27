import React from 'react';
import {
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface PracticeCenterProps {
  onOpenChapterMCQ: (chapterId: string) => void;
}

export const PracticeCenter: React.FC<PracticeCenterProps> = ({ onOpenChapterMCQ }) => {
  const { chapters, attemptsList, getOverallStats } = useData();

  const stats = getOverallStats();

  // Chapters with MCQs
  const chaptersWithMCQs = chapters.filter(c => c.isPublished);

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* Practice Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 text-white p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical MCQ Assessment Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Board-Style Clinical Practice
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            Train your diagnostic reflexes with standard and vignette-based questions across Medicine, Gynecology, and Obstetrics.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-indigo-800/60 relative z-10">
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {stats.totalAttempts}
            </div>
            <div className="text-[11px] text-indigo-300">Total Attempts</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">
              {stats.averageScore}%
            </div>
            <div className="text-[11px] text-indigo-300">Average Score</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-sky-400">
              {stats.averageAccuracy}%
            </div>
            <div className="text-[11px] text-indigo-300">Accuracy Rate</div>
          </div>
        </div>
      </div>

      {/* Available MCQ Modules */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white px-1">
          Available Chapter Assessments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {chaptersWithMCQs.map(chap => {
            const attempts = attemptsList.filter(a => a.chapterId === chap.id);
            const latestAttempt = attempts[0];

            return (
              <div
                key={chap.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="uppercase font-bold text-sky-600 dark:text-sky-400">
                      {chap.bookId.replace('book_', '').toUpperCase()}
                    </span>
                    {latestAttempt && (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        Best: {latestAttempt.score}%
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {chap.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {chap.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {chap.estimatedMinutes} min
                  </span>

                  <button
                    onClick={() => onOpenChapterMCQ(chap.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{attempts.length > 0 ? 'Retry Test' : 'Start Test'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Attempt History Log */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white px-1">
          Recent Test Attempts History ({attemptsList.length})
        </h3>

        {attemptsList.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <Award className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No Attempts Recorded Yet
            </h4>
            <p className="text-xs text-slate-400">
              Complete chapter MCQ tests to track your diagnostic accuracy and performance over time.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {attemptsList.map(att => (
              <div
                key={att.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {att.chapterTitle}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      att.score >= 70
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {att.score}% Score
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>
                      {att.correctCount}/{att.total} Correct
                    </span>
                    <span>•</span>
                    <span>Accuracy: {att.accuracy}%</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.round(att.timeTakenSeconds)}s
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(att.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenChapterMCQ(att.chapterId)}
                  className="px-3 py-1.5 rounded-xl border border-sky-300 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-xs font-bold hover:bg-sky-50 dark:hover:bg-sky-950/60 transition-colors cursor-pointer shrink-0"
                >
                  Retake Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
