import React, { useState } from 'react';
import {
  Shield,
  BookOpen,
  Layers,
  FileText,
  Award,
  Brain,
  Users,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Upload,
  Download,
  Eye,
  Save,
  RotateCcw,
  Sparkles,
  Stethoscope,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Book, Subject, Chapter, MCQ, MindMap, StudyMaterial } from '../../types';
import { dbService } from '../../services/db';

type AdminTab = 'overview' | 'topics' | 'chapters' | 'studymat' | 'mcqs' | 'mindmap' | 'importer' | 'students';

export const AdminDashboard: React.FC<{ onPreviewChapter: (chapterId: string) => void }> = ({
  onPreviewChapter
}) => {
  const { allUsers } = useAuth();
  const {
    books,
    subjects,
    chapters,
    attemptsList,
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
    refreshData
  } = useData();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedBookId, setSelectedBookId] = useState<string>(books[0]?.id || 'book_med');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects.find(s => s.bookId === 'book_med')?.id || 'sub_med_infect');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0]?.id || 'chap_med_malaria');

  // Importer state
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);


  // Stats calculation
  const totalStudents = allUsers.filter(u => u.role === 'student').length;
  const totalBooks = books.length;
  const totalTopics = subjects.length;
  const totalChapters = chapters.length;
  const totalMCQs = dbService.getAllMCQs().length;
  const totalMindMaps = 3;
  const totalAttempts = attemptsList.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(attemptsList.reduce((acc, a) => acc + a.score, 0) / totalAttempts)
      : 76;

  // Modals & form states
  // 1. Topic Form State
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [topicForm, setTopicForm] = useState<Partial<Subject>>({
    title: '',
    description: '',
    iconName: 'Heart',
    isPublished: true
  });
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  // 2. Chapter Form State
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [chapterForm, setChapterForm] = useState<Partial<Chapter>>({
    title: '',
    description: '',
    estimatedMinutes: 20,
    isPublished: true
  });
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  // 3. MCQ Form State
  const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
  const [mcqForm, setMcqForm] = useState<Partial<MCQ>>({
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    difficulty: 'Medium',
    isClinicalCase: false,
    clinicalCase: {
      patientAge: '45 years',
      gender: 'Female',
      presentingSymptoms: '',
      medicalHistory: '',
      vitalsAndExam: '',
      labValues: '',
      imagingAndECG: '',
      clinicalQuestion: ''
    }
  });
  const [editingMCQId, setEditingMCQId] = useState<string | null>(null);

  // 4. Study Material Editor State
  const activeChapterMaterial = dbService.getStudyMaterial(selectedChapterId) || {
    id: `mat_${selectedChapterId}`,
    chapterId: selectedChapterId,
    overview: '',
    sections: [],
    clinicalPearls: [],
    tables: [],
    references: [],
    updatedAt: new Date().toISOString()
  };
  const [studyMatEditor, setStudyMatEditor] = useState<StudyMaterial>(activeChapterMaterial);

  // 5. Mind Map Node Form State
  const activeChapterMindMap = dbService.getMindMapByChapter(selectedChapterId);
  const [newMindNodeText, setNewMindNodeText] = useState('');
  const [newMindNodeType, setNewMindNodeType] = useState<
    'etiology' | 'pathophysiology' | 'clinical' | 'investigations' | 'management' | 'pearl'
  >('clinical');
  const [newMindNodeParentId, setNewMindNodeParentId] = useState('');
  const [newMindNodeNotes, setNewMindNodeNotes] = useState('');

  // Bulk CSV state
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [csvFeedback, setCsvFeedback] = useState<string | null>(null);

  // Switch chapter updates
  const handleSelectChapter = (cId: string) => {
    setSelectedChapterId(cId);
    const mat = dbService.getStudyMaterial(cId);
    if (mat) {
      setStudyMatEditor(mat);
    } else {
      setStudyMatEditor({
        id: `mat_${cId}`,
        chapterId: cId,
        overview: '',
        sections: [
          {
            id: `sec_1`,
            heading: 'Clinical Overview & Pathophysiology',
            content: 'Write detailed educational description here...'
          }
        ],
        clinicalPearls: [
          {
            id: `cp_1`,
            title: 'Diagnostic Golden Rule',
            content: 'Important high-yield takeaway.',
            type: 'pearl'
          }
        ],
        tables: [],
        references: [],
        updatedAt: new Date().toISOString()
      });
    }
  };

  // Save Topic
  const handleSaveTopic = () => {
    if (!topicForm.title?.trim()) return;
    const item: Subject = {
      id: editingTopicId || `sub_${Date.now()}`,
      bookId: selectedBookId,
      title: topicForm.title,
      description: topicForm.description || '',
      iconName: topicForm.iconName || 'Layers',
      orderIndex: (subjects.filter(s => s.bookId === selectedBookId).length || 0) + 1,
      isPublished: topicForm.isPublished ?? true
    };
    saveSubject(item);
    setIsTopicModalOpen(false);
    setEditingTopicId(null);
    setTopicForm({ title: '', description: '', iconName: 'Heart', isPublished: true });
  };

  // Save Chapter
  const handleSaveChapter = () => {
    if (!chapterForm.title?.trim()) return;
    const selectedSub = subjects.find(s => s.bookId === selectedBookId) || subjects[0];
    const item: Chapter = {
      id: editingChapterId || `chap_${Date.now()}`,
      bookId: selectedBookId,
      subjectId: chapterForm.subjectId || selectedSub?.id || 'sub_med_cardio',
      title: chapterForm.title,
      description: chapterForm.description || '',
      orderIndex: (chapters.filter(c => c.bookId === selectedBookId).length || 0) + 1,
      estimatedMinutes: chapterForm.estimatedMinutes || 20,
      isPublished: chapterForm.isPublished ?? true,
      createdAt: new Date().toISOString()
    };
    saveChapter(item);
    setIsChapterModalOpen(false);
    setEditingChapterId(null);
    setChapterForm({ title: '', description: '', estimatedMinutes: 20, isPublished: true });
  };

  // Save MCQ
  const handleSaveMCQ = () => {
    if (!mcqForm.question?.trim()) return;
    const item: MCQ = {
      id: editingMCQId || `mcq_${Date.now()}`,
      chapterId: selectedChapterId,
      question: mcqForm.question,
      options: (mcqForm.options || ['', '', '', '']) as [string, string, string, string],
      correctIndex: mcqForm.correctIndex ?? 0,
      explanation: mcqForm.explanation || 'Evidence-based rationale.',
      difficulty: mcqForm.difficulty || 'Medium',
      isClinicalCase: Boolean(mcqForm.isClinicalCase),
      clinicalCase: mcqForm.isClinicalCase ? mcqForm.clinicalCase : undefined,
      orderIndex: dbService.getMCQsByChapter(selectedChapterId).length + 1
    };
    saveMCQ(item);
    setIsMCQModalOpen(false);
    setEditingMCQId(null);
  };

  // Save Study Material
  const handleSaveStudyMaterial = () => {
    saveStudyMaterial(studyMatEditor);
    alert('Study material saved successfully!');
  };

  // Add Mind Node
  const handleAddMindNode = () => {
    if (!newMindNodeText.trim() || !newMindNodeParentId) return;
    const res = dbService.addMindMapNode(
      selectedChapterId,
      newMindNodeParentId,
      newMindNodeText,
      newMindNodeType,
      newMindNodeNotes
    );
    if (res) {
      saveMindMap(res);
      setNewMindNodeText('');
      setNewMindNodeNotes('');
    }
  };

  // Handle CSV Bulk Import
  const handleProcessCsv = () => {
    if (!bulkCsvText.trim()) return;
    try {
      const lines = bulkCsvText.trim().split('\n');
      const parsed: Partial<MCQ>[] = [];

      lines.forEach((line, idx) => {
        if (idx === 0 && line.toLowerCase().includes('question')) return; // skip header
        const parts = line.split('|').map(s => s.trim());
        if (parts.length >= 7) {
          // format: Question | OptionA | OptionB | OptionC | OptionD | CorrectIndex(0-3) | Explanation | Difficulty
          const q = parts[0];
          const opts: [string, string, string, string] = [parts[1], parts[2], parts[3], parts[4]];
          const correct = parseInt(parts[5], 10) || 0;
          const expl = parts[6];
          const diff = (parts[7] as 'Easy' | 'Medium' | 'Hard') || 'Medium';

          parsed.push({
            question: q,
            options: opts,
            correctIndex: correct,
            explanation: expl,
            difficulty: diff,
            isClinicalCase: false
          });
        }
      });

      if (parsed.length > 0) {
        const count = bulkImportMCQs(selectedChapterId, parsed);
        setCsvFeedback(`Successfully bulk-imported ${count} MCQs!`);
        setBulkCsvText('');
      } else {
        setCsvFeedback('Error: Could not parse CSV rows. Ensure pipe | delimiter format.');
      }
    } catch {
      setCsvFeedback('Failed to parse CSV format.');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white p-6 shadow-md border border-amber-900/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Full CMS Administrative Suite</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Curriculum Control Center
            </h2>
            <p className="text-xs text-slate-300">
              Manage textbooks, dynamic topics, chapters, study notes, MCQs, and concept mind maps without writing code.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreviewChapter(selectedChapterId)}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-sky-600" />
              <span>Preview Student View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Workflow Stepper Banner */}
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-xs">
        <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Curriculum Workflow:</span>
        </span>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-500">
          <button
            onClick={() => setActiveTab('topics')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-900 transition-colors cursor-pointer"
          >
            1. Select Book
          </button>
          <span>→</span>
          <button
            onClick={() => setActiveTab('topics')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-900 transition-colors cursor-pointer"
          >
            2. Choose Section (20 Divisions)
          </button>
          <span>→</span>
          <button
            onClick={() => setActiveTab('chapters')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-900 transition-colors cursor-pointer"
          >
            3. Select / Create Chapter
          </button>
          <span>→</span>
          <button
            onClick={() => setActiveTab('studymat')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-900 transition-colors cursor-pointer"
          >
            4. Edit Study Notes / MCQs
          </button>
          <span>→</span>
          <button
            onClick={() => onPreviewChapter(selectedChapterId)}
            className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold transition-colors cursor-pointer"
          >
            5. Preview Student View
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { key: 'overview', label: 'Dashboard Stats', icon: TrendingUp },
          { key: 'topics', label: 'Topics Manager (20 Sections)', icon: Layers },
          { key: 'chapters', label: 'Chapters & Publishing', icon: FileText },
          { key: 'studymat', label: 'Study Notes Editor', icon: Edit3 },
          { key: 'mcqs', label: 'MCQs & Bulk Import', icon: Award },
          { key: 'mindmap', label: 'Mind Map Editor', icon: Brain },
          { key: 'importer', label: 'Authorized Content Importer', icon: Upload },
          { key: 'students', label: 'Student Directory', icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as AdminTab)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-b-2 border-amber-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>


      {/* ================= TAB 1: OVERVIEW STATS ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Enrolled</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalStudents}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">Active Learners</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Textbooks</span>
              <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
                {totalBooks}
              </div>
              <span className="text-[10px] text-slate-400">Medicine, Gyn, Obs</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Clinical Topics</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {totalTopics}
              </div>
              <span className="text-[10px] text-slate-400">Dynamic Sub-Specialties</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Chapters</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {totalChapters}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">Published Curricula</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Question Bank (MCQs)</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {totalMCQs}
              </div>
              <span className="text-[10px] text-slate-400">Cases & Standard</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Interactive Mind Maps</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {totalMindMaps}
              </div>
              <span className="text-[10px] text-slate-400">Structured Node Graphs</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Test Submissions</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalAttempts}
              </div>
              <span className="text-[10px] text-slate-400">Evaluation Records</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Average Class Score</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {avgScore}%
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">Standard of Excellence</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TOPICS MANAGER ================= */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Select Textbook:</span>
              <select
                value={selectedBookId}
                onChange={e => setSelectedBookId(e.target.value)}
                className="text-xs font-bold p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {books.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.edition})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingTopicId(null);
                setTopicForm({ title: '', description: '', iconName: 'Layers', isPublished: true });
                setIsTopicModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Topic</span>
            </button>
          </div>

          <div className="space-y-2">
            {subjects
              .filter(s => s.bookId === selectedBookId)
              .map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {sub.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {sub.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingTopicId(sub.id);
                        setTopicForm(sub);
                        setIsTopicModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-sky-600"
                      title="Edit Topic"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete topic "${sub.title}"?`)) {
                          deleteSubject(sub.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-600"
                      title="Delete Topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Topic Modal */}
          {isTopicModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingTopicId ? 'Edit Topic' : 'Add New Topic'}
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Topic Title</label>
                    <input
                      type="text"
                      value={topicForm.title || ''}
                      onChange={e => setTopicForm({ ...topicForm, title: e.target.value })}
                      placeholder="e.g. Pediatric Cardiology"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                    <textarea
                      value={topicForm.description || ''}
                      onChange={e => setTopicForm({ ...topicForm, description: e.target.value })}
                      placeholder="Clinical scope and subject summary..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white h-20"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsTopicModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTopic}
                    className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                  >
                    Save Topic
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: CHAPTERS & PUBLISHING ================= */}
      {activeTab === 'chapters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500">
              Manage chapters and toggling live publication status
            </span>
            <button
              onClick={() => {
                setEditingChapterId(null);
                setChapterForm({ title: '', description: '', estimatedMinutes: 20, isPublished: true });
                setIsChapterModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Chapter</span>
            </button>
          </div>

          <div className="space-y-2">
            {chapters.map(chap => {
              const book = books.find(b => b.id === chap.bookId);
              return (
                <div
                  key={chap.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        {book?.shortCode}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        chap.isPublished
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {chap.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {chap.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {chap.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => togglePublishChapter(chap.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        chap.isPublished
                          ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {chap.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingChapterId(chap.id);
                        setChapterForm(chap);
                        setIsChapterModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-sky-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete chapter "${chap.title}"?`)) {
                          deleteChapter(chap.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chapter Modal */}
          {isChapterModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingChapterId ? 'Edit Chapter Metadata' : 'Create New Chapter'}
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Chapter Title</label>
                    <input
                      type="text"
                      value={chapterForm.title || ''}
                      onChange={e => setChapterForm({ ...chapterForm, title: e.target.value })}
                      placeholder="e.g. Acute Pancreatitis & Ranson Criteria"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Clinical Description</label>
                    <textarea
                      value={chapterForm.description || ''}
                      onChange={e => setChapterForm({ ...chapterForm, description: e.target.value })}
                      placeholder="Key pathophysiology, clinical presentation and therapeutics..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white h-20"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Estimated Read Time (minutes)</label>
                    <input
                      type="number"
                      value={chapterForm.estimatedMinutes || 20}
                      onChange={e => setChapterForm({ ...chapterForm, estimatedMinutes: parseInt(e.target.value, 10) || 15 })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsChapterModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChapter}
                    className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                  >
                    Save Chapter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: STUDY MATERIAL RICH EDITOR ================= */}
      {activeTab === 'studymat' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Target Chapter:</span>
              <select
                value={selectedChapterId}
                onChange={e => handleSelectChapter(e.target.value)}
                className="text-xs font-bold p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {chapters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSaveStudyMaterial}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Study Notes</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Executive Overview / Abstract
              </label>
              <textarea
                value={studyMatEditor.overview || ''}
                onChange={e => setStudyMatEditor({ ...studyMatEditor, overview: e.target.value })}
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white h-24"
              />
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Sections & Text Paragraphs ({studyMatEditor.sections.length})
                </h4>
                <button
                  onClick={() => {
                    const newSec = {
                      id: `sec_${Date.now()}`,
                      heading: 'New Clinical Subsection',
                      content: 'Enter section content details...'
                    };
                    setStudyMatEditor({
                      ...studyMatEditor,
                      sections: [...studyMatEditor.sections, newSec]
                    });
                  }}
                  className="px-3 py-1 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              {studyMatEditor.sections.map((sec, idx) => (
                <div key={sec.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={sec.heading}
                      onChange={e => {
                        const updated = [...studyMatEditor.sections];
                        updated[idx].heading = e.target.value;
                        setStudyMatEditor({ ...studyMatEditor, sections: updated });
                      }}
                      className="font-bold text-sm bg-transparent border-b border-slate-300 dark:border-slate-600 w-full max-w-md pb-0.5 focus:outline-hidden"
                    />
                    <button
                      onClick={() => {
                        const updated = studyMatEditor.sections.filter((_, i) => i !== idx);
                        setStudyMatEditor({ ...studyMatEditor, sections: updated });
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    value={sec.content}
                    onChange={e => {
                      const updated = [...studyMatEditor.sections];
                      updated[idx].content = e.target.value;
                      setStudyMatEditor({ ...studyMatEditor, sections: updated });
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 h-28"
                  />
                </div>
              ))}
            </div>

            {/* Clinical Pearls */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-sky-600" />
                  Clinical Pearls & Warning Boxes ({studyMatEditor.clinicalPearls.length})
                </h4>
                <button
                  onClick={() => {
                    const newPearl = {
                      id: `cp_${Date.now()}`,
                      title: 'Clinical Pearl',
                      content: 'Highlight clinical rule or diagnostic pitfall.',
                      type: 'pearl' as const
                    };
                    setStudyMatEditor({
                      ...studyMatEditor,
                      clinicalPearls: [...studyMatEditor.clinicalPearls, newPearl]
                    });
                  }}
                  className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Pearl</span>
                </button>
              </div>

              {studyMatEditor.clinicalPearls.map((p, idx) => (
                <div key={p.id || idx} className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={p.title}
                      onChange={e => {
                        const updated = [...studyMatEditor.clinicalPearls];
                        updated[idx].title = e.target.value;
                        setStudyMatEditor({ ...studyMatEditor, clinicalPearls: updated });
                      }}
                      className="font-bold text-xs bg-transparent border-b border-amber-300 dark:border-amber-700 pb-0.5 focus:outline-hidden w-full max-w-sm"
                    />
                    <select
                      value={p.type}
                      onChange={e => {
                        const updated = [...studyMatEditor.clinicalPearls];
                        updated[idx].type = e.target.value as any;
                        setStudyMatEditor({ ...studyMatEditor, clinicalPearls: updated });
                      }}
                      className="text-[10px] font-bold p-1 rounded-md bg-white dark:bg-slate-800"
                    >
                      <option value="pearl">Pearl</option>
                      <option value="warning">Warning</option>
                      <option value="high_yield">High-Yield</option>
                      <option value="mnemonic">Mnemonic</option>
                    </select>
                  </div>
                  <textarea
                    value={p.content}
                    onChange={e => {
                      const updated = [...studyMatEditor.clinicalPearls];
                      updated[idx].content = e.target.value;
                      setStudyMatEditor({ ...studyMatEditor, clinicalPearls: updated });
                    }}
                    className="w-full p-2.5 rounded-xl border border-amber-200 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 h-16"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: MCQS & BULK CSV IMPORT ================= */}
      {activeTab === 'mcqs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Chapter:</span>
              <select
                value={selectedChapterId}
                onChange={e => handleSelectChapter(e.target.value)}
                className="text-xs font-bold p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {chapters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingMCQId(null);
                setMcqForm({
                  question: '',
                  options: ['', '', '', ''],
                  correctIndex: 0,
                  explanation: '',
                  difficulty: 'Medium',
                  isClinicalCase: false
                });
                setIsMCQModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create MCQ Question</span>
            </button>
          </div>

          {/* Bulk CSV Upload Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-sky-600" /> Bulk CSV / Delimited MCQ Import
              </span>
              <button
                onClick={() => {
                  setBulkCsvText(
                    `Question|Option A|Option B|Option C|Option D|CorrectIndex(0-3)|Explanation|Difficulty\nWhat is the diagnostic sign of Appendicitis?|Murphy sign|McBurney point tenderness|Cullen sign|Grey Turner sign|1|McBurney point localized rebound tenderness indicates acute appendiceal inflammation.|Easy`
                  );
                }}
                className="text-sky-600 text-xs font-bold hover:underline"
              >
                Load Sample Template
              </button>
            </div>

            <textarea
              value={bulkCsvText}
              onChange={e => setBulkCsvText(e.target.value)}
              placeholder="Paste pipe-delimited (|) MCQ rows here..."
              className="w-full p-3 font-mono text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 h-24"
            />

            <div className="flex items-center justify-between">
              {csvFeedback && <span className="text-xs font-bold text-sky-600">{csvFeedback}</span>}
              <button
                onClick={handleProcessCsv}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold ml-auto cursor-pointer"
              >
                Import MCQs into Chapter
              </button>
            </div>
          </div>

          {/* Existing Chapter MCQs List */}
          <div className="space-y-2">
            {dbService.getMCQsByChapter(selectedChapterId).map((q, idx) => (
              <div
                key={q.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-sky-600">Q{idx + 1}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {q.difficulty}
                    </span>
                    {q.isClinicalCase && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        Case Vignette
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingMCQId(q.id);
                        setMcqForm(q);
                        setIsMCQModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-sky-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMCQ(q.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {q.question}
                </p>

                <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-1.5 rounded-lg border text-[11px] ${
                        oIdx === q.correctIndex
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-800 dark:text-emerald-200'
                          : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      {['A', 'B', 'C', 'D'][oIdx]}. {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* MCQ Modal */}
          {isMCQModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl my-8">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingMCQId ? 'Edit MCQ' : 'Create Clinical MCQ'}
                </h3>
                <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Question Stem
                    </label>
                    <textarea
                      value={mcqForm.question || ''}
                      onChange={e => setMcqForm({ ...mcqForm, question: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-20"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={Boolean(mcqForm.isClinicalCase)}
                        onChange={e => setMcqForm({ ...mcqForm, isClinicalCase: e.target.checked })}
                      />
                      <span>Clinical Case-Based Vignette</span>
                    </label>

                    <select
                      value={mcqForm.difficulty || 'Medium'}
                      onChange={e => setMcqForm({ ...mcqForm, difficulty: e.target.value as any })}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ml-auto"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  {/* 4 Options */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Options & Select Correct Answer
                    </label>
                    {[0, 1, 2, 3].map(optIdx => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOpt"
                          checked={mcqForm.correctIndex === optIdx}
                          onChange={() => setMcqForm({ ...mcqForm, correctIndex: optIdx })}
                        />
                        <span className="font-bold">{['A', 'B', 'C', 'D'][optIdx]}</span>
                        <input
                          type="text"
                          value={mcqForm.options?.[optIdx] || ''}
                          onChange={e => {
                            const newOpts = [...(mcqForm.options || ['', '', '', ''])];
                            newOpts[optIdx] = e.target.value;
                            setMcqForm({ ...mcqForm, options: newOpts as any });
                          }}
                          placeholder={`Option ${['A', 'B', 'C', 'D'][optIdx]}`}
                          className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Detailed Medical Explanation & Rationale
                    </label>
                    <textarea
                      value={mcqForm.explanation || ''}
                      onChange={e => setMcqForm({ ...mcqForm, explanation: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setIsMCQModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveMCQ}
                    className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                  >
                    Save MCQ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 6: MIND MAP ADMIN EDITOR ================= */}
      {activeTab === 'mindmap' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Target Chapter:</span>
              <select
                value={selectedChapterId}
                onChange={e => handleSelectChapter(e.target.value)}
                className="text-xs font-bold p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {chapters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeChapterMindMap ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Add Node Form */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-sky-600" /> Add Node to Mind Map Tree
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Parent Concept Node
                    </label>
                    <select
                      value={newMindNodeParentId}
                      onChange={e => setNewMindNodeParentId(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="">Select Parent Concept...</option>
                      {activeChapterMindMap.nodes.map(n => (
                        <option key={n.id} value={n.id}>
                          {n.text} ({n.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Concept Node Label
                    </label>
                    <input
                      type="text"
                      value={newMindNodeText}
                      onChange={e => setNewMindNodeText(e.target.value)}
                      placeholder="e.g. Troponin Elevation Curve"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Clinical Category
                    </label>
                    <select
                      value={newMindNodeType}
                      onChange={e => setNewMindNodeType(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="etiology">Etiology & Triggers</option>
                      <option value="pathophysiology">Pathophysiology</option>
                      <option value="clinical">Clinical Signs</option>
                      <option value="investigations">Diagnostic Tests</option>
                      <option value="management">Management Protocol</option>
                      <option value="pearl">Clinical Pearl / Red Flag</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Detailed Medical Notes
                    </label>
                    <textarea
                      value={newMindNodeNotes}
                      onChange={e => setNewMindNodeNotes(e.target.value)}
                      placeholder="Clinical details shown on node click..."
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-16"
                    />
                  </div>

                  <button
                    onClick={handleAddMindNode}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold cursor-pointer"
                  >
                    Add Concept Node
                  </button>
                </div>
              </div>

              {/* Node Hierarchy List */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Concept Hierarchy Tree ({activeChapterMindMap.nodes.length} Nodes)
                </h4>
                <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                  {activeChapterMindMap.nodes.map(node => (
                    <div
                      key={node.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs border border-slate-100 dark:border-slate-800"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {node.text}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-2">
                          ({node.type})
                        </span>
                      </div>

                      {node.id !== activeChapterMindMap.rootNodeId && (
                        <button
                          onClick={() => {
                            const res = dbService.deleteMindMapNode(selectedChapterId, node.id);
                            if (res) saveMindMap(res);
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs text-slate-500">No Mind Map found for this chapter.</p>
              <button
                onClick={() => {
                  const rootId = `node_root_${Date.now()}`;
                  const newMap: MindMap = {
                    id: `mm_${selectedChapterId}`,
                    chapterId: selectedChapterId,
                    title: `${chapters.find(c => c.id === selectedChapterId)?.title} Clinical Map`,
                    rootNodeId: rootId,
                    nodes: [
                      { id: rootId, text: chapters.find(c => c.id === selectedChapterId)?.title || 'Core Topic', type: 'root' },
                      { id: `node_p_${Date.now()}`, parentId: rootId, text: 'Pathophysiology', type: 'pathophysiology' },
                      { id: `node_c_${Date.now()}`, parentId: rootId, text: 'Clinical Features', type: 'clinical' },
                      { id: `node_m_${Date.now()}`, parentId: rootId, text: 'Management Protocol', type: 'management' }
                    ],
                    edges: [],
                    updatedAt: new Date().toISOString()
                  };
                  saveMindMap(newMap);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
              >
                Initialize Concept Map for Chapter
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB: AUTHORIZED CONTENT IMPORTER ================= */}
      {activeTab === 'importer' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Copyright & Compliance Banner */}
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wide">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Textbook Copyright & CMS Ingestion Compliance</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Reference Source:</strong> <em>Manipal Prep Manual of Medicine – Third Edition</em> by <strong>Manthappa M.</strong> (CBS Publishers & Distributors).
              In strict adherence to copyright regulations, the application does not scrape or reproduce full copyrighted textbook text.
              This CMS module enables authorized faculty and license holders to enter, update, or import legally authorized clinical study materials, MCQs, and mind maps across all <strong>20 clinical sections</strong> without altering application source code.
            </p>
          </div>

          {/* Section & Chapter Destination Picker */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <label className="font-bold text-[11px] text-slate-500 uppercase block mb-1">
                1. Target Textbook:
              </label>
              <select
                value={selectedBookId}
                onChange={e => {
                  setSelectedBookId(e.target.value);
                  const matchingSub = subjects.find(s => s.bookId === e.target.value);
                  if (matchingSub) setSelectedSubjectId(matchingSub.id);
                }}
                className="w-full text-xs font-bold p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {books.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.edition})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[11px] text-slate-500 uppercase block mb-1">
                2. Clinical Section (All 20 Available):
              </label>
              <select
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                className="w-full text-xs font-bold p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white truncate"
              >
                {subjects
                  .filter(s => s.bookId === selectedBookId)
                  .map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[11px] text-slate-500 uppercase block mb-1">
                3. Existing Chapter (or Create New):
              </label>
              <select
                value={selectedChapterId}
                onChange={e => handleSelectChapter(e.target.value)}
                className="w-full text-xs font-bold p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white truncate"
              >
                {chapters
                  .filter(c => c.bookId === selectedBookId)
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Authorized Chapter Ingestion Form */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-sky-600" />
                  <span>Authorized Chapter & MCQ Ingestion Pipeline</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Paste structured chapter JSON or use the sample template to populate study notes, pearls, and MCQs.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const sample = {
                      chapterTitle: 'Tropical Fevers & Enteric Fever (Typhoid)',
                      description: 'Salmonella enterica serotype Typhi pathophysiology, Widal test vs blood culture, and ceftriaxone / azithromycin protocols.',
                      estimatedMinutes: 20,
                      overview: 'Enteric fever is a systemic bacteremic illness caused by Salmonella enterica serovars Typhi and Paratyphi A, B, and C.',
                      sections: [
                        {
                          heading: 'Pathogenesis & Step-Ladder Fever',
                          content: 'Ingestion of contaminated food or water leads to penetration of intestinal mucosa via M cells overlying Peyer patches. Bacteria multiply intracellularly in reticuloendothelial macrophages before re-entering the bloodstream.'
                        },
                        {
                          heading: 'Diagnostic Criteria & Culture Timelines',
                          content: 'Blood culture has highest diagnostic yield (80%) during Week 1. Widal test measures agglutinating antibodies against O and H antigens (significant titer: TO > 1:160, TH > 1:160). Stool culture yields positive results in Week 2-3.'
                        }
                      ],
                      clinicalPearls: [
                        {
                          title: 'Faget Sign (Relative Bradycardia)',
                          content: 'Sphygmo-thermic dissociation where pulse rate does not rise proportionately with high fever (characteristic of Typhoid, Yellow fever, Legionella).',
                          type: 'high_yield'
                        }
                      ],
                      mcqs: [
                        {
                          question: 'In a patient suspected of having Enteric (Typhoid) fever in the first week of illness, which investigation has the highest sensitivity for microbiological confirmation?',
                          options: [
                            'Widal serological agglutination test',
                            'Blood culture in bile broth',
                            'Stool examination for ova and cysts',
                            'Urine culture'
                          ],
                          correctIndex: 1,
                          explanation: 'Blood culture has highest diagnostic yield (80-90%) during the first week of enteric fever, before significant antibody titers develop.',
                          difficulty: 'Easy'
                        }
                      ]
                    };
                    setImportJsonText(JSON.stringify(sample, null, 2));
                    setImportStatus('Loaded sample authorized chapter template! Click "Ingest Chapter" to save.');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-sky-300 dark:border-sky-800 text-sky-600 dark:text-sky-300 text-xs font-bold hover:bg-sky-50 dark:hover:bg-sky-950 transition-colors cursor-pointer"
                >
                  Load Template
                </button>

                <button
                  onClick={() => {
                    const allData = {
                      books: dbService.getBooks(),
                      subjects: dbService.getAllSubjects(),
                      chapters: dbService.getAllChapters(),
                      studyMaterials: dbService.getBooks().map(b => b.id),
                      exportedAt: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `medical_hub_curriculum_backup_${Date.now()}.json`;
                    a.click();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Backup</span>
                </button>
              </div>
            </div>

            <textarea
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder="Paste authorized chapter JSON here with sections, clinical pearls, and MCQs..."
              className="w-full p-4 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 h-64 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />

            {importStatus && (
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-bold text-sky-800 dark:text-sky-200">
                {importStatus}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Target Section: <strong>{subjects.find(s => s.id === selectedSubjectId)?.title}</strong>
              </span>

              <button
                onClick={() => {
                  if (!importJsonText.trim()) return;
                  try {
                    const parsed = JSON.parse(importJsonText);
                    const chapId = `chap_${Date.now()}`;

                    // 1. Create chapter
                    const newChap: Chapter = {
                      id: chapId,
                      bookId: selectedBookId,
                      subjectId: selectedSubjectId,
                      title: parsed.chapterTitle || 'New Authorized Chapter',
                      description: parsed.description || '',
                      estimatedMinutes: parsed.estimatedMinutes || 20,
                      orderIndex: chapters.length + 1,
                      isPublished: true,
                      createdAt: new Date().toISOString()
                    };
                    saveChapter(newChap);

                    // 2. Create study material
                    if (parsed.sections || parsed.overview) {
                      const newMat: StudyMaterial = {
                        id: `mat_${chapId}`,
                        chapterId: chapId,
                        overview: parsed.overview || '',
                        sections: parsed.sections || [],
                        clinicalPearls: parsed.clinicalPearls || [],
                        tables: parsed.tables || [],
                        references: parsed.references || [
                          'Manipal Prep Manual of Medicine, Third Edition by Manthappa M.'
                        ],
                        updatedAt: new Date().toISOString()
                      };
                      saveStudyMaterial(newMat);
                    }

                    // 3. Create MCQs if any
                    if (parsed.mcqs && Array.isArray(parsed.mcqs)) {
                      bulkImportMCQs(chapId, parsed.mcqs);
                    }

                    setSelectedChapterId(chapId);
                    setImportStatus(`Successfully ingested "${newChap.title}" into database with live publishing!`);
                    refreshData();
                  } catch (err: any) {
                    setImportStatus(`JSON Parse Error: ${err.message || 'Invalid JSON format'}`);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Ingest & Publish Chapter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: STUDENT DIRECTORY ================= */}

      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Directory & Assessment Audit Log
            </h4>
            <p className="text-xs text-slate-500">
              Review registered students and track test attempts across the curriculum.
            </p>
          </div>

          <div className="space-y-2">
            {allUsers.map(user => {
              const attempts = attemptsList.filter(a => a.userId === user.id);
              const avg = attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b.score, 0) / attempts.length) : 0;

              return (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80&auto=format&fit=crop&q=80'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {user.name}
                        </h5>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {user.email} • {user.collegeOrHospital}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium self-end sm:self-center">
                    <div className="text-right">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {attempts.length} Tests
                      </span>
                      <div className="text-[10px] text-slate-500">
                        Avg: {avg}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
