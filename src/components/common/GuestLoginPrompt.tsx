import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Cloud, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface GuestLoginPromptProps {
  onOpenAuth: () => void;
}

export const GuestLoginPrompt: React.FC<GuestLoginPromptProps> = ({ onOpenAuth }) => {
  const { showGuestLoginPrompt, dismissGuestLoginPrompt, guestToolCount } = useAuth();

  if (!showGuestLoginPrompt) return null;

  return (
    <aside
      aria-label="Account Sync Prompt"
      className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-40 max-w-sm sm:max-w-md w-auto animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-indigo-200 dark:border-indigo-900/80 shadow-2xl shadow-indigo-500/10 flex items-start gap-3 text-slate-800 dark:text-slate-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
          <Cloud className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
            <span>You&apos;ve used {guestToolCount} tools!</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              Free Sync
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            Sign in with Google to sync your custom stack, favourites, and tool history across your phone and laptop.
          </p>

          <div className="flex items-center gap-2 mt-2.5">
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Sign in with Google</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={dismissGuestLoginPrompt}
              className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={dismissGuestLoginPrompt}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
