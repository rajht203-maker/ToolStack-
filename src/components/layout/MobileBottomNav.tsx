import React from 'react';
import { Home, Search, Layers, Heart, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  onGoHome: () => void;
  onOpenSearch: () => void;
  onOpenCategories: () => void;
  onOpenFavorites: () => void;
  onToggleMemberFilter: () => void;
  isHomeActive: boolean;
  isMemberFilterActive?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onGoHome,
  onOpenSearch,
  onOpenCategories,
  onOpenFavorites,
  onToggleMemberFilter,
  isHomeActive,
  isMemberFilterActive
}) => {
  const { user, favorites } = useAuth();

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 safe-bottom transition-colors shadow-lg"
    >
      <div className="grid grid-cols-5 h-14 items-center px-1">
        {/* Home Button */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold transition-colors ${
            isHomeActive && !isMemberFilterActive
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Categories / Drawer Button */}
        <button
          onClick={onOpenCategories}
          className="flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Layers className="w-5 h-5" />
          <span>Categories</span>
        </button>

        {/* Search Modal Trigger (Centered Highlight) */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center py-1 -mt-3 group"
          title="Search tools"
        >
          <div className="w-11 h-11 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-all">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-1">Search</span>
        </button>

        {/* Favorites Button with Badge */}
        <button
          onClick={onOpenFavorites}
          className="relative flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                {favorites.length > 9 ? '9+' : favorites.length}
              </span>
            )}
          </div>
          <span>Saved</span>
        </button>

        {/* Members / Pro Filter Button */}
        <button
          onClick={onToggleMemberFilter}
          className={`flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold transition-colors ${
            isMemberFilterActive
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {user ? (
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          ) : (
            <Lock className="w-5 h-5 text-amber-500" />
          )}
          <span>Member</span>
        </button>
      </div>
    </nav>
  );
};
