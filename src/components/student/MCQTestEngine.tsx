import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Stethoscope,
  Activity,
  AlertCircle,
  Bookmark
} from 'lucide-react';
import { MCQ, Chapter } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface MCQTestEngineProps {
  chapter: Chapter;
  mcqs: MCQ[];
  onBackToChapter: () => void;
  onNextChapter?: () => void;
  hasNextChapter: boolean;
}

export const MCQTestEngine: React.FC<MCQTestEngineProps> = ({
  chapter,
  mcqs,
  onBackToChapter,
  onNextChapter,
  hasNextChapter
}) => {
  const { currentUser } = useAuth();
  const { recordQuizAttempt, toggleBookmark, isBookmarked } = useData();

  // Test state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Timer
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Reset test
  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setIsReviewMode(false);
    setCurrentIndex(0);
    setElapsedSeconds(0);
  };

  const currentMCQ = mcqs[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentMCQ.id]: optionIndex
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSubmitTest = () => {
    if (answeredCount < mcqs.length) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${mcqs.length} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    // Calculate score
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    mcqs.forEach(q => {
      const userAns = selectedAnswers[q.id];
      if (userAns === undefined) {
        unattemptedCount++;
      } else if (userAns === q.correctIndex) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const score = Math.round((correctCount / mcqs.length) * 100);
    const attempted = correctCount + incorrectCount;
    const accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;

    if (currentUser) {
      recordQuizAttempt({
        userId: currentUser.id,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        bookId: chapter.bookId,
        score,
        total: mcqs.length,
        correctCount,
        incorrectCount,
        unattemptedCount,
        percentage: score,
        accuracy,
        timeTakenSeconds: elapsedSeconds,
        userAnswers: selectedAnswers
      });
    }

    setIsSubmitted(true);
  };

  // Helper time format
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (mcqs.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          No MCQs Available Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The administrator has not added multiple-choice questions for this chapter yet.
        </p>
        <button
          onClick={onBackToChapter}
          className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
        >
          Back to Study Notes
        </button>
      </div>
    );
  }

  // ================= RESULT SCREEN =================
  if (isSubmitted && !isReviewMode) {
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    mcqs.forEach(q => {
      const userAns = selectedAnswers[q.id];
      if (userAns === undefined) unattemptedCount++;
      else if (userAns === q.correctIndex) correctCount++;
      else incorrectCount++;
    });

    const percentage = Math.round((correctCount / mcqs.length) * 100);
    const attempted = correctCount + incorrectCount;
    const accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
        {/* Results Banner */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-600/30">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            MCQ Assessment Completed
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {percentage >= 70 ? 'Clinical Mastery Achieved! 🎉' : 'Assessment Result & Review'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {chapter.title}
          </p>
        </div>

        {/* Primary Metric Score Ring / Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-900/50">
            <div className="text-2xl font-black text-sky-700 dark:text-sky-300">
              {percentage}%
            </div>
            <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">Total Score</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50">
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {correctCount} / {mcqs.length}
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Correct Answers</div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50">
            <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
              {accuracy}%
            </div>
            <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Accuracy Rate</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-black text-slate-800 dark:text-slate-200">
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Time Taken</div>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span className="text-emerald-600 font-bold">{correctCount} Correct</span>
            <span className="text-rose-600 font-bold">{incorrectCount} Incorrect</span>
            <span className="text-slate-400 font-bold">{unattemptedCount} Unattempted</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{ width: `${(correctCount / mcqs.length) * 100}%` }}
            />
            <div
              className="bg-rose-500 h-full transition-all"
              style={{ width: `${(incorrectCount / mcqs.length) * 100}%` }}
            />
            <div
              className="bg-slate-300 dark:bg-slate-700 h-full transition-all"
              style={{ width: `${(unattemptedCount / mcqs.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setIsReviewMode(true)}
            className="py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Answers & Explanations</span>
          </button>

          <button
            onClick={handleRetry}
            className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Test</span>
          </button>

          <button
            onClick={onBackToChapter}
            className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Back to Chapter Notes</span>
          </button>

          {hasNextChapter && (
            <button
              onClick={onNextChapter}
              className="py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Next Chapter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ================= ACTIVE TEST OR REVIEW MODE =================
  const userSelected = selectedAnswers[currentMCQ.id];
  const isQuestionAnswered = userSelected !== undefined;
  const isCorrect = userSelected === currentMCQ.correctIndex;

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    Hard: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Test Progress & Status Topbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono">
            Q {currentIndex + 1} / {mcqs.length}
          </span>

          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${difficultyColors[currentMCQ.difficulty]}`}>
            {currentMCQ.difficulty}
          </span>

          {currentMCQ.isClinicalCase && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1">
              <Stethoscope className="w-3 h-3" /> Clinical Case
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {isReviewMode && (
            <button
              onClick={() => setIsReviewMode(false)}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Back to Summary
            </button>
          )}
        </div>
      </div>

      {/* Question Stepper Indicator */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {mcqs.map((q, idx) => {
          const ans = selectedAnswers[q.id];
          const isCurrent = idx === currentIndex;
          let badgeClass = 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';

          if (isSubmitted) {
            if (ans === q.correctIndex) {
              badgeClass = 'bg-emerald-500 text-white font-bold';
            } else if (ans !== undefined) {
              badgeClass = 'bg-rose-500 text-white font-bold';
            } else {
              badgeClass = 'bg-slate-300 dark:bg-slate-700 text-slate-600';
            }
          } else if (ans !== undefined) {
            badgeClass = 'bg-sky-500 text-white font-bold';
          }

          if (isCurrent) {
            badgeClass += ' ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900';
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center shrink-0 transition-all ${badgeClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
        {/* Clinical Case Vignette (if clinical case question) */}
        {currentMCQ.clinicalCase && (
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Patient Clinical Vignette
              </span>
              <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 bg-white/80 dark:bg-indigo-900/80 px-2.5 py-0.5 rounded-full">
                {currentMCQ.clinicalCase.patientAge} • {currentMCQ.clinicalCase.gender}
              </span>
            </div>

            <div className="space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <p>
                <strong>History & Symptoms: </strong>
                {currentMCQ.clinicalCase.presentingSymptoms}. {currentMCQ.clinicalCase.medicalHistory}.
              </p>
              <p>
                <strong>Physical Examination: </strong>
                {currentMCQ.clinicalCase.vitalsAndExam}
              </p>
              {currentMCQ.clinicalCase.labValues && (
                <p>
                  <strong>Laboratory Investigations: </strong>
                  {currentMCQ.clinicalCase.labValues}
                </p>
              )}
              {currentMCQ.clinicalCase.imagingAndECG && (
                <p>
                  <strong>Imaging & Diagnostics: </strong>
                  {currentMCQ.clinicalCase.imagingAndECG}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Question Statement */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {currentMCQ.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentMCQ.options.map((optionText, optIdx) => {
            const isOptSelected = userSelected === optIdx;
            const isOptCorrect = currentMCQ.correctIndex === optIdx;
            const letters = ['A', 'B', 'C', 'D'];

            let optionStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-200';

            if (isSubmitted) {
              if (isOptCorrect) {
                optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
              } else if (isOptSelected && !isOptCorrect) {
                optionStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
              }
            } else if (isOptSelected) {
              optionStyle = 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-950 dark:text-sky-100 ring-2 ring-sky-500';
            }

            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${optionStyle}`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  isOptSelected && !isSubmitted
                    ? 'bg-sky-600 text-white'
                    : isSubmitted && isOptCorrect
                    ? 'bg-emerald-600 text-white'
                    : isSubmitted && isOptSelected && !isOptCorrect
                    ? 'bg-rose-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {letters[optIdx]}
                </div>

                <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                  {optionText}
                </div>

                {isSubmitted && isOptCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isSubmitted && isOptSelected && !isOptCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed Review & Explanation (Visible ONLY after submission) */}
        {isSubmitted && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isCorrect ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {isCorrect ? 'Correct Clinical Decision' : 'Incorrect Selection'}
              </span>

              <button
                onClick={() =>
                  toggleBookmark(
                    'mcq',
                    currentMCQ.id,
                    chapter.id,
                    chapter.bookId,
                    `MCQ: ${currentMCQ.question.slice(0, 50)}...`,
                    `Answer: ${currentMCQ.options[currentMCQ.correctIndex]}`
                  )
                }
                className="text-xs text-amber-600 flex items-center gap-1 font-bold hover:underline"
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>Bookmark for Spaced Repetition</span>
              </button>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>Correct Answer: </strong>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  Option {['A', 'B', 'C', 'D'][currentMCQ.correctIndex]} — {currentMCQ.options[currentMCQ.correctIndex]}
                </span>
              </p>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Detailed Medical Rationale:
                </span>
                <p className="text-slate-800 dark:text-slate-200">
                  {currentMCQ.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation & Submit footer */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
              currentIndex > 0
                ? 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                : 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {!isSubmitted ? (
            currentIndex === mcqs.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Assessment</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(mcqs.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex(prev => Math.min(mcqs.length - 1, prev + 1))}
                disabled={currentIndex === mcqs.length - 1}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                  currentIndex < mcqs.length - 1
                    ? 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                    : 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
