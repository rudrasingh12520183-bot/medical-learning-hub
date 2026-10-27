import {
  Book,
  Subject,
  Chapter,
  StudyMaterial,
  MCQ,
  MCQAttempt,
  MindMap,
  MindMapNode,
  Bookmark,
  Progress,
  User,
  GlobalSearchResult
} from '../types';
import {
  INITIAL_BOOKS,
  INITIAL_SUBJECTS,
  INITIAL_CHAPTERS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_MCQS,
  INITIAL_MIND_MAPS,
  INITIAL_USERS,
  INITIAL_PROGRESS,
  INITIAL_BOOKMARKS
} from '../data/initialDemoData';

const STORAGE_KEYS = {
  BOOKS: 'mlh_books_v2',
  SUBJECTS: 'mlh_subjects_v2',
  CHAPTERS: 'mlh_chapters_v2',
  STUDY_MATERIALS: 'mlh_study_materials_v2',
  MCQS: 'mlh_mcqs_v2',
  MCQ_ATTEMPTS: 'mlh_mcq_attempts_v2',
  MIND_MAPS: 'mlh_mind_maps_v2',
  USERS: 'mlh_users_v2',
  PROGRESS: 'mlh_progress_v2',
  BOOKMARKS: 'mlh_bookmarks_v2',
  CURRENT_USER_ID: 'mlh_active_user_id_v2',
};


// Helper to safely load or initialize storage
function getStorage<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading localStorage key ${key}:`, err);
    return defaultData;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error setting localStorage key ${key}:`, err);
  }
}

