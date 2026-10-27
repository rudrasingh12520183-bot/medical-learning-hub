import { dbService } from './db';
import { Chapter, StudyMaterial, MCQ, MindMap } from '../types';

export interface OfflineCachedChapterInfo {
  chapterId: string;
  bookId: string;
  subjectId: string;
  title: string;
  subjectTitle: string;
  bookShortCode: string;
  cachedAt: string;
  autoCached: boolean; // true if auto-cached upon visiting, false if explicitly downloaded
  hasStudyMaterial: boolean;
  mcqCount: number;
  hasMindMap: boolean;
  approxSizeKb: number;
}

const OFFLINE_STORAGE_KEY = 'mlh_offline_cached_chapters_catalog_v2';
const CACHE_NAME = 'mlh-offline-materials-v1';

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (err) {
      console.warn('Offline listener error:', err);
    }
  });
}

function loadCatalog(): Record<string, OfflineCachedChapterInfo> {
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!raw) {
      // Auto-seed foundational chapters on first launch
      const initialCatalog: Record<string, OfflineCachedChapterInfo> = {};
      const seedIds = ['ch_med_malaria', 'ch_med_tb', 'ch_med_pna', 'ch_gyn_aub', 'ch_obs_routine'];
      
      seedIds.forEach(id => {
        const chapter = dbService.getChapterById(id);
        if (chapter) {
          const book = dbService.getBookById(chapter.bookId);
          const subject = dbService.getAllSubjects().find(s => s.id === chapter.subjectId);
          const materials = dbService.getStudyMaterial(id);
          const mcqs = dbService.getMCQsByChapter(id);
          const mindMap = dbService.getMindMapByChapter(id);

          initialCatalog[id] = {
            chapterId: id,
            bookId: chapter.bookId,
            subjectId: chapter.subjectId,
            title: chapter.title,
            subjectTitle: subject ? subject.title : 'Clinical Section',
            bookShortCode: book ? book.shortCode : 'Medicine',
            cachedAt: new Date().toISOString(),
            autoCached: true,
            hasStudyMaterial: Boolean(materials),
            mcqCount: mcqs.length,
            hasMindMap: Boolean(mindMap && mindMap.nodes && mindMap.nodes.length > 0),
            approxSizeKb: 14
          };
        }
      });

      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(initialCatalog));
      return initialCatalog;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load offline catalog:', err);
    return {};
  }
}

function saveCatalog(catalog: Record<string, OfflineCachedChapterInfo>) {
  try {
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(catalog));
    notifyListeners();
  } catch (err) {
    console.warn('Failed to save offline catalog:', err);
  }
}

export const offlineCacheService = {
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  getAllCachedChapters(): OfflineCachedChapterInfo[] {
    const catalog = loadCatalog();
    return Object.values(catalog).sort(
      (a, b) => new Date(b.cachedAt).getTime() - new Date(a.cachedAt).getTime()
    );
  },

  isChapterCached(chapterId: string): boolean {
    const catalog = loadCatalog();
    return Boolean(catalog[chapterId]);
  },

  /**
   * Automatically caches a chapter when a student visits it so it remains accessible offline.
   */
  async recordChapterVisited(chapterId: string): Promise<void> {
    await this.cacheChapter(chapterId, true);
  },

  /**
   * Caches a chapter and all its study material, MCQs, and mind maps.
   */
  async cacheChapter(chapterId: string, autoCached: boolean = false): Promise<boolean> {
    try {
      const chapter = dbService.getChapterById(chapterId);
      if (!chapter) return false;

      const book = dbService.getBookById(chapter.bookId);
      const subject = dbService.getAllSubjects().find(s => s.id === chapter.subjectId);
      const materials = dbService.getStudyMaterial(chapterId);
      const mcqs = dbService.getMCQsByChapter(chapterId);
      const mindMap = dbService.getMindMapByChapter(chapterId);

      // Estimate approximate content payload size
      const payloadString = JSON.stringify({ chapter, materials, mcqs, mindMap });
      const sizeKb = Math.max(1, Math.round(payloadString.length / 1024));

      // Also store in Cache API if supported by the browser
      if (typeof caches !== 'undefined') {
        try {
          const cache = await caches.open(CACHE_NAME);
          const dataResponse = new Response(payloadString, {
            headers: { 'Content-Type': 'application/json' }
          });
          await cache.put(`/api/offline/chapters/${chapterId}`, dataResponse);
        } catch (cacheErr) {
          console.warn('Cache API store note:', cacheErr);
        }
      }

      const catalog = loadCatalog();
      // If already explicitly downloaded, keep autoCached as false
      const existing = catalog[chapterId];
      const isAuto = existing ? (existing.autoCached && autoCached) : autoCached;

      catalog[chapterId] = {
        chapterId,
        bookId: chapter.bookId,
        subjectId: chapter.subjectId,
        title: chapter.title,
        subjectTitle: subject ? subject.title : 'Subject',
        bookShortCode: book ? book.shortCode : 'Medicine',
        cachedAt: new Date().toISOString(),
        autoCached: isAuto,
        hasStudyMaterial: Boolean(materials),
        mcqCount: mcqs.length,
        hasMindMap: Boolean(mindMap && mindMap.nodes && mindMap.nodes.length > 0),
        approxSizeKb: sizeKb
      };

      saveCatalog(catalog);
      return true;
    } catch (err) {
      console.warn(`Failed to cache chapter ${chapterId}:`, err);
      return false;
    }
  },

  /**
   * Cache all chapters in an entire subject for full offline access
   */
  async cacheSubjectChapters(subjectId: string): Promise<number> {
    const chapters = dbService.getChaptersBySubject(subjectId);
    let count = 0;
    for (const ch of chapters) {
      const ok = await this.cacheChapter(ch.id, false);
      if (ok) count++;
    }
    return count;
  },

  /**
   * Cache all chapters in an entire book for offline study
   */
  async cacheBookChapters(bookId: string): Promise<number> {
    const chapters = dbService.getChaptersByBook(bookId);
    let count = 0;
    for (const ch of chapters) {
      const ok = await this.cacheChapter(ch.id, false);
      if (ok) count++;
    }
    return count;
  },

  /**
   * Removes a chapter from offline cache
   */
  async removeChapter(chapterId: string): Promise<void> {
    const catalog = loadCatalog();
    if (catalog[chapterId]) {
      delete catalog[chapterId];
      saveCatalog(catalog);
    }

    if (typeof caches !== 'undefined') {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(`/api/offline/chapters/${chapterId}`);
      } catch (err) {
        console.warn('Cache API delete error:', err);
      }
    }
  },

  /**
   * Clears all offline cached chapters
   */
  async clearAllOfflineCache(): Promise<void> {
    saveCatalog({});
    if (typeof caches !== 'undefined') {
      try {
        await caches.delete(CACHE_NAME);
      } catch (err) {
        console.warn('Cache API delete error:', err);
      }
    }
  },

  getStats(): { totalChapters: number; totalKb: number; explicitlyDownloaded: number } {
    const list = this.getAllCachedChapters();
    const totalChapters = list.length;
    const totalKb = list.reduce((acc, c) => acc + c.approxSizeKb, 0);
    const explicitlyDownloaded = list.filter(c => !c.autoCached).length;
    return { totalChapters, totalKb, explicitlyDownloaded };
  }
};
