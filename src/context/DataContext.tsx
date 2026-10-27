import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Book,
  Subject,
  Chapter,
  StudyMaterial,
  MCQ,
  MCQAttempt,
  MindMap,
  Bookmark,
  Progress
} from '../types';
import { dbService } from '../services/db';
import { useAuth } from './AuthContext';

interface DataContextType {
  books: Book[];
  subjects: Subject[];
  chapters: Chapter[];
  progressList: Progress[];
  bookmarksList: Bookmark[];
  attemptsList: MCQAttempt[];

  // Student Actions
  markChapterComplete: (chapterId: string, bookId: string) => void;
  updateReadingProgress: (chapterId: string, bookId: string, percent: number) => void;
  recordMindMapView: (chapterId: string, bookId: string) => void;
  recordQuizAttempt: (attempt: Omit<MCQAttempt, 'id' | 'completedAt'>) => MCQAttempt;
  toggleBookmark: (type: Bookmark['type'], targetId: string, chapterId: string, bookId: string, title: string, subtitle: string) => boolean;
  isBookmarked: (targetId: string) => boolean;

  // Calculators
  getBookProgress: (bookId: string) => { completed: number; total: number; percentage: number };
  getOverallStats: () => {
    totalChapters: number;
    completedChapters: number;
    completionPercentage: number;
    totalAttempts: number;
    averageScore: number;
    averageAccuracy: number;
  };

  // CMS / Admin Actions
  saveBook: (book: Book) => void;
  deleteBook: (bookId: string) => void;
  saveSubject: (subject: Subject) => void;
  deleteSubject: (subjectId: string) => void;
  reorderSubjects: (bookId: string, ids: string[]) => void;
  saveChapter: (chapter: Chapter) => void;
  deleteChapter: (chapterId: string) => void;
  togglePublishChapter: (chapterId: string) => void;
  saveStudyMaterial: (material: StudyMaterial) => void;
  saveMCQ: (mcq: MCQ) => void;
  deleteMCQ: (mcqId: string) => void;
  bulkImportMCQs: (chapterId: string, list: Partial<MCQ>[]) => number;
  saveMindMap: (mindMap: MindMap) => void;
  resetToDefaultSeed: () => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [bookmarksList, setBookmarksList] = useState<Bookmark[]>([]);
  const [attemptsList, setAttemptsList] = useState<MCQAttempt[]>([]);

