import React from 'react';
import { ToolItem } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Heart, ArrowRight, Lock, Flame } from 'lucide-react';

interface ToolCardProps {
  tool: ToolItem;
  onSelect: (tool: ToolItem) => void;
  popularityRank?: number;
  clickCount?: number;
}

const getCategoryIconStyles = (category: string) => {
  switch (category) {
    case 'pdf':
      return 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 group-hover:bg-red-500 group-hover:text-white';
    case 'image':
      return 'bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white';
    case 'developer':
      return 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white';
    case 'text':
      return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white';
    case 'calculator':
      return 'bg-pink-50 dark:bg-pink-950/40 text-pink-500 dark:text-pink-400 group-hover:bg-pink-500 group-hover:text-white';
    case 'converter':
      return 'bg-violet-50 dark:bg-violet-950/40 text-violet-500 dark:text-violet-400 group-hover:bg-violet-500 group-hover:text-white';
    case 'security':
      return 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white';
    case 'seo':
      return 'bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white';
    default:
      return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white';
  }
};

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelect,
  popularityRank,
  clickCount,
}) => {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const { themeSettings, activeColors } = useTheme();
  const favorited = isFavorite(tool.id);
  const iconColorClasses = getCategoryIconStyles(tool.category);
  const isAuthRequired = Boolean(tool.requiresAuth);

  const cornerRadiusClass =
    themeSettings.cornerStyle === 'sharp'
      ? 'rounded-lg'
      : themeSettings.cornerStyle === 'pill'
      ? 'rounded-3xl'
      : 'rounded-2xl';

  const densityPadding =
    themeSettings.density === 'compact'
      ? 'p-4 min-h-[145px]'
      : 'p-5 sm:p-6 min-h-[175px]';

  return (
    <div
      onClick={() => onSelect(tool)}
      className={`bg-white dark:bg-slate-900 ${densityPadding} ${cornerRadiusClass} shadow-xs border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group cursor-pointer flex flex-col justify-between relative hover:shadow-md`}
      style={{
        fontFamily:
          themeSettings.fontFamily === 'mono'
            ? "'JetBrains Mono', monospace"
            : 'inherit',
      }}
    >
      <div>
        {/* Top bar: Category Icon & Badges */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors ${iconColorClasses}`}
          >
            <IconRenderer name={tool.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Click-Frequency / Popularity Badge */}
            {popularityRank !== undefined && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs"
                style={{
                  backgroundColor:
                    popularityRank <= 3
                      ? activeColors.lightBg
                      : 'rgba(241, 245, 249, 0.9)',
                  color:
                    popularityRank <= 3
                      ? activeColors.textColor
                      : 'inherit',
                }}
                title={`Rank #${popularityRank} with ${clickCount ?? 0} clicks recorded`}
              >
                <Flame className={`w-3 h-3 ${popularityRank <= 3 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                <span>#{popularityRank}</span>
                {clickCount !== undefined && (
                  <span className="opacity-75 font-medium">({clickCount})</span>
                )}
              </span>
            )}

            {isAuthRequired && !user && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60 flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" /> Login
              </span>
            )}
            {tool.badge && (!isAuthRequired || user) && !popularityRank && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                {tool.badge}
              </span>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(tool.id, tool.name);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                favorited
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : 'text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Name & description */}
        <h3 className="font-bold text-base sm:text-lg mb-1 tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Footer category tag & CTA */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
        <span className="capitalize text-slate-400 font-medium tracking-wide">{tool.category}</span>
        <span
          className="flex items-center gap-1 font-bold group-hover:translate-x-0.5 transition-transform"
          style={{ color: activeColors.textColor }}
        >
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};


