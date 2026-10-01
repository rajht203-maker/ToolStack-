import React, { useState } from 'react';
import { ToolItem } from '../../types';
import { FeedbackModal } from './FeedbackModal';
import { MessageSquarePlus, Sparkles } from 'lucide-react';

interface FloatingFeedbackButtonProps {
  currentTool: ToolItem | null;
}

export const FloatingFeedbackButton: React.FC<FloatingFeedbackButtonProps> = ({ currentTool }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <aside aria-label="Tool feedback action" className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          title="Send tool suggestion or bug report to Admin"
          aria-label="Send tool suggestion or bug report to Admin"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
        >
          {/* Subtle notification ping dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>

          <MessageSquarePlus className="w-4 h-4 text-white group-hover:rotate-6 transition-transform" />
          
          <span className="text-xs font-bold tracking-wide hidden sm:inline-block">
            {currentTool ? `Suggest / Report: ${currentTool.name.split(' ')[0]}` : 'Feedback'}
          </span>

          {/* Quick Context Tooltip on Hover */}
          <div className="absolute right-0 -top-10 px-3 py-1 bg-slate-900 text-white text-[10px] font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
            Send suggestion or report a bug to Admin
          </div>
        </button>
      </aside>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentTool={currentTool}
      />
    </>
  );
};
