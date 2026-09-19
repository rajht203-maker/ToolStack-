import React, { useState, useRef, useEffect } from 'react';
import { ToolItem } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { ToolDispatcher } from './ToolDispatcher';
import { ToolCard } from './ToolCard';
import { ToolFeedbackComponent } from './ToolFeedbackComponent';
import { getRelatedTools, CATEGORIES } from '../../data/toolsData';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  ChevronRight, 
  Heart, 
  Share2, 
  Check, 
  Copy,
  HelpCircle, 
  ListOrdered, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft,
  Lock,
  Zap,
  Smartphone,
  ExternalLink,
  Mail,
  Send,
  MessageCircle,
  X,
  Home,
  Palette
} from 'lucide-react';

interface ToolViewProps {
  tool: ToolItem;
  onBack: () => void;
  onSelectTool: (tool: ToolItem) => void;
  onSelectCategory: (catId: string) => void;
  onOpenAuth?: () => void;
}

export const ToolView: React.FC<ToolViewProps> = ({
  tool,
  onBack,
  onSelectTool,
  onSelectCategory,
  onOpenAuth
}) => {
  const { user, isFavorite, toggleFavorite, addHistory } = useAuth();
  const { openThemeModal, activeColors } = useTheme();
  const favorited = isFavorite(tool.id);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  const relatedTools = getRelatedTools(tool);
  const categoryInfo = CATEGORIES.find(c => c.id === tool.category);

  // Derive canonical direct permalink for this tool
  const getPermalink = (toolItem: ToolItem): string => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    let basePath = '';
    if (window.location.hostname.endsWith('github.io')) {
      const segments = window.location.pathname.split('/').filter(Boolean);
      if (segments.length > 0 && segments[0] !== 'tools' && segments[0] !== 'calculators' && segments[0] !== 'admin') {
        basePath = `/${segments[0]}`;
      }
    }
    const subpath = toolItem.category === 'calculator' 
      ? `/calculators/${toolItem.slug}` 
      : `/tools/${toolItem.slug}`;
    return `${origin}${basePath}${subpath}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setSuccessToast('Direct permalink copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
      return true;
    } catch {
      setSuccessToast('Failed to copy to clipboard.');
      return false;
    }
  };

  const handleShareClick = async () => {
    const permalink = getPermalink(tool);
    // 1. Immediately copy the direct permalink to the clipboard
    await copyToClipboard(permalink);

    // 2. Open the share options modal
    setShareMenuOpen(true);
  };

  const handleNativeShare = async () => {
    const permalink = getPermalink(tool);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} | ToolStack`,
          text: tool.description,
          url: permalink
        });
        setShareMenuOpen(false);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          copyToClipboard(permalink);
        }
      }
    } else {
      copyToClipboard(permalink);
      setSuccessToast('Native share is not supported on this browser. Link copied!');
    }
  };

  // Close share popover when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShareMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShareMenuOpen(false);
      }
    };

    if (shareMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shareMenuOpen]);

  const handleToolSuccess = (summary: string) => {
    addHistory(tool.id, tool.name, summary);
    setSuccessToast(summary);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const permalink = getPermalink(tool);
  const shareTitle = `${tool.name} - Free Online Tool`;
  const shareText = tool.description;
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const socialChannels = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n${permalink}`)}`,
      icon: MessageCircle,
      textColor: 'hover:text-emerald-600 dark:hover:text-emerald-400'
    },
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(permalink)}`,
      icon: Send,
      textColor: 'hover:text-sky-600 dark:hover:text-sky-400'
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(permalink)}`,
      icon: ExternalLink,
      textColor: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodeURIComponent(permalink)}&text=${encodeURIComponent(shareTitle)}`,
      icon: Send,
      textColor: 'hover:text-cyan-600 dark:hover:text-cyan-400'
    },
    {
      name: 'Reddit',
      url: `https://reddit.com/submit?url=${encodeURIComponent(permalink)}&title=${encodeURIComponent(shareTitle)}`,
      icon: MessageCircle,
      textColor: 'hover:text-orange-600 dark:hover:text-orange-400'
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\nAccess the tool directly here:\n${permalink}`)}`,
      icon: Mail,
      textColor: 'hover:text-violet-600 dark:hover:text-violet-400'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Breadcrumb Navigation Trail */}
      <nav 
        aria-label="Breadcrumb"
        className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap pb-1"
      >
        <ol className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar py-0.5">
          <li className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer"
              title="Return to Home dashboard"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </li>
          
          <li className="shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>

          <li className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onSelectCategory(tool.category)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer"
              title={`View all ${categoryInfo?.name || tool.category} tools`}
            >
              {categoryInfo?.icon && (
                <IconRenderer name={categoryInfo.icon} className="w-3.5 h-3.5 text-indigo-500" />
              )}
              <span>{categoryInfo?.name || tool.category}</span>
            </button>
          </li>

          <li className="shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>

          <li className="flex items-center gap-1.5 min-w-0" aria-current="page">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold truncate max-w-[200px] sm:max-w-xs border border-indigo-100/60 dark:border-indigo-900/40">
              <IconRenderer name={tool.icon} className="w-3.5 h-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="truncate">{tool.name}</span>
            </span>
          </li>
        </ol>

        {/* Quick Back Action */}
        <button
          type="button"
          onClick={onBack}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-auto"
          title="Back to previous view"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </nav>

      {/* Tool Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-inner">
              <IconRenderer name={tool.icon} className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {tool.name}
                </h1>
                {tool.requiresAuth && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Member Access
                  </span>
                )}
                {tool.badge && !tool.requiresAuth && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                    {tool.badge}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 100% Client-Side
                </span>
                {(tool.category === 'pdf' || tool.category === 'image' || tool.largeFileSupport) && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-sky-500" /> Large File Engine (250MB+)
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-medium">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => toggleFavorite(tool.id, tool.name)}
              className={`px-4 py-2 rounded-full border transition-colors flex items-center gap-1.5 text-xs font-bold ${
                favorited
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200 dark:border-rose-900'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{favorited ? 'Favorited' : 'Favorite'}</span>
            </button>

            {/* Custom Theme Button */}
            <button
              type="button"
              onClick={openThemeModal}
              className="px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title={`Custom Theme: ${activeColors.name}`}
              aria-label="Customize tools theme"
            >
              <Palette className="w-4 h-4" style={{ color: activeColors.textColor }} />
              <span className="hidden sm:inline">Theme</span>
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShareClick}
              className={`px-4 py-2 rounded-full border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                shareMenuOpen || copiedLink
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
              title="Copy direct permalink & open browser share options"
              aria-label="Share tool"
              aria-expanded={shareMenuOpen}
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {copiedLink ? 'Link Copied!' : 'Share'}
              </span>
              <span className="sm:hidden">
                {copiedLink ? 'Copied' : 'Share'}
              </span>
            </button>
          </div>
        </div>

        {/* Share Modal Dialog (Full Screen Backdrop & Centered Card to Prevent Any Truncation or Clipping) */}
        {shareMenuOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShareMenuOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Share Options"
          >
            <div 
              ref={shareRef}
              className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Share Tool
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShareMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close share menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Permalink Direct Copy Section */}
              <div className="mt-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Direct Permalink
                  </label>
                  {copiedLink && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                      <Check className="w-3.5 h-3.5" /> Copied to clipboard
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <input
                    type="text"
                    readOnly
                    value={permalink}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="flex-1 min-w-0 bg-transparent px-2.5 py-1 text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none select-all truncate"
                    title={permalink}
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(permalink)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                      copiedLink
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Native Browser Share Action */}
              <div className="mt-3.5">
                {canNativeShare ? (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Open Native Browser Share</span>
                  </button>
                ) : (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Native share available on mobile or supported desktop browsers.</span>
                  </div>
                )}
              </div>

              {/* Browser & Social Share Options */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Or share directly to:
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {socialChannels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <a
                        key={channel.name}
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-all ${channel.textColor}`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate max-w-full">{channel.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary Interactive Workspace */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          {(tool.requiresAuth && !user) ? (
            <div className="py-12 px-6 text-center max-w-lg mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  <Sparkles className="w-3.5 h-3.5" /> Member Tool
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Sign in to access {tool.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  This specialized pro utility is part of our Member Suite. Sign in or register a free account to unlock instant access, save custom configurations, and track your execution history.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" /> Sign In or Register Free
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500">
                <div className="flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> 100% Free
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Client-Side
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Instant Access
                </div>
              </div>
            </div>
          ) : (
            <ToolDispatcher tool={tool} onSuccess={handleToolSuccess} />
          )}
        </div>
      </div>

      {/* Guide: How to Use & FAQs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step by step guide */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
              How to use {tool.name}
            </h3>
          </div>
          <ol className="space-y-2.5">
            {tool.howToUse.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="pt-0.5 leading-relaxed font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>
          <div className="space-y-3">
            {tool.faqs.map((faq, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {faq.question}
                </div>
                <div className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tool Feedback, Rating & Bug Reporting (Stored in Firestore) */}
      <ToolFeedbackComponent tool={tool} onOpenAuth={onOpenAuth} />

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Related Tools You Might Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <ToolCard key={relTool.id} tool={relTool} onSelect={onSelectTool} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
