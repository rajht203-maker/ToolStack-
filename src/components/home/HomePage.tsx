import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CATEGORIES, TOOLS_DATA, PLATFORM_STATS } from '../../data/toolsData';
import { ToolItem, CategoryInfo } from '../../types';
import { ToolCard } from '../tools/ToolCard';
import { MultiplexAd } from '../ads/MultiplexAd';
import { InFeedAd } from '../ads/InFeedAd';
import { IconRenderer } from '../common/IconRenderer';
import { ProblemSolverBar } from '../common/ProblemSolverBar';
import { useTheme } from '../../context/ThemeContext';
import { 
  getMostPopularTools, 
  recordToolClick, 
  resetToolClickCounts, 
  TOOL_CLICK_EVENT 
} from '../../utils/toolAnalytics';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Layers, 
  ArrowRight,
  Lock,
  Cpu,
  CheckCircle,
  HelpCircle,
  Compass,
  Palette,
  RotateCcw,
  TrendingUp
} from 'lucide-react';

interface HomePageProps {
  onSelectTool: (tool: ToolItem) => void;
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  onOpenSearch: () => void;
  memberOnlyFilter?: boolean;
  onToggleMemberFilter?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTool,
  selectedCategory,
  onSelectCategory,
  onOpenSearch,
  memberOnlyFilter: externalMemberOnlyFilter,
  onToggleMemberFilter: externalOnToggleMemberFilter
}) => {
  const { activeColors, openThemeModal, themeSettings } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'problem' | 'standard'>('problem');
  const [internalMemberOnlyFilter, setInternalMemberOnlyFilter] = useState(false);
  const [popularityLimit, setPopularityLimit] = useState<number>(8);
  const [clickEventCounter, setClickEventCounter] = useState<number>(0);
  const [resetConfirmToast, setResetConfirmToast] = useState<boolean>(false);

  // Subscribe to live tool click events so popular ranking updates immediately
  useEffect(() => {
    const handleToolClickEvent = () => {
      setClickEventCounter((prev) => prev + 1);
    };
    window.addEventListener(TOOL_CLICK_EVENT, handleToolClickEvent);
    return () => window.removeEventListener(TOOL_CLICK_EVENT, handleToolClickEvent);
  }, []);

  const memberOnlyFilter = externalMemberOnlyFilter !== undefined ? externalMemberOnlyFilter : internalMemberOnlyFilter;
  const setMemberOnlyFilter = (val: boolean) => {
    if (externalOnToggleMemberFilter) {
      if (val !== memberOnlyFilter) {
        externalOnToggleMemberFilter();
      }
    } else {
      setInternalMemberOnlyFilter(val);
    }
  };

  // Rank tools based strictly on click-frequency stored in localStorage
  const popularRankedTools = useMemo(() => {
    return getMostPopularTools(TOOLS_DATA, popularityLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popularityLimit, clickEventCounter]);

  const handleToolSelection = useCallback(
    (tool: ToolItem) => {
      recordToolClick(tool.id);
      onSelectTool(tool);
    },
    [onSelectTool]
  );

  const handleResetPopularity = () => {
    resetToolClickCounts();
    setResetConfirmToast(true);
    setTimeout(() => setResetConfirmToast(false), 2500);
  };

  // Filter tools
  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      if (memberOnlyFilter && !tool.requiresAuth) return false;
      const matchesCat = !selectedCategory || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some(t => t.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery, memberOnlyFilter]);

  // Trending / popular tools for hero strip
  const trendingTools = useMemo(() => {
    return TOOLS_DATA.filter(t => t.trending || t.popular).slice(0, 4);
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section with Problem Solver Bar */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-8 text-center px-4">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{TOOLS_DATA.length}+ Working Utilities • Local In-Browser Processing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-tight text-slate-900 dark:text-white">
            Define your problem.<br />
            <span className="text-indigo-600 dark:text-indigo-400">We find the exact tool.</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            {TOOLS_DATA.length}+ high-traffic everyday utilities, developer tools, and members-only PDF & Image suites. Simply describe what you need to solve or search directly.
          </p>

          {/* Search Mode Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setSearchMode('problem')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                searchMode === 'problem'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Problem Solver Search</span>
            </button>
            <button
              onClick={() => setSearchMode('standard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                searchMode === 'standard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Standard Tool Search</span>
            </button>
          </div>

          {/* Dynamic Search Interface */}
          {searchMode === 'problem' ? (
            <div className="pt-2">
              <ProblemSolverBar onSelectTool={onSelectTool} />
            </div>
          ) : (
            <div className="max-w-xl mx-auto pt-2">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 1,000+ tools (PDF, Image, Business Card, QR Logo, SQL, Regex...)"
                  className="w-full pl-12 pr-28 py-3.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                />
                <button
                  onClick={onOpenSearch}
                  className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-all"
                >
                  Search
                </button>
              </div>
            </div>
          )}

          {/* Value Badges & Theme Customizer Trigger */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Client-Side
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Lock className="w-4 h-4 text-emerald-500" />
              Zero Remote Logging
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Zap className="w-4 h-4 text-amber-500" />
              {TOOLS_DATA.length}+ Working Utilities
            </span>
            {/* Custom Tools Theme Pill */}
            <button
              type="button"
              onClick={openThemeModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-400 dark:hover:border-slate-500 transition-all text-slate-700 dark:text-slate-200 normal-case tracking-normal"
              title="Change tools theme color, density, and font"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: activeColors.textColor }} />
              <span className="text-[11px] font-bold">Theme: {activeColors.name}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Most Popular Section (Ranks tools based on click-frequency tracked in local storage) */}
      {!searchQuery && !selectedCategory && !memberOnlyFilter && searchMode !== 'problem' && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                style={{ backgroundColor: activeColors.primary }}
              >
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Most Popular Tools
                  </h2>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
                    style={{
                      backgroundColor: activeColors.lightBg,
                      color: activeColors.textColor,
                    }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    Local Storage Ranked
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ranked live by your click frequency & local browser usage habits.
                </p>
              </div>
            </div>

            {/* Popularity Controls & Custom Theme Shortcut */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-900 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPopularityLimit(8)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    popularityLimit === 8
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Top 8
                </button>
                <button
                  type="button"
                  onClick={() => setPopularityLimit(16)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    popularityLimit === 16
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Top 16
                </button>
              </div>

              <button
                type="button"
                onClick={openThemeModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-2xs transition-colors"
                title="Customize tools theme"
              >
                <Palette className="w-3.5 h-3.5" style={{ color: activeColors.textColor }} />
                <span>Custom Theme</span>
              </button>

              <button
                type="button"
                onClick={handleResetPopularity}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
                title="Reset popularity stats in local storage"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Reset Confirmation Toast */}
          {resetConfirmToast && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in duration-150">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Popularity click counts have been reset to baseline defaults!
              </span>
            </div>
          )}

          {/* Ranked Tool Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {popularRankedTools.map(({ tool, clicks, rank }) => (
              <ToolCard
                key={`popular-${tool.id}`}
                tool={tool}
                onSelect={handleToolSelection}
                popularityRank={rank}
                clickCount={clicks}
              />
            ))}
          </div>
        </section>
      )}

      {/* Category Pills Navigation */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {memberOnlyFilter 
                ? 'Members-Exclusive Pro Suite' 
                : selectedCategory 
                  ? `${CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Category'} Tools` 
                  : 'Browse by Category'}
            </h2>
          </div>
          {(selectedCategory || memberOnlyFilter) && (
            <button
              onClick={() => {
                onSelectCategory(null);
                setMemberOnlyFilter(false);
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold uppercase tracking-wider"
            >
              Show All Tools
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              onSelectCategory(null);
              setMemberOnlyFilter(false);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === null && !memberOnlyFilter
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500'
            }`}
          >
            All Tools ({TOOLS_DATA.length})
          </button>
          <button
            onClick={() => setMemberOnlyFilter(!memberOnlyFilter)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              memberOnlyFilter
                ? 'bg-amber-600 text-white shadow-md shadow-amber-200 dark:shadow-none'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 dark:hover:border-amber-500'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Members Suite ({TOOLS_DATA.filter(t => t.requiresAuth).length})</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setMemberOnlyFilter(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedCategory === cat.id && !memberOnlyFilter
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500'
              }`}
            >
              <IconRenderer name={cat.icon} className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="mt-6">
          {filteredTools.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Search className="w-8 h-8 mx-auto text-slate-400" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                No tools match &quot;{searchQuery}&quot;
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try describing your problem in the Problem Solver or search for terms like &quot;compress&quot;, &quot;format&quot;, &quot;webhook&quot;, or &quot;loan&quot;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSelectCategory(null);
                }}
                className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-md shadow-indigo-200 dark:shadow-none"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-4">
              {filteredTools.map((tool, index) => (
                <React.Fragment key={tool.id}>
                  <ToolCard tool={tool} onSelect={handleToolSelection} />
                  {index === 5 && filteredTools.length > 6 && (
                    <InFeedAd key="infeed-ad-1" asCard={true} />
                  )}
                  {index === 23 && filteredTools.length > 24 && (
                    <InFeedAd key="infeed-ad-2" asCard={true} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Multiplex native recommendation ad unit */}
          <MultiplexAd className="mt-8 mb-2" />
        </div>
      </section>

      {/* Feature Highlights Banner: Privacy & Architecture */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-slate-900 dark:bg-slate-900/90 rounded-3xl p-6 sm:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Security Status</p>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>End-to-End Client Encrypted</span>
              </div>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black tracking-tighter leading-tight">
              Your Files Never Leave Your Device.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Unlike other tool suites that upload your confidential PDFs, private images, and database queries to remote servers, ToolStack computes everything inside your web browser using HTML5 Canvas, Web Crypto, and WebAssembly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero server logs or remote uploads</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited file processing forever</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GDPR & HIPAA compliant architecture</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant local hardware execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
