export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  collegeOrHospital?: string;
  yearOfStudy?: string;
  streakDays: number;
  createdAt: string;
}

export type BookThemeColor = 'blue' | 'rose' | 'emerald' | 'amber' | 'indigo';

export interface Book {
  id: string;
  title: string;
  edition: string;
  author?: string;
  publisher?: string;
  shortCode: 'medicine' | 'gynecology' | 'obstetrics' | string;
  description: string;
  coverColor: BookThemeColor;
  coverImage?: string;
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
}


export interface Subject {
  id: string;
  bookId: string;
  title: string;
  description: string;
  iconName: string;
  orderIndex: number;
  isPublished: boolean;
}

export interface Chapter {
  id: string;
  bookId: string;
  subjectId: string;
  title: string;
  description: string;
  orderIndex: number;
  estimatedMinutes: number;
  isPublished: boolean;
  createdAt: string;
}

export interface ClinicalPearl {
  id: string;
  title: string;
  content: string;
  type: 'pearl' | 'warning' | 'high_yield' | 'mnemonic';
}

export interface ClinicalTable {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
}

export interface StudySection {
  id: string;
  heading: string;
  content: string;
  subsections?: {
    heading: string;
    content: string;
  }[];
}

export interface StudyMaterial {
  id: string;
  chapterId: string;
  overview: string;
  sections: StudySection[];
  clinicalPearls: ClinicalPearl[];
  tables: ClinicalTable[];
  references: string[];
  updatedAt: string;
}

export type MCQDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ClinicalCaseData {
  patientAge: string;
  gender: string;
  presentingSymptoms: string;
  medicalHistory: string;
  vitalsAndExam: string;
  labValues?: string;
  imagingAndECG?: string;
  clinicalQuestion: string;
}

export interface MCQ {
  id: string;
  chapterId: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3
  explanation: string;
  difficulty: MCQDifficulty;
  isClinicalCase: boolean;
  clinicalCase?: ClinicalCaseData;
  orderIndex: number;
  tags?: string[];
}

export interface MCQAttempt {
  id: string;
  userId: string;
  chapterId: string;
  chapterTitle: string;
  bookId: string;
  score: number;
  total: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  percentage: number;
  accuracy: number;
  timeTakenSeconds: number;
  userAnswers: Record<string, number>; // mcqId -> selected index
  completedAt: string;
}

export type MindMapNodeType = 'root' | 'etiology' | 'pathophysiology' | 'clinical' | 'investigations' | 'management' | 'pearl';

export interface MindMapNode {
  id: string;
  text: string;
  type: MindMapNodeType;
  parentId?: string;
  notes?: string;
  isCollapsed?: boolean;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface MindMap {
  id: string;
  chapterId: string;
  title: string;
  rootNodeId: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  updatedAt: string;
}

export type BookmarkType = 'chapter' | 'studyMaterial' | 'mcq' | 'mindMap';

export interface Bookmark {
  id: string;
  userId: string;
  type: BookmarkType;
  targetId: string;
  chapterId: string;
  bookId: string;
  title: string;
  subtitle: string;
  createdAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  chapterId: string;
  bookId: string;
  isCompleted: boolean;
  readingPercent: number;
  mindMapExplored: boolean;
  bestScore?: number;
  lastScore?: number;
  attemptsCount: number;
  lastAccessedAt: string;
}

export interface GlobalSearchResult {
  id: string;
  type: 'book' | 'subject' | 'chapter' | 'studyMaterial' | 'mcq' | 'mindMap';
  title: string;
  snippet: string;
  breadcrumb: string;
  bookId: string;
  chapterId?: string;
}
