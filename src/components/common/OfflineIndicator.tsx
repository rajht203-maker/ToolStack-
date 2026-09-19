import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600/95 dark:bg-amber-600/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl shadow-amber-950/20 border border-amber-400/30 animate-in slide-in-from-bottom-3"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — Cached tools & assets are ready</span>
    </div>
  );
};
