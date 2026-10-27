import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  BookOpen,
  Award,
  Brain,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { dbService } from '../../services/db';
import { GlobalSearchResult } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToResult: (result: GlobalSearchResult) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToResult
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const hits = dbService.searchAll(query);
      setResults(hits);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const typeIcons: Record<string, React.ElementType> = {
    book: BookOpen,
    subject: Layers,
    chapter: BookOpen,
    studyMaterial: Sparkles,
    mcq: Award,
    mindMap: Brain
  };

  const typeBadges: Record<string, string> = {
    book: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    subject: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    chapter: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    studyMaterial: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    mcq: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    mindMap: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search books, topics, chapters, clinical pearls, MCQs..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full text-sm font-medium bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 divide-y divide-slate-100 dark:divide-slate-800/80 space-y-2">
          {query.trim().length > 1 && results.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching clinical content found for &quot;{query}&quot;. Try searching for &quot;STEMI&quot;, &quot;Preeclampsia&quot;, &quot;Endometriosis&quot;, or &quot;CURB-65&quot;.
            </div>
          )}

          {query.trim().length <= 1 && (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <p>Type at least 2 characters to search across all textbooks and modules.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {['STEMI', 'Preeclampsia', 'Endometriosis', 'CURB-65', 'PPH', 'Magnesium'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold hover:bg-sky-50 dark:hover:bg-sky-950 hover:text-sky-600"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map(item => {
            const Icon = typeIcons[item.type] || BookOpen;
            const badgeClass = typeBadges[item.type];

            return (
              <div
                key={item.id}
                onClick={() => {
                  onNavigateToResult(item);
                  onClose();
                }}
                className="pt-3 pb-2 flex items-start gap-3 cursor-pointer group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 p-2 rounded-2xl transition-colors"
              >
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${badgeClass}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.breadcrumb}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {item.snippet}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform self-center" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
