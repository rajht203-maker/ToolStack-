import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  Bug, 
  Lightbulb, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User as UserIcon, 
  Sparkles,
  RefreshCw,
  Filter,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolItem, ToolFeedback, FeedbackType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  submitToolFeedback, 
  subscribeToToolFeedback 
} from '../../services/feedbackService';

interface ToolFeedbackComponentProps {
  tool: ToolItem;
  className?: string;
  onOpenAuth?: () => void;
}

export const ToolFeedbackComponent: React.FC<ToolFeedbackComponentProps> = ({ 
  tool, 
  className = '',
  onOpenAuth
}) => {
  const { user } = useAuth();

  // Form state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('rating');
  const [comment, setComment] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Community feedback list state
  const [feedbackList, setFeedbackList] = useState<ToolFeedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | FeedbackType>('all');
  const [showHistory, setShowHistory] = useState<boolean>(true);

  // Subscribe to real-time feedback for this tool
  useEffect(() => {
    setLoadingFeedback(true);
    const unsubscribe = subscribeToToolFeedback(tool.id, (items) => {
      setFeedbackList(items);
      setLoadingFeedback(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [tool.id]);

  // Derived metrics
  const stats = useMemo(() => {
    if (feedbackList.length === 0) {
      return { averageRating: 0, totalCount: 0, bugsCount: 0, improvementsCount: 0, ratingsCount: 0 };
    }
    const total = feedbackList.length;
    const sumRatings = feedbackList.reduce((acc, item) => acc + (item.rating || 5), 0);
    const avg = sumRatings / total;
    const bugs = feedbackList.filter(f => f.type === 'bug_report').length;
    const improvements = feedbackList.filter(f => f.type === 'improvement').length;
    const ratings = feedbackList.filter(f => f.type === 'rating').length;

    return {
      averageRating: Number(avg.toFixed(1)),
      totalCount: total,
      bugsCount: bugs,
      improvementsCount: improvements,
      ratingsCount: ratings
    };
  }, [feedbackList]);

  // Filtered feedback
  const filteredFeedback = useMemo(() => {
    if (activeFilter === 'all') return feedbackList;
    return feedbackList.filter(f => f.type === activeFilter);
  }, [feedbackList, activeFilter]);

  const ratingLabels: Record<number, string> = {
    1: '1 - Needs Improvement',
    2: '2 - Fair',
    3: '3 - Good',
    4: '4 - Very Good',
    5: '5 - Excellent!'
  };

  const currentDisplayRating = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() && feedbackType !== 'rating') {
      setSubmitError('Please enter a short description for your report or suggestion.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitToolFeedback({
        toolId: tool.id,
        toolName: tool.name,
        rating,
        type: feedbackType,
        comment: comment.trim(),
        userId: user?.uid || 'guest',
        userEmail: user?.email || guestEmail.trim(),
        userName: user?.displayName || guestName.trim() || (user ? 'Verified Member' : 'Community Guest')
      });

      setSubmitSuccess(true);
      setComment('');
      setSubmitting(false);

      // Trigger celebratory confetti for ratings >= 4 or positive contributions
      if (rating >= 4) {
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 }
          });
        } catch {
          // ignore confetti non-critical failures
        }
      }

      // Hide success notification after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 6000);
    } catch (err: any) {
      console.error('Failed to submit tool feedback:', err);
      setSubmitting(false);
      setSubmitError('Failed to record your feedback. Please check your network connection and try again.');
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  return (
    <div id="tool-feedback-section" className={`space-y-6 ${className}`}>
      {/* Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors">
        
        {/* Header and Summary Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Tool Feedback & Community Ratings</span>
            </div>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Rate {tool.name} or Report an Issue
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
              Help us refine this browser tool. Submit a star rating, log a bug report, or request new features. All feedback is stored directly in our Firestore database.
            </p>
          </div>

          {/* Aggregate Rating Scorecard */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shrink-0">
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                {stats.totalCount > 0 ? stats.averageRating : '5.0'}
                <Star className="w-6 h-6 text-amber-400 fill-amber-400 inline" />
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {stats.totalCount > 0 ? `${stats.totalCount} submission${stats.totalCount === 1 ? '' : 's'}` : 'Top Rated Tool'}
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="space-y-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Bug className="w-3 h-3 text-rose-500" />
                <span>{stats.bugsCount} bug report{stats.bugsCount === 1 ? '' : 's'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                <span>{stats.improvementsCount} improvement request{stats.improvementsCount === 1 ? '' : 's'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {submitSuccess && (
          <div className="my-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-start gap-3 text-xs animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-100">
                Thank you! Your feedback has been recorded in Firestore.
              </div>
              <div className="text-emerald-700 dark:text-emerald-300">
                Our engineering team reviews all reports to keep ToolStack running at peak performance.
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {submitError && (
          <div className="my-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>{submitError}</div>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Row 1: Rating Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1. Your Rating
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= currentDisplayRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1.5 rounded-lg hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                      title={ratingLabels[star]}
                      aria-label={`Rate ${star} out of 5 stars`}
                    >
                      <Star 
                        className={`w-7 h-7 transition-colors ${
                          isActive 
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm' 
                            : 'text-slate-300 dark:text-slate-600'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                {ratingLabels[currentDisplayRating]}
              </span>
            </div>
          </div>

          {/* Row 2: Feedback Category Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. What kind of feedback are you providing?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFeedbackType('rating')}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                  feedbackType === 'rating'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/30'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <div>
                  <div>Rating & Review</div>
                  <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">General tool evaluation</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType('bug_report')}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                  feedbackType === 'bug_report'
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 shadow-sm ring-1 ring-rose-500/30'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <Bug className="w-4 h-4" />
                </div>
                <div>
                  <div>Bug Report</div>
                  <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Something didn't work</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType('improvement')}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                  feedbackType === 'improvement'
                    ? 'bg-violet-50 dark:bg-violet-950/60 border-violet-500 text-violet-700 dark:text-violet-300 shadow-sm ring-1 ring-violet-500/30'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <div>Improvement Request</div>
                  <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Feature or format idea</div>
                </div>
              </button>
            </div>
          </div>

          {/* Row 3: Details Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="feedback-comment" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                3. {feedbackType === 'bug_report' ? 'Describe the issue or error' : feedbackType === 'improvement' ? 'Describe your suggested improvement' : 'Optional comments or notes'}
              </label>
              <span className={`text-[11px] font-mono ${comment.length > 900 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                {comment.length} / 1000
              </span>
            </div>

            <textarea
              id="feedback-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 1000))}
              placeholder={
                feedbackType === 'bug_report'
                  ? 'E.g., "When uploading a 15MB scanned PDF with images, the split button timed out with a memory error..."'
                  : feedbackType === 'improvement'
                  ? 'E.g., "Add an option to customize the DPI output to 300 for commercial printing, or batch download in a ZIP file..."'
                  : 'Share what you enjoyed or any tips for other users...'
              }
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none font-medium"
            />
          </div>

          {/* Row 4: Author Identity */}
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {user ? (user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>{user ? (user.displayName || user.email) : 'Community Guest'}</span>
                  {user && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                      Verified Member
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {user ? 'Submitted entries link securely to your verified account.' : 'You can submit freely as a guest or provide an optional alias.'}
                </p>
              </div>
            </div>

            {!user && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value.slice(0, 50))}
                  placeholder="Your Name (Optional)"
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-40"
                />
                {onOpenAuth && (
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Sign In
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving to Firestore...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit {feedbackType === 'bug_report' ? 'Bug Report' : feedbackType === 'improvement' ? 'Improvement Idea' : 'Rating'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Existing Feedback History / Community Section */}
        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Recent Community Feedback</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {feedbackList.length}
                </span>
              </h4>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All ({feedbackList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('bug_report')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeFilter === 'bug_report'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Bug className="w-3 h-3" /> Bugs ({stats.bugsCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('improvement')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeFilter === 'improvement'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Lightbulb className="w-3 h-3" /> Improvements ({stats.improvementsCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('rating')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeFilter === 'rating'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Star className="w-3 h-3" /> Ratings ({stats.ratingsCount})
              </button>
            </div>
          </div>

          {/* Feedback Feed */}
          {loadingFeedback ? (
            <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
              <span>Loading feedback from Firestore...</span>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="py-8 px-4 text-center rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              <Sparkles className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <div className="font-bold text-slate-700 dark:text-slate-300">
                {activeFilter === 'all' 
                  ? `No feedback entries for ${tool.name} yet.` 
                  : `No ${activeFilter.replace('_', ' ')} entries found.`}
              </div>
              <p className="text-slate-400">Be the first to rate or submit a suggestion using the form above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredFeedback.map((item) => {
                const isBug = item.type === 'bug_report';
                const isImprovement = item.type === 'improvement';

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2.5 transition-all hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    {/* Top Row: User, Type badge, Rating */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-[11px] font-bold shrink-0">
                          {(item.userName?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {item.userName || 'Community User'}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{formatRelativeTime(item.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 shrink-0 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-3 h-3 ${s <= item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-600'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Type Badge & Status */}
                    <div className="flex items-center gap-2">
                      {isBug && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                          <Bug className="w-2.5 h-2.5" /> Bug Report
                        </span>
                      )}
                      {isImprovement && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60">
                          <Lightbulb className="w-2.5 h-2.5" /> Improvement Request
                        </span>
                      )}
                      {!isBug && !isImprovement && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                          <Star className="w-2.5 h-2.5 fill-amber-700" /> Star Review
                        </span>
                      )}

                      {/* Status indicator */}
                      {item.status === 'resolved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          <Check className="w-2.5 h-2.5" /> Resolved
                        </span>
                      )}
                      {item.status === 'reviewed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                          Reviewed
                        </span>
                      )}
                    </div>

                    {/* Comment text */}
                    {item.comment ? (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal bg-white/60 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
                        {item.comment}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">
                        No additional comment provided.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
