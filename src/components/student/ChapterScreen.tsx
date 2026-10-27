import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  BookOpen,
  Award,
  Brain,
  Bookmark,
  CheckCircle2,
  Clock,
  Share2,
  CloudDownload,
  HardDrive
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StudyMaterialViewer } from './StudyMaterialViewer';
import { MCQTestEngine } from './MCQTestEngine';
import { MindMapViewer } from './MindMapViewer';
import { dbService } from '../../services/db';
import { offlineCacheService } from '../../services/offlineCacheService';

interface ChapterScreenProps {
  chapterId: string;
  onBack: () => void;
  onNavigateChapter: (chapterId: string) => void;
}

export type ChapterTab = 'study' | 'mcq' | 'mindmap';

export const ChapterScreen: React.FC<ChapterScreenProps> = ({
  chapterId,
  onBack,
  onNavigateChapter
}) => {
  const {
    chapters,
    books,
    subjects,
    progressList,
    markChapterComplete,
    toggleBookmark,
    isBookmarked
  } = useData();

  const [activeTab, setActiveTab] = useState<ChapterTab>('study');
  const [isCachedOffline, setIsCachedOffline] = useState<boolean>(() =>
    offlineCacheService.isChapterCached(chapterId)
  );

  const chapter = chapters.find(c => c.id === chapterId);
  const book = books.find(b => b.id === chapter?.bookId);
  const subject = subjects.find(s => s.id === chapter?.subjectId);

  // Subject siblings for prev/next
  const siblingChapters = chapters.filter(c => c.subjectId === chapter?.subjectId && c.isPublished);
  const currentIndex = siblingChapters.findIndex(c => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? siblingChapters[currentIndex - 1] : undefined;
  const nextChapter = currentIndex >= 0 && currentIndex < siblingChapters.length - 1 ? siblingChapters[currentIndex + 1] : undefined;

  // Retrieve material, mcqs, mindmap
  const studyMaterial = chapter ? dbService.getStudyMaterial(chapter.id) : undefined;
  const mcqs = chapter ? dbService.getMCQsByChapter(chapter.id) : [];
  const mindMap = chapter ? dbService.getMindMapByChapter(chapter.id) : undefined;

  const currentProgress = progressList.find(p => p.chapterId === chapterId);
  const isCompleted = Boolean(currentProgress?.isCompleted);
  const isMarked = chapter ? isBookmarked(chapter.id) : false;

  useEffect(() => {
    // Scroll to top when chapter changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('study');

    // Automatically cache visited chapter for seamless offline study
    if (chapterId) {
      offlineCacheService.recordChapterVisited(chapterId).then(() => {
        setIsCachedOffline(true);
      });
    }

    const unsub = offlineCacheService.subscribe(() => {
      setIsCachedOffline(offlineCacheService.isChapterCached(chapterId));
    });
    return unsub;
  }, [chapterId]);

  if (!chapter) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500">Chapter not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
        >
          Return to Books
        </button>
      </div>
    );
  }

  const handleToggleComplete = () => {
    markChapterComplete(chapter.id, chapter.bookId);
  };

  const handleToggleBookmark = () => {
    toggleBookmark(
      'chapter',
      chapter.id,
      chapter.id,
      chapter.bookId,
      chapter.title,
      chapter.description
    );
  };

  const handleToggleOfflineCache = async () => {
    if (isCachedOffline) {
      await offlineCacheService.removeChapter(chapter.id);
      setIsCachedOffline(false);
    } else {
      await offlineCacheService.cacheChapter(chapter.id, false);
      setIsCachedOffline(true);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Breadcrumb & Header Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={onBack}
            className="flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to {subject?.title || 'Topic'}</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {chapter.estimatedMinutes} min read
            </span>

            {/* Offline Cache status toggle */}
            <button
              onClick={handleToggleOfflineCache}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                isCachedOffline
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600'
              }`}
              title={isCachedOffline ? 'Available offline. Click to remove from cache.' : 'Click to save for offline study.'}
            >
              {isCachedOffline ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Offline Ready</span>
                </>
              ) : (
                <>
                  <CloudDownload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save Offline</span>
                </>
              )}
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isMarked
                  ? 'bg-amber-500 border-amber-600 text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-500'
              }`}
              title="Bookmark Chapter"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title and metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
              <span>{book?.title}</span>
              <span>•</span>
              <span className="text-sky-600 dark:text-sky-400">{subject?.title}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {chapter.title}
            </h1>
          </div>

          <button
            onClick={handleToggleComplete}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 ring-1 ring-emerald-500/50'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Completed' : 'Mark Completed'}</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('study')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'study'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Study Material</span>
        </button>

        <button
          onClick={() => setActiveTab('mcq')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'mcq'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>MCQ Test</span>
          {mcqs.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              {mcqs.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('mindmap')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'mindmap'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Mind Map</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'study' && (
          <StudyMaterialViewer
            chapter={chapter}
            material={studyMaterial}
            onPrevChapter={prevChapter ? () => onNavigateChapter(prevChapter.id) : undefined}
            onNextChapter={nextChapter ? () => onNavigateChapter(nextChapter.id) : undefined}
            hasPrev={Boolean(prevChapter)}
            hasNext={Boolean(nextChapter)}
          />
        )}

        {activeTab === 'mcq' && (
          <MCQTestEngine
            chapter={chapter}
            mcqs={mcqs}
            onBackToChapter={() => setActiveTab('study')}
            onNextChapter={nextChapter ? () => onNavigateChapter(nextChapter.id) : undefined}
            hasNextChapter={Boolean(nextChapter)}
          />
        )}

        {activeTab === 'mindmap' && (
          <MindMapViewer
            chapter={chapter}
            mindMap={mindMap}
          />
        )}
      </div>
    </div>
  );
};
