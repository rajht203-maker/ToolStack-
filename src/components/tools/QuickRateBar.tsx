import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, ThumbsUp, Sparkles, MessageSquare, Send, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolItem } from '../../types';
import { submitToolFeedback } from '../../services/feedbackService';

interface QuickRateBarProps {
  tool: ToolItem;
  className?: string;
  onOpenReviews?: () => void;
}

const QUICK_TAGS = [
  { label: '⚡ Super Fast', type: 'rating' as const, note: 'Super Fast' },
  { label: '🎯 Accurate & Clean', type: 'rating' as const, note: 'Accurate & Clean' },
  { label: '✨ Easy to Use', type: 'rating' as const, note: 'Easy to Use' },
  { label: '💡 Feature Idea', type: 'improvement' as const, note: 'Feature Idea' },
  { label: '🐞 Bug Found', type: 'bug_report' as const, note: 'Bug Report' },
];

export const QuickRateBar: React.FC<QuickRateBarProps> = ({ 
  tool, 
  className = '',
  onOpenReviews 
}) => {
  const storageKey = `toolstack_rated_${tool.id}`;
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [optionalNote, setOptionalNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);
  const [noteSent, setNoteSent] = useState<boolean>(false);

  // Check if previously rated in this browser session
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 5) {
          setUserRating(parsed);
          setHasSubmitted(true);
        }
      }
    } catch {
      // LocalStorage non-critical fallback
    }
  }, [storageKey]);

  // 1-Tap Star Click: Submits immediately with ZERO complex forms!
  const handleRateStar = async (stars: number) => {
    setUserRating(stars);
    setHasSubmitted(true);
    setIsSubmitting(true);

    try {
      localStorage.setItem(storageKey, String(stars));
    } catch {
      // ignore
    }

    // Trigger celebratory confetti for positive rating
    if (stars >= 4) {
      try {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.75 }
        });
      } catch {
        // ignore
      }
    }

    try {
      await submitToolFeedback({
        toolId: tool.id,
        toolName: tool.name,
        rating: stars,
        type: 'rating',
        comment: '',
        userName: 'Anonymous Member',
        userEmail: ''
      });
    } catch (err) {
      console.warn('Quick rating offline fallback recorded:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optional 1-Tap Tag: Attaches quick preset in 1 click
  const handleSelectTag = async (tag: typeof QUICK_TAGS[0]) => {
    if (selectedTag === tag.label) {
      setSelectedTag(null);
      return;
    }
    setSelectedTag(tag.label);
    setShowNoteInput(true);

    const currentStars = userRating || 5;

    try {
      await submitToolFeedback({
        toolId: tool.id,
        toolName: tool.name,
        rating: currentStars,
        type: tag.type,
        comment: `[${tag.note}]`,
        userName: 'Anonymous Member',
        userEmail: ''
      });
    } catch (err) {
      console.warn('Tag feedback offline fallback:', err);
    }
  };

  // Optional Note Submission
  const handleSendNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optionalNote.trim()) return;

    setIsSubmitting(true);
    const fullComment = selectedTag 
      ? `[${selectedTag}] ${optionalNote.trim()}` 
      : optionalNote.trim();

    try {
      await submitToolFeedback({
        toolId: tool.id,
        toolName: tool.name,
        rating: userRating || 5,
        type: selectedTag?.includes('Bug') ? 'bug_report' : selectedTag?.includes('Feature') ? 'improvement' : 'rating',
        comment: fullComment,
        userName: 'Anonymous Member',
        userEmail: ''
      });
      setNoteSent(true);
      setOptionalNote('');
      setTimeout(() => {
        setShowNoteInput(false);
        setNoteSent(false);
      }, 3500);
    } catch (err) {
      console.warn('Note submission recorded in fallback:', err);
      setNoteSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDisplay = hoverRating || userRating || 0;

  const starLabels: Record<number, string> = {
    1: '1 - Poor',
    2: '2 - Fair',
    3: '3 - Good',
    4: '4 - Very Good',
    5: '5 - Excellent!'
  };

  return (
    <div className={`bg-gradient-to-r from-indigo-50/70 via-slate-50 to-purple-50/50 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-100/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Instant Prompt & Star Rating */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {hasSubmitted ? 'Thanks for rating!' : 'How was your experience?'}
            </span>
            {hasSubmitted && userRating && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3" />
                Rated {userRating}/5
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* 1-Tap Clickable Stars */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              {[1, 2, 3, 4, 5].map((star) => {
                const isLit = star <= currentDisplay;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRateStar(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 rounded-md hover:scale-125 active:scale-95 transition-transform focus:outline-none cursor-pointer"
                    title={starLabels[star]}
                    aria-label={`Give ${star} out of 5 stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        isLit
                          ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 hidden xs:inline">
              {currentDisplay > 0 ? starLabels[currentDisplay] : '1-click to rate'}
            </span>
          </div>
        </div>

        {/* Right: Quick Tag Chips & Optional Feedback Link */}
        <div className="flex flex-col sm:items-end gap-2">
          {/* Quick 1-Tap Reaction Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleSelectTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                  selectedTag === tag.label
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => setShowNoteInput(prev => !prev)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              {showNoteInput ? 'Hide note box' : 'Add a quick comment'}
            </button>
            <span>•</span>
            <a
              href="#tool-feedback-section"
              onClick={(e) => {
                if (onOpenReviews) {
                  e.preventDefault();
                  onOpenReviews();
                }
              }}
              className="hover:text-slate-700 dark:hover:text-slate-200 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              View community reviews <ArrowDown className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Optional Note Expandable Field */}
      {showNoteInput && (
        <form onSubmit={handleSendNote} className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2 animate-in fade-in duration-150">
          <input
            type="text"
            value={optionalNote}
            onChange={(e) => setOptionalNote(e.target.value.slice(0, 300))}
            placeholder={
              selectedTag 
                ? `Add details for "${selectedTag}" (optional)...` 
                : 'Say what you liked or how we can improve (optional)...'
            }
            className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          <button
            type="submit"
            disabled={isSubmitting || !optionalNote.trim()}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Send</span>
          </button>
          {noteSent && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sent!
            </span>
          )}
        </form>
      )}
    </div>
  );
};