export const dbService = {
  // ================= BOOKS =================
  getBooks(): Book[] {
    const books = getStorage<Book[]>(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
    return [...books].sort((a, b) => a.orderIndex - b.orderIndex);
  },

  getBookById(id: string): Book | undefined {
    return this.getBooks().find(b => b.id === id);
  },

  saveBook(book: Book): void {
    const books = this.getBooks();
    const idx = books.findIndex(b => b.id === book.id);
    if (idx >= 0) {
      books[idx] = book;
    } else {
      books.push(book);
    }
    setStorage(STORAGE_KEYS.BOOKS, books);
  },

  deleteBook(bookId: string): void {
    const books = this.getBooks().filter(b => b.id !== bookId);
    setStorage(STORAGE_KEYS.BOOKS, books);
  },

  // ================= SUBJECTS =================
  getAllSubjects(): Subject[] {
    const subs = getStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    return [...subs].sort((a, b) => a.orderIndex - b.orderIndex);
  },

  getSubjectsByBook(bookId: string): Subject[] {
    return this.getAllSubjects().filter(s => s.bookId === bookId);
  },

  getSubjectById(id: string): Subject | undefined {
    return this.getAllSubjects().find(s => s.id === id);
  },

  saveSubject(subject: Subject): void {
    const subs = this.getAllSubjects();
    const idx = subs.findIndex(s => s.id === subject.id);
    if (idx >= 0) {
      subs[idx] = subject;
    } else {
      subs.push(subject);
    }
    setStorage(STORAGE_KEYS.SUBJECTS, subs);
  },

  deleteSubject(subjectId: string): void {
    const subs = this.getAllSubjects().filter(s => s.id !== subjectId);
    setStorage(STORAGE_KEYS.SUBJECTS, subs);
  },

  reorderSubjects(bookId: string, orderedSubjectIds: string[]): void {
    const all = this.getAllSubjects();
    orderedSubjectIds.forEach((id, idx) => {
      const match = all.find(s => s.id === id);
      if (match) match.orderIndex = idx + 1;
    });
    setStorage(STORAGE_KEYS.SUBJECTS, all);
  },

  // ================= CHAPTERS =================
  getAllChapters(): Chapter[] {
    const chaps = getStorage<Chapter[]>(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
    return [...chaps].sort((a, b) => a.orderIndex - b.orderIndex);
  },

  getChaptersBySubject(subjectId: string): Chapter[] {
    return this.getAllChapters().filter(c => c.subjectId === subjectId);
  },

  getChaptersByBook(bookId: string): Chapter[] {
    return this.getAllChapters().filter(c => c.bookId === bookId);
  },

  getChapterById(id: string): Chapter | undefined {
    return this.getAllChapters().find(c => c.id === id);
  },

  saveChapter(chapter: Chapter): void {
    const chaps = this.getAllChapters();
    const idx = chaps.findIndex(c => c.id === chapter.id);
    if (idx >= 0) {
      chaps[idx] = chapter;
    } else {
      chaps.push(chapter);
    }
    setStorage(STORAGE_KEYS.CHAPTERS, chaps);
  },

  deleteChapter(chapterId: string): void {
    const chaps = this.getAllChapters().filter(c => c.id !== chapterId);
    setStorage(STORAGE_KEYS.CHAPTERS, chaps);
  },

  togglePublishChapter(chapterId: string): boolean {
    const chaps = this.getAllChapters();
    const item = chaps.find(c => c.id === chapterId);
    if (item) {
      item.isPublished = !item.isPublished;
      setStorage(STORAGE_KEYS.CHAPTERS, chaps);
      return item.isPublished;
    }
    return false;
  },

  // ================= STUDY MATERIAL =================
  getStudyMaterial(chapterId: string): StudyMaterial | undefined {
    const all = getStorage<StudyMaterial[]>(STORAGE_KEYS.STUDY_MATERIALS, INITIAL_STUDY_MATERIALS);
    return all.find(m => m.chapterId === chapterId);
  },

  saveStudyMaterial(material: StudyMaterial): void {
    const all = getStorage<StudyMaterial[]>(STORAGE_KEYS.STUDY_MATERIALS, INITIAL_STUDY_MATERIALS);
    const idx = all.findIndex(m => m.id === material.id || m.chapterId === material.chapterId);
    if (idx >= 0) {
      all[idx] = { ...material, updatedAt: new Date().toISOString() };
    } else {
      all.push({ ...material, updatedAt: new Date().toISOString() });
    }
    setStorage(STORAGE_KEYS.STUDY_MATERIALS, all);
  },

  // ================= MCQS =================
  getAllMCQs(): MCQ[] {
    const mcqs = getStorage<MCQ[]>(STORAGE_KEYS.MCQS, INITIAL_MCQS);
    return [...mcqs].sort((a, b) => a.orderIndex - b.orderIndex);
  },

  getMCQsByChapter(chapterId: string): MCQ[] {
    return this.getAllMCQs().filter(m => m.chapterId === chapterId);
  },

  getMCQById(id: string): MCQ | undefined {
    return this.getAllMCQs().find(m => m.id === id);
  },

  saveMCQ(mcq: MCQ): void {
    const all = this.getAllMCQs();
    const idx = all.findIndex(m => m.id === mcq.id);
    if (idx >= 0) {
      all[idx] = mcq;
    } else {
      all.push(mcq);
    }
    setStorage(STORAGE_KEYS.MCQS, all);
  },

  deleteMCQ(mcqId: string): void {
    const all = this.getAllMCQs().filter(m => m.id !== mcqId);
    setStorage(STORAGE_KEYS.MCQS, all);
  },

  bulkImportMCQs(chapterId: string, mcqList: Partial<MCQ>[]): number {
    const all = this.getAllMCQs();
    let imported = 0;
    const currentMax = all.filter(m => m.chapterId === chapterId).length;

    mcqList.forEach((raw, i) => {
      if (raw.question && raw.options && raw.options.length === 4) {
        const item: MCQ = {
          id: `mcq_imp_${Date.now()}_${i}`,
          chapterId,
          question: raw.question,
          options: raw.options as [string, string, string, string],
          correctIndex: raw.correctIndex ?? 0,
          explanation: raw.explanation || 'No detailed explanation provided.',
          difficulty: raw.difficulty || 'Medium',
          isClinicalCase: Boolean(raw.isClinicalCase),
          clinicalCase: raw.clinicalCase,
          orderIndex: currentMax + i + 1,
          tags: raw.tags || []
        };
        all.push(item);
        imported++;
      }
    });

    setStorage(STORAGE_KEYS.MCQS, all);
    return imported;
  },

  // ================= MCQ ATTEMPTS =================
  saveAttempt(attempt: Omit<MCQAttempt, 'id' | 'completedAt'>): MCQAttempt {
    const all = getStorage<MCQAttempt[]>(STORAGE_KEYS.MCQ_ATTEMPTS, []);
    const newAttempt: MCQAttempt = {
      ...attempt,
      id: `att_${Date.now()}`,
      completedAt: new Date().toISOString()
    };
    all.unshift(newAttempt);
    setStorage(STORAGE_KEYS.MCQ_ATTEMPTS, all);

    // Update user progress metrics
    this.updateProgress(attempt.userId, attempt.chapterId, attempt.bookId, {
      bestScore: attempt.score,
      lastScore: attempt.score,
      isCompleted: attempt.score >= 50
    });

    return newAttempt;
  },

  getUserAttempts(userId: string): MCQAttempt[] {
    const all = getStorage<MCQAttempt[]>(STORAGE_KEYS.MCQ_ATTEMPTS, []);
    return all.filter(a => a.userId === userId);
  },

  getAllAttempts(): MCQAttempt[] {
    return getStorage<MCQAttempt[]>(STORAGE_KEYS.MCQ_ATTEMPTS, []);
  },

  // ================= MIND MAPS =================
  getMindMapByChapter(chapterId: string): MindMap | undefined {
    const all = getStorage<MindMap[]>(STORAGE_KEYS.MIND_MAPS, INITIAL_MIND_MAPS);
    return all.find(mm => mm.chapterId === chapterId);
  },

  saveMindMap(map: MindMap): void {
    const all = getStorage<MindMap[]>(STORAGE_KEYS.MIND_MAPS, INITIAL_MIND_MAPS);
    const idx = all.findIndex(m => m.id === map.id || m.chapterId === map.chapterId);
    if (idx >= 0) {
      all[idx] = { ...map, updatedAt: new Date().toISOString() };
    } else {
      all.push({ ...map, updatedAt: new Date().toISOString() });
    }
    setStorage(STORAGE_KEYS.MIND_MAPS, all);
  },

  addMindMapNode(chapterId: string, parentNodeId: string, text: string, type: MindMapNode['type'], notes?: string): MindMap | undefined {
    const map = this.getMindMapByChapter(chapterId);
    if (!map) return undefined;

    const newNodeId = `node_${Date.now()}`;
    const newNode: MindMapNode = {
      id: newNodeId,
      parentId: parentNodeId,
      text,
      type,
      notes
    };
    map.nodes.push(newNode);
    map.edges.push({
      id: `edge_${Date.now()}`,
      source: parentNodeId,
      target: newNodeId
    });
    this.saveMindMap(map);
    return map;
  },

  deleteMindMapNode(chapterId: string, nodeId: string): MindMap | undefined {
    const map = this.getMindMapByChapter(chapterId);
    if (!map || nodeId === map.rootNodeId) return undefined;

    // Filter node and child nodes
    const nodeIdsToRemove = new Set<string>([nodeId]);
    let added = true;
    while (added) {
      added = false;
      map.nodes.forEach(n => {
        if (n.parentId && nodeIdsToRemove.has(n.parentId) && !nodeIdsToRemove.has(n.id)) {
          nodeIdsToRemove.add(n.id);
          added = true;
        }
      });
    }

    map.nodes = map.nodes.filter(n => !nodeIdsToRemove.has(n.id));
    map.edges = map.edges.filter(e => !nodeIdsToRemove.has(e.source) && !nodeIdsToRemove.has(e.target));
    this.saveMindMap(map);
    return map;
  },

  // ================= BOOKMARKS =================
  getUserBookmarks(userId: string): Bookmark[] {
    const all = getStorage<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, INITIAL_BOOKMARKS);
    return all.filter(b => b.userId === userId);
  },

  isBookmarked(userId: string, targetId: string): boolean {
    const list = this.getUserBookmarks(userId);
    return list.some(b => b.targetId === targetId);
  },

  toggleBookmark(bookmarkData: Omit<Bookmark, 'id' | 'createdAt'>): boolean {
    const all = getStorage<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, INITIAL_BOOKMARKS);
    const existingIndex = all.findIndex(b => b.userId === bookmarkData.userId && b.targetId === bookmarkData.targetId);

    if (existingIndex >= 0) {
      all.splice(existingIndex, 1);
      setStorage(STORAGE_KEYS.BOOKMARKS, all);
      return false; // removed
    } else {
      const newBm: Bookmark = {
        ...bookmarkData,
        id: `bm_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      all.unshift(newBm);
      setStorage(STORAGE_KEYS.BOOKMARKS, all);
      return true; // added
    }
  },

  removeBookmark(bookmarkId: string): void {
    const all = getStorage<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, INITIAL_BOOKMARKS);
    const filtered = all.filter(b => b.id !== bookmarkId);
    setStorage(STORAGE_KEYS.BOOKMARKS, filtered);
  },

  // ================= PROGRESS =================
  getUserProgress(userId: string): Progress[] {
    const all = getStorage<Progress[]>(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    return all.filter(p => p.userId === userId);
  },

  getProgressForChapter(userId: string, chapterId: string): Progress | undefined {
    return this.getUserProgress(userId).find(p => p.chapterId === chapterId);
  },

  updateProgress(
    userId: string,
    chapterId: string,
    bookId: string,
    updates: Partial<Progress>
  ): Progress {
    const all = getStorage<Progress[]>(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    const idx = all.findIndex(p => p.userId === userId && p.chapterId === chapterId);

    if (idx >= 0) {
      const existing = all[idx];
      const newBestScore = updates.bestScore !== undefined
        ? Math.max(existing.bestScore || 0, updates.bestScore)
        : existing.bestScore;

      all[idx] = {
        ...existing,
        ...updates,
        bestScore: newBestScore,
        attemptsCount: updates.lastScore !== undefined ? existing.attemptsCount + 1 : existing.attemptsCount,
        lastAccessedAt: new Date().toISOString()
      };
      setStorage(STORAGE_KEYS.PROGRESS, all);
      return all[idx];
    } else {
      const newProg: Progress = {
        id: `prog_${Date.now()}`,
        userId,
        chapterId,
        bookId,
        isCompleted: Boolean(updates.isCompleted),
        readingPercent: updates.readingPercent || 0,
        mindMapExplored: Boolean(updates.mindMapExplored),
        bestScore: updates.bestScore,
        lastScore: updates.lastScore,
        attemptsCount: updates.lastScore !== undefined ? 1 : 0,
        lastAccessedAt: new Date().toISOString(),
        ...updates
      };
      all.push(newProg);
      setStorage(STORAGE_KEYS.PROGRESS, all);
      return newProg;
    }
  },

  // ================= USERS & AUTH =================
  getUsers(): User[] {
    return getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  },

  getActiveUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_student_1';
  },

  setActiveUserId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
  },

  saveUser(user: User): void {
    const all = this.getUsers();
    const idx = all.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      all[idx] = user;
    } else {
      all.push(user);
    }
    setStorage(STORAGE_KEYS.USERS, all);
  },

  registerUser(name: string, email: string, role: 'student' | 'admin', college?: string): User {
    const all = this.getUsers();
    const existing = all.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return existing;
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      collegeOrHospital: college || 'Medical University Hospital',
      yearOfStudy: role === 'admin' ? 'Faculty Admin' : 'MBBS Student',
      streakDays: 1,
      createdAt: new Date().toISOString()
    };
    all.push(newUser);
    setStorage(STORAGE_KEYS.USERS, all);
    this.setActiveUserId(newUser.id);
    return newUser;
  },

  // ================= GLOBAL SEARCH =================
  searchAll(query: string): GlobalSearchResult[] {
    const clean = query.trim().toLowerCase();
    if (!clean) return [];

    const results: GlobalSearchResult[] = [];
    const books = this.getBooks();
    const subjects = this.getAllSubjects();
    const chapters = this.getAllChapters();
    const materials = getStorage<StudyMaterial[]>(STORAGE_KEYS.STUDY_MATERIALS, INITIAL_STUDY_MATERIALS);
    const mcqs = this.getAllMCQs();
    const mindMaps = getStorage<MindMap[]>(STORAGE_KEYS.MIND_MAPS, INITIAL_MIND_MAPS);

    // Search Books
    books.forEach(b => {
      if (b.title.toLowerCase().includes(clean) || b.description.toLowerCase().includes(clean)) {
        results.push({
          id: b.id,
          type: 'book',
          title: b.title,
          snippet: b.description,
          breadcrumb: b.edition,
          bookId: b.id
        });
      }
    });

    // Search Subjects
    subjects.forEach(s => {
      if (s.title.toLowerCase().includes(clean) || s.description.toLowerCase().includes(clean)) {
        const book = books.find(b => b.id === s.bookId);
        results.push({
          id: s.id,
          type: 'subject',
          title: s.title,
          snippet: s.description,
          breadcrumb: `${book?.title || 'Book'} > ${s.title}`,
          bookId: s.bookId
        });
      }
    });

    // Search Chapters
    chapters.forEach(c => {
      if (c.title.toLowerCase().includes(clean) || c.description.toLowerCase().includes(clean)) {
        const book = books.find(b => b.id === c.bookId);
        const sub = subjects.find(s => s.id === c.subjectId);
        results.push({
          id: c.id,
          type: 'chapter',
          title: c.title,
          snippet: c.description,
          breadcrumb: `${book?.shortCode.toUpperCase()} > ${sub?.title || 'Topic'} > ${c.title}`,
          bookId: c.bookId,
          chapterId: c.id
        });
      }
    });

    // Search Study Material sections
    materials.forEach(m => {
      const chap = chapters.find(c => c.id === m.chapterId);
      if (!chap) return;
      const book = books.find(b => b.id === chap.bookId);

      m.sections.forEach(sec => {
        if (sec.heading.toLowerCase().includes(clean) || sec.content.toLowerCase().includes(clean)) {
          results.push({
            id: `${m.id}_${sec.id}`,
            type: 'studyMaterial',
            title: `${chap.title}: ${sec.heading}`,
            snippet: sec.content.slice(0, 140) + '...',
            breadcrumb: `${book?.shortCode.toUpperCase()} > ${chap.title} > Study Notes`,
            bookId: chap.bookId,
            chapterId: chap.id
          });
        }
      });

      m.clinicalPearls.forEach(cp => {
        if (cp.title.toLowerCase().includes(clean) || cp.content.toLowerCase().includes(clean)) {
          results.push({
            id: cp.id,
            type: 'studyMaterial',
            title: `Pearl: ${cp.title}`,
            snippet: cp.content.slice(0, 140) + '...',
            breadcrumb: `${book?.shortCode.toUpperCase()} > ${chap.title} > Clinical Pearl`,
            bookId: chap.bookId,
            chapterId: chap.id
          });
        }
      });
    });

    // Search MCQs
    mcqs.forEach(q => {
      if (q.question.toLowerCase().includes(clean) || q.explanation.toLowerCase().includes(clean)) {
        const chap = chapters.find(c => c.id === q.chapterId);
        const book = books.find(b => b.id === chap?.bookId);
        results.push({
          id: q.id,
          type: 'mcq',
          title: `MCQ (${q.difficulty}): ${q.question.slice(0, 75)}...`,
          snippet: q.explanation.slice(0, 140) + '...',
          breadcrumb: `${book?.shortCode.toUpperCase() || 'Medicine'} > ${chap?.title || 'Chapter'} > MCQ Test`,
          bookId: chap?.bookId || 'book_med',
          chapterId: q.chapterId
        });
      }
    });

    // Search Mind Maps
    mindMaps.forEach(mm => {
      const matchNode = mm.nodes.find(n => n.text.toLowerCase().includes(clean) || (n.notes && n.notes.toLowerCase().includes(clean)));
      if (matchNode) {
        const chap = chapters.find(c => c.id === mm.chapterId);
        const book = books.find(b => b.id === chap?.bookId);
        results.push({
          id: mm.id,
          type: 'mindMap',
          title: `Mind Map Node: ${matchNode.text}`,
          snippet: matchNode.notes || `Interactive concept node in ${mm.title}`,
          breadcrumb: `${book?.shortCode.toUpperCase() || 'Medical'} > ${chap?.title || 'Chapter'} > Mind Map`,
          bookId: chap?.bookId || 'book_med',
          chapterId: chap?.id
        });
      }
    });

    return results.slice(0, 25);
  },

  // Reset database back to default seed data
  resetDatabase(): void {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(INITIAL_CHAPTERS));
    localStorage.setItem(STORAGE_KEYS.STUDY_MATERIALS, JSON.stringify(INITIAL_STUDY_MATERIALS));
    localStorage.setItem(STORAGE_KEYS.MCQS, JSON.stringify(INITIAL_MCQS));
    localStorage.setItem(STORAGE_KEYS.MIND_MAPS, JSON.stringify(INITIAL_MIND_MAPS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(INITIAL_PROGRESS));
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(INITIAL_BOOKMARKS));
    localStorage.removeItem(STORAGE_KEYS.MCQ_ATTEMPTS);
  }
};
