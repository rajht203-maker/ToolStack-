import React, { useState, useEffect } from 'react';
import { ToolItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTools } from '../../context/ToolsContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  X, 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  Sparkles, 
  Star, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  Check,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTool: ToolItem | null;
}

type FeedbackType = 'improvement' | 'bug_report' | 'new_tool' | 'rating';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  currentTool
}) => {
  const { user } = useAuth();
  const { tools } = useTools();

  const [selectedToolId, setSelectedToolId] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('improvement');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync currentTool when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentTool) {
        setSelectedToolId(currentTool.id);
      } else {
        setSelectedToolId('general');
      }
      if (user) {
        setUserEmail(user.email || '');
        setUserName(user.displayName || '');
      }
      setIsSubmitted(false);
      setErrorMessage(null);
    }
  }, [isOpen, currentTool, user]);

  if (!isOpen) return null;

  const targetTool = tools.find(t => t.id === selectedToolId);
  const targetToolName = selectedToolId === 'general' ? 'ToolStack Platform & General' : targetTool?.name || 'Selected Tool';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage('Please describe your feedback, suggestion, or bug report.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const feedbackDoc = {
        feedbackId,
        toolId: selectedToolId || 'general',
        toolName: targetToolName,
        rating,
        type: feedbackType,
        comment: comment.trim(),
        status: 'pending',
        userId: user?.uid || 'guest',
        userEmail: userEmail.trim() || user?.email || '',
        userName: userName.trim() || user?.displayName || 'Visitor',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'tool_feedback', feedbackId), feedbackDoc);

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Non-fatal
      }

      setIsSubmitted(true);
      setComment('');
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setErrorMessage(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Send Feedback to Admin
              </h3>
              <p className="text-[11px] text-slate-400">
                Suggestions, bug reports, and new tool requests go directly to our engineering dashboard.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Feedback Received!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Thank you for helping us improve ToolStack. Your report has been dispatched to the Administrator dashboard.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200 dark:shadow-none"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Target Tool Context Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Tool Context
                </label>
                <select
                  value={selectedToolId}
                  onChange={(e) => setSelectedToolId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {currentTool && (
                    <option value={currentTool.id}>
                      📌 Current Tool: {currentTool.name}
                    </option>
                  )}
                  <option value="general">🌐 General Feedback / Suggest New Tool</option>
                  <optgroup label="All Tools">
                    {tools.slice(0, 100).map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Feedback Category Tabs */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category of Feedback
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'improvement', label: 'Suggestion', icon: Lightbulb, color: 'text-amber-500' },
                    { id: 'bug_report', label: 'Bug Report', icon: Bug, color: 'text-rose-500' },
                    { id: 'new_tool', label: 'New Tool', icon: Sparkles, color: 'text-indigo-500' },
                    { id: 'rating', label: 'Rating', icon: Star, color: 'text-amber-400' }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = feedbackType === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFeedbackType(tab.id as FeedbackType)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                          isActive
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${tab.color}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Rating
                  </label>
                  <span className="text-xs font-semibold text-amber-500">{rating} of 5 Stars</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Content */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    feedbackType === 'bug_report'
                      ? 'Describe what happened, any error messages, or steps to reproduce...'
                      : feedbackType === 'new_tool'
                      ? 'What tool would you like added? How should it work?'
                      : 'Share your suggestion or improvement idea...'
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* User Email & Name (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Your Email <span className="font-normal text-slate-400">(Optional for replies)</span>
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Your Name <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200 dark:shadow-none flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send to Admin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