  const refreshData = useCallback(() => {
    const b = dbService.getBooks();
    const s = dbService.getAllSubjects();
    const c = dbService.getAllChapters();
    setBooks(b);
    setSubjects(s);
    setChapters(c);

    if (currentUser) {
      setProgressList(dbService.getUserProgress(currentUser.id));
      setBookmarksList(dbService.getUserBookmarks(currentUser.id));
      setAttemptsList(dbService.getUserAttempts(currentUser.id));
    } else {
      setProgressList([]);
      setBookmarksList([]);
      setAttemptsList([]);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Student Actions
  const markChapterComplete = (chapterId: string, bookId: string) => {
    if (!currentUser) return;
    const existing = dbService.getProgressForChapter(currentUser.id, chapterId);
    dbService.updateProgress(currentUser.id, chapterId, bookId, {
      isCompleted: !existing?.isCompleted,
      readingPercent: 100
    });
    refreshData();
  };

  const updateReadingProgress = (chapterId: string, bookId: string, percent: number) => {
    if (!currentUser) return;
    const existing = dbService.getProgressForChapter(currentUser.id, chapterId);
    const maxPercent = Math.max(existing?.readingPercent || 0, percent);
    dbService.updateProgress(currentUser.id, chapterId, bookId, {
      readingPercent: maxPercent,
      isCompleted: maxPercent >= 95 ? true : existing?.isCompleted
    });
    refreshData();
  };

  const recordMindMapView = (chapterId: string, bookId: string) => {
    if (!currentUser) return;
    dbService.updateProgress(currentUser.id, chapterId, bookId, {
      mindMapExplored: true
    });
    refreshData();
  };

  const recordQuizAttempt = (attempt: Omit<MCQAttempt, 'id' | 'completedAt'>) => {
    const result = dbService.saveAttempt(attempt);
    refreshData();
    return result;
  };

  const toggleBookmark = (
    type: Bookmark['type'],
    targetId: string,
    chapterId: string,
    bookId: string,
    title: string,
    subtitle: string
  ): boolean => {
    if (!currentUser) return false;
    const isNowBookmarked = dbService.toggleBookmark({
      userId: currentUser.id,
      type,
      targetId,
      chapterId,
      bookId,
      title,
      subtitle
    });
    refreshData();
    return isNowBookmarked;
  };

  const isBookmarked = (targetId: string): boolean => {
    if (!currentUser) return false;
    return bookmarksList.some(b => b.targetId === targetId);
  };

  // Metrics
  const getBookProgress = (bookId: string) => {
    const bookChapters = chapters.filter(c => c.bookId === bookId && (c.isPublished || currentUser?.role === 'admin'));
    if (bookChapters.length === 0) return { completed: 0, total: 0, percentage: 0 };

    const completed = bookChapters.filter(c => {
      const p = progressList.find(prog => prog.chapterId === c.id);
      return p?.isCompleted;
    }).length;

    const percentage = Math.round((completed / bookChapters.length) * 100);
    return { completed, total: bookChapters.length, percentage };
  };

  const getOverallStats = () => {
    const activeChapters = chapters.filter(c => c.isPublished || currentUser?.role === 'admin');
    const totalChapters = activeChapters.length;
    const completedChapters = activeChapters.filter(c => {
      const p = progressList.find(prog => prog.chapterId === c.id);
      return p?.isCompleted;
    }).length;
    const completionPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    const totalAttempts = attemptsList.length;
    const averageScore = totalAttempts > 0
      ? Math.round(attemptsList.reduce((acc, a) => acc + a.percentage, 0) / totalAttempts)
      : 0;
    const averageAccuracy = totalAttempts > 0
      ? Math.round(attemptsList.reduce((acc, a) => acc + a.accuracy, 0) / totalAttempts)
      : 0;

    return {
      totalChapters,
      completedChapters,
      completionPercentage,
      totalAttempts,
      averageScore,
      averageAccuracy
    };
  };

  // CMS Mutators
  const saveBook = (book: Book) => {
    dbService.saveBook(book);
    refreshData();
  };

  const deleteBook = (bookId: string) => {
    dbService.deleteBook(bookId);
    refreshData();
  };

  const saveSubject = (subject: Subject) => {
    dbService.saveSubject(subject);
    refreshData();
  };

  const deleteSubject = (subjectId: string) => {
    dbService.deleteSubject(subjectId);
    refreshData();
  };

  const reorderSubjects = (bookId: string, ids: string[]) => {
    dbService.reorderSubjects(bookId, ids);
    refreshData();
  };

  const saveChapter = (chapter: Chapter) => {
    dbService.saveChapter(chapter);
    refreshData();
  };

  const deleteChapter = (chapterId: string) => {
    dbService.deleteChapter(chapterId);
    refreshData();
  };

  const togglePublishChapter = (chapterId: string) => {
    dbService.togglePublishChapter(chapterId);
    refreshData();
  };

  const saveStudyMaterial = (material: StudyMaterial) => {
    dbService.saveStudyMaterial(material);
    refreshData();
  };

  const saveMCQ = (mcq: MCQ) => {
    dbService.saveMCQ(mcq);
    refreshData();
  };

  const deleteMCQ = (mcqId: string) => {
    dbService.deleteMCQ(mcqId);
    refreshData();
  };

  const bulkImportMCQs = (chapterId: string, list: Partial<MCQ>[]) => {
    const count = dbService.bulkImportMCQs(chapterId, list);
    refreshData();
    return count;
  };

  const saveMindMap = (mindMap: MindMap) => {
    dbService.saveMindMap(mindMap);
    refreshData();
  };

  const resetToDefaultSeed = () => {
    dbService.resetDatabase();
    refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        books,
        subjects,
        chapters,
        progressList,
        bookmarksList,
        attemptsList,
        markChapterComplete,
        updateReadingProgress,
        recordMindMapView,
        recordQuizAttempt,
        toggleBookmark,
        isBookmarked,
        getBookProgress,
        getOverallStats,
        saveBook,
        deleteBook,
        saveSubject,
        deleteSubject,
        reorderSubjects,
        saveChapter,
        deleteChapter,
        togglePublishChapter,
        saveStudyMaterial,
        saveMCQ,
        deleteMCQ,
        bulkImportMCQs,
        saveMindMap,
        resetToDefaultSeed,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within a DataProvider');
  }
  return ctx;
};
