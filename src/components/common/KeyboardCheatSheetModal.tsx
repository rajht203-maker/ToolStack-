import React, { useState, useEffect } from 'react';
import { 
  Keyboard, 
  X, 
  Search, 
  HelpCircle, 
  Command, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  Moon, 
  Sun, 
  Heart, 
  Home, 
  Layers, 
  Zap, 
  Trash2, 
  FileCheck,
  Check
} from 'lucide-react';

interface KeyboardCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
  onToggleDarkMode?: () => void;
}

interface ShortcutItem {
  id: string;
  category: 'global' | 'navigation' | 'tools' | 'pdf';
  keys: string[];
  description: string;
  badge?: string;
  action?: () => void;
}

export const KeyboardCheatSheetModal: React.FC<KeyboardCheatSheetModalProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onToggleDarkMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'global' | 'navigation' | 'tools' | 'pdf'>('all');
  const [lastPressedKeys, setLastPressedKeys] = useState<string[]>([]);
  const [hasCopiedHint, setHasCopiedHint] = useState(false);

  const isMac = typeof window !== 'undefined' && navigator.platform?.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts: ShortcutItem[] = [
    // Global & Search
    {
      id: 'search',
      category: 'global',
      keys: [modKey, 'K'],
      description: 'Open quick tool search dialog',
      badge: 'Popular',
      action: onOpenSearch
    },
    {
      id: 'slash-search',
      category: 'global',
      keys: ['/'],
      description: 'Quick focus search input (when not typing)',
      action: onOpenSearch
    },
    {
      id: 'help',
      category: 'global',
      keys: ['?'],
      description: 'Show / hide this Keyboard Shortcuts Cheat Sheet',
      badge: 'You are here'
    },
    {
      id: 'help-alt',
      category: 'global',
      keys: [modKey, '/'],
      description: 'Alternative shortcut for Keyboard Shortcuts modal'
    },
    {
      id: 'close',
      category: 'global',
      keys: ['Esc'],
      description: 'Close active modal, search palette, or flyout drawer',
      badge: 'Essential',
      action: onClose
    },

    // Navigation & View
    {
      id: 'home',
      category: 'navigation',
      keys: ['Alt', 'H'],
      description: 'Navigate to Home / All Tools view'
    },
    {
      id: 'favorites',
      category: 'navigation',
      keys: ['Alt', 'F'],
      description: 'Toggle Favorites & History sidebar drawer'
    },
    {
      id: 'theme',
      category: 'navigation',
      keys: ['Alt', 'T'],
      description: 'Toggle Light / Dark mode theme',
      action: onToggleDarkMode
    },
    {
      id: 'custom-theme',
      category: 'navigation',
      keys: ['Alt', 'P'],
      description: 'Open Custom Tools Theme designer palette',
      badge: 'New'
    },
    {
      id: 'sidebar',
      category: 'navigation',
      keys: ['Alt', 'B'],
      description: 'Expand or collapse navigation sidebar'
    },

    // Tool Actions
    {
      id: 'execute-tool',
      category: 'tools',
      keys: [modKey, 'Enter'],
      description: 'Execute or process active tool action'
    },
    {
      id: 'reset-tool',
      category: 'tools',
      keys: ['Alt', 'R'],
      description: 'Reset inputs or clear active workspace'
    },
    {
      id: 'copy-output',
      category: 'tools',
      keys: [modKey, 'C'],
      description: 'Copy selected tool result to clipboard'
    },

    // PDF Multi-Page Tools
    {
      id: 'pdf-range-delete',
      category: 'pdf',
      keys: ['Range: 1-5, 8'],
      description: 'Delete more than 2 pages in bulk using ranges',
      badge: 'Updated'
    },
    {
      id: 'pdf-gt2-preset',
      category: 'pdf',
      keys: ['Preset: > 2'],
      description: 'One-click delete all pages after page 2 (retain cover & summary)',
      badge: 'New Preset'
    },
    {
      id: 'pdf-odd-even',
      category: 'pdf',
      keys: ['Even / Odd'],
      description: 'Select and purge all even or odd scanned pages in 1 click'
    },
    {
      id: 'pdf-tile-click',
      category: 'pdf',
      keys: ['Click Page Tile'],
      description: 'Click any visual page thumbnail/badge to toggle page deletion'
    }
  ];

  // Capture user key presses live to display interactive feedback
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keys: string[] = [];
      if (e.metaKey) keys.push('⌘');
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.altKey) keys.push('Alt');
      if (e.shiftKey) keys.push('Shift');

      const keyName = e.key === ' ' ? 'Space' : e.key;
      if (!['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) {
        keys.push(keyName.toUpperCase());
      }

      if (keys.length > 0) {
        setLastPressedKeys(keys);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredShortcuts = shortcuts.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCat;

    const matchesText = 
      item.description.toLowerCase().includes(query) ||
      item.keys.some(k => k.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query) ||
      (item.badge && item.badge.toLowerCase().includes(query));

    return matchesCat && matchesText;
  });

  const categories = [
    { id: 'all', label: 'All Shortcuts' },
    { id: 'global', label: 'Global & Search' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'tools', label: 'Tool Actions' },
    { id: 'pdf', label: 'PDF Multi-Page' }
  ];

  return (
    <div 
      id="keyboard-cheat-sheet-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cheat-sheet-title"
    >
      {/* Backdrop click to close */}
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="cheat-sheet-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Keyboard Shortcuts Cheat Sheet
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                  Quick Guide
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Press <kbd className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">?</kbd> anywhere to open, or <kbd className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">Esc</kbd> to close.
              </p>
            </div>
          </div>

          <button
            id="close-cheat-sheet-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close (Esc)"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar & live key tester */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search filter */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter shortcuts (e.g. search, pdf, esc, theme)..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Key Detection Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px] shrink-0">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Live key press:</span>
              {lastPressedKeys.length > 0 ? (
                <div className="flex items-center gap-1">
                  {lastPressedKeys.map((k, idx) => (
                    <kbd 
                      key={idx}
                      className="px-1.5 py-0.5 rounded-md bg-indigo-600 text-white font-mono font-bold text-[10px] shadow-2xs"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic font-mono text-[10px]">press any key</span>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800/80 space-y-1">
          {filteredShortcuts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                No keyboard shortcuts found matching &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredShortcuts.map((item) => (
              <div 
                key={item.id}
                className="pt-3 first:pt-0 pb-3 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 group-hover:bg-indigo-500 transition-colors shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {item.description}
                    </div>
                    {item.badge && (
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-200/50 dark:border-indigo-800/50">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Keycaps */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.keys.map((key, kIdx) => (
                    <React.Fragment key={kIdx}>
                      {kIdx > 0 && <span className="text-slate-300 dark:text-slate-600 text-xs font-bold">+</span>}
                      <kbd className="min-w-[24px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold text-center border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:border-indigo-300 dark:group-hover:border-indigo-700 transition-colors">
                        {key}
                      </kbd>
                    </React.Fragment>
                  ))}
                  {item.action && (
                    <button
                      onClick={() => {
                        item.action?.();
                        onClose();
                      }}
                      className="ml-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline hidden sm:inline"
                    >
                      Try now
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info & quick tips */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>
              <strong>Pro-tip:</strong> When deleting more than 2 PDF pages, type ranges like <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono font-bold">1-4, 7</code> or click the page tiles.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const text = shortcuts.map(s => `${s.keys.join(' + ')} : ${s.description}`).join('\n');
                navigator.clipboard.writeText(text);
                setHasCopiedHint(true);
                setTimeout(() => setHasCopiedHint(false), 2000);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition-colors"
            >
              {hasCopiedHint ? 'Copied to Clipboard!' : 'Copy Shortcut List'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Got it (Esc)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
