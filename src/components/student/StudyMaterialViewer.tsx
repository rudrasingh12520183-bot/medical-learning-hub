import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Sparkles,
  Type,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';
import { StudyMaterial, Chapter } from '../../types';
import { useData } from '../../context/DataContext';

interface StudyMaterialViewerProps {
  chapter: Chapter;
  material?: StudyMaterial;
  onPrevChapter?: () => void;
  onNextChapter?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const StudyMaterialViewer: React.FC<StudyMaterialViewerProps> = ({
  chapter,
  material,
  onPrevChapter,
  onNextChapter,
  hasPrev,
  hasNext
}) => {
  const { markChapterComplete, toggleBookmark, isBookmarked, progressList } = useData();

  // Reader Customization State
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [readerTheme, setReaderTheme] = useState<'default' | 'sepia' | 'dark'>('default');
  const [searchQuery, setSearchQuery] = useState('');

  const isCompleted = Boolean(
    progressList.find(p => p.chapterId === chapter.id)?.isCompleted
  );

  const isMarked = isBookmarked(chapter.id);

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

  // Font size classes
  const fontClasses = {
    sm: 'text-xs leading-relaxed',
    base: 'text-sm leading-relaxed',
    lg: 'text-base leading-relaxed'
  };

  // Reader theme styles
  const themeStyles = {
    default: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#edd8b6]',
    dark: 'bg-slate-950 text-slate-200 border-slate-800'
  };

  // Highlight helper for in-chapter search
  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-500 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Reader Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80">
        {/* Search within chapter */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search within this chapter..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Reader controls */}
        <div className="flex items-center gap-2">
          {/* Font size picker */}
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${fontSize === 'sm' ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400' : ''}`}
              title="Small font"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${fontSize === 'base' ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400' : ''}`}
              title="Standard font"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${fontSize === 'lg' ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400' : ''}`}
              title="Large font"
            >
              A+
            </button>
          </div>

          {/* Theme toggles */}
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setReaderTheme('default')}
              className={`p-1.5 rounded-lg transition-colors ${readerTheme === 'default' ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400' : ''}`}
              title="Standard Light/Dark"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setReaderTheme('sepia')}
              className={`p-1.5 rounded-lg transition-colors ${readerTheme === 'sepia' ? 'bg-amber-100 text-amber-800' : ''}`}
              title="Eye Comfort Sepia"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setReaderTheme('dark')}
              className={`p-1.5 rounded-lg transition-colors ${readerTheme === 'dark' ? 'bg-slate-800 text-sky-400' : ''}`}
              title="OLED Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-xl border transition-colors ${
              isMarked
                ? 'bg-amber-500 border-amber-600 text-white'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500'
            }`}
            title={isMarked ? 'Remove Bookmark' : 'Bookmark Chapter'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Medical Content Canvas */}
      <div className={`p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-8 ${themeStyles[readerTheme]}`}>
        {/* Chapter Header */}
        <div className="space-y-3 pb-6 border-b border-slate-200/60 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Clinical Study Text</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {highlightText(chapter.title)}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
            {highlightText(chapter.description)}
          </p>
        </div>

        {/* Chapter Overview */}
        {material?.overview && (
          <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Executive Clinical Summary
            </h4>
            <p className={fontClasses[fontSize]}>
              {highlightText(material.overview)}
            </p>
          </div>
        )}

        {/* Sections */}
        {material?.sections.map((section, idx) => (
          <div key={section.id || idx} className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 text-xs font-black flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{highlightText(section.heading)}</span>
            </h3>

            <p className={fontClasses[fontSize]}>
              {highlightText(section.content)}
            </p>

            {section.subsections?.map((sub, sIdx) => (
              <div key={sIdx} className="pl-4 border-l-2 border-sky-300 dark:border-sky-700 space-y-1.5 my-3">
                <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  {highlightText(sub.heading)}
                </h4>
                <p className={fontClasses[fontSize]}>
                  {highlightText(sub.content)}
                </p>
              </div>
            ))}
          </div>
        ))}

        {/* Clinical Pearls Callouts */}
        {material?.clinicalPearls && material.clinicalPearls.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              Clinical Pearls & Diagnostic Caveats
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {material.clinicalPearls.map(pearl => {
                const isWarning = pearl.type === 'warning';
                return (
                  <div
                    key={pearl.id}
                    className={`p-4 rounded-2xl border ${
                      isWarning
                        ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50'
                        : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50'
                    } space-y-1.5`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${
                        isWarning ? 'text-rose-700 dark:text-rose-300' : 'text-amber-800 dark:text-amber-300'
                      }`}>
                        {isWarning ? <AlertTriangle className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                        {highlightText(pearl.title)}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60">
                        {pearl.type.replace('_', ' ')}
                      </span>
                    </div>

                    <p className={fontClasses[fontSize]}>
                      {highlightText(pearl.content)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Medical Diagnostic Tables */}
        {material?.tables && material.tables.length > 0 && (
          <div className="space-y-4 pt-4">
            {material.tables.map(table => (
              <div key={table.id} className="space-y-2 overflow-hidden">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {highlightText(table.title)}
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                        {table.headers.map((h, i) => (
                          <th key={i} className="p-3 font-bold text-slate-900 dark:text-white">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* References */}
        {material?.references && material.references.length > 0 && (
          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Evidence-Based References & Guidelines:
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-500">
              {material.references.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Completion Action */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleToggleComplete}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Marked as Completed' : 'Mark as Completed'}</span>
          </button>

          {/* Prev/Next Chapter Navigation */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onPrevChapter}
              disabled={!hasPrev}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                hasPrev
                  ? 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                  : 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Chapter</span>
            </button>

            <button
              onClick={onNextChapter}
              disabled={!hasNext}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                hasNext
                  ? 'bg-sky-600 border-sky-600 text-white hover:bg-sky-700 shadow-sm cursor-pointer'
                  : 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
              }`}
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
