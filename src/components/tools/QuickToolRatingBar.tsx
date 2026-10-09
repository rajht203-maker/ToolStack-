import React, { useState } from 'react';
import { Star, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolItem } from '../../types';
import { submitToolFeedback } from '../../services/feedbackService';

interface QuickToolRatingBarProps {
  tool: ToolItem;
}

export const QuickToolRatingBar: React.FC<QuickToolRatingBarProps> = ({ tool }) => {
  const [ratedScore, setRatedScore] = useState<number | null>(null);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const QUICK_TAGS = [
    'Worked great! 👍',
    'Super fast ⚡',
    'Accurate & clean 🎯',
    'Easy to use ✨',
  ];

  const handleRate = async (stars: number) => {
    setRatedScore(stars);
    setIsSaving(true);

    try {
      await submitToolFeedback({
        toolId: tool.id,
        toolName: tool.name,
        rating: stars,
        type: 'rating',
        comment: `Quick Rating: ${stars}/5 stars`,
        userId: 'anonymous',
        userEmail: '',
        userName: 'Quick Rater'
      });

      setSubmitted(true);

      if (stars >= 4) {
        try {
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { y: 0.7 }
          });
        } catch {
          // Non-critical
        }
      }
    } catch (err) {
      console.warn('Quick rating save error:', err);
      // Still show friendly local confirmation
      setSubmitted(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTagClick = async (tag: string) => {
    setSelectedTag(tag);
    if (!ratedScore) return;

    try {
      await submitToolFeedback({
        toolId: tool.id,
        toolName: tool.name,
        rating: ratedScore,
        type: 'rating',
        comment: `Quick Rating: ${ratedScore}/5 stars - ${tag}`,
        userId: 'anonymous',
        userEmail: '',
        userName: 'Quick Rater'
      });
    } catch (err) {
      console.warn('Tag update error:', err);
    }
  };

  const scrollToFeedback = () => {
    const el = document.getElementById('tool-feedback-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 dark:from-slate-800/60 dark:via-indigo-950/20 dark:to-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 fill-amber-500/30" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
            <span>How was your experience with {tool.name}?</span>
            {submitted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {submitted 
              ? 'Thank you! Your 1-click rating helps us keep this tool free & fast.' 
              : '1-click instant rating (no login or form required):'}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
        {/* Star Rating Buttons */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoverScore || ratedScore || 0);
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverScore(star)}
                onMouseLeave={() => setHoverScore(null)}
                disabled={isSaving}
                className="p-1 hover:scale-125 active:scale-95 transition-transform focus:outline-none cursor-pointer"
                aria-label={`Rate ${star} of 5 stars`}
                title={`${star} Star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    isFilled
                      ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Quick Tags or Detailed feedback trigger */}
        {submitted ? (
          <div className="flex flex-wrap items-center gap-1.5 justify-center">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={scrollToFeedback}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>More feedback &amp; bugs</span>
          </button>
        )}
      </div>
    </div>
  );
};
