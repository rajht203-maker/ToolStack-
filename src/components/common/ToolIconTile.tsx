import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ToolCategory } from '../../types';

interface ToolIconTileProps {
  category?: ToolCategory | string;
  iconName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Category-based soft gradients with matching text and subtle borders
export const CATEGORY_TILE_STYLES: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  pdf: {
    bg: 'bg-gradient-to-br from-rose-500/10 via-red-500/15 to-orange-500/10 dark:from-rose-500/20 dark:via-red-500/25 dark:to-orange-500/15',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200/80 dark:border-rose-800/60',
    glow: 'group-hover:shadow-rose-500/20'
  },
  image: {
    bg: 'bg-gradient-to-br from-amber-500/10 via-orange-500/15 to-yellow-500/10 dark:from-amber-500/20 dark:via-orange-500/25 dark:to-yellow-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200/80 dark:border-amber-800/60',
    glow: 'group-hover:shadow-amber-500/20'
  },
  text: {
    bg: 'bg-gradient-to-br from-emerald-500/10 via-teal-500/15 to-cyan-500/10 dark:from-emerald-500/20 dark:via-teal-500/25 dark:to-cyan-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200/80 dark:border-emerald-800/60',
    glow: 'group-hover:shadow-emerald-500/20'
  },
  developer: {
    bg: 'bg-gradient-to-br from-blue-500/10 via-indigo-500/15 to-cyan-500/10 dark:from-blue-500/20 dark:via-indigo-500/25 dark:to-cyan-500/15',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200/80 dark:border-blue-800/60',
    glow: 'group-hover:shadow-blue-500/20'
  },
  calculator: {
    bg: 'bg-gradient-to-br from-violet-500/10 via-purple-500/15 to-fuchsia-500/10 dark:from-violet-500/20 dark:via-purple-500/25 dark:to-fuchsia-500/15',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200/80 dark:border-violet-800/60',
    glow: 'group-hover:shadow-violet-500/20'
  },
  converter: {
    bg: 'bg-gradient-to-br from-cyan-500/10 via-sky-500/15 to-teal-500/10 dark:from-cyan-500/20 dark:via-sky-500/25 dark:to-teal-500/15',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200/80 dark:border-cyan-800/60',
    glow: 'group-hover:shadow-cyan-500/20'
  },
  security: {
    bg: 'bg-gradient-to-br from-slate-600/10 via-zinc-600/15 to-stone-600/10 dark:from-slate-500/20 dark:via-zinc-500/25 dark:to-stone-500/15',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-300/80 dark:border-slate-700/80',
    glow: 'group-hover:shadow-slate-500/20'
  },
  seo: {
    bg: 'bg-gradient-to-br from-pink-500/10 via-rose-500/15 to-indigo-500/10 dark:from-pink-500/20 dark:via-rose-500/25 dark:to-indigo-500/15',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-200/80 dark:border-pink-800/60',
    glow: 'group-hover:shadow-pink-500/20'
  },
  social: {
    bg: 'bg-gradient-to-br from-sky-500/10 via-blue-500/15 to-indigo-500/10 dark:from-sky-500/20 dark:via-blue-500/25 dark:to-indigo-500/15',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-200/80 dark:border-sky-800/60',
    glow: 'group-hover:shadow-sky-500/20'
  },
  ai: {
    bg: 'bg-gradient-to-br from-purple-500/10 via-indigo-500/15 to-pink-500/10 dark:from-purple-500/20 dark:via-indigo-500/25 dark:to-pink-500/15',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200/80 dark:border-purple-800/60',
    glow: 'group-hover:shadow-purple-500/20'
  }
};

const SIZE_CONFIGS = {
  sm: { tile: 'w-8 h-8 rounded-lg border', icon: 'w-4 h-4' },
  md: { tile: 'w-10 h-10 rounded-xl border', icon: 'w-5 h-5' },
  lg: { tile: 'w-12 h-12 rounded-2xl border', icon: 'w-6 h-6' },
  xl: { tile: 'w-16 h-16 rounded-3xl border-2', icon: 'w-8 h-8' }
};

export const ToolIconTile: React.FC<ToolIconTileProps> = ({
  category = 'developer',
  iconName = 'Wrench',
  size = 'md',
  className = ''
}) => {
  const style = CATEGORY_TILE_STYLES[category] || CATEGORY_TILE_STYLES.developer;
  const sizeConfig = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;

  // Resolve Lucide Icon Component
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Wrench;

  return (
    <div
      className={`shrink-0 flex items-center justify-center transition-all duration-300 ${sizeConfig.tile} ${style.bg} ${style.border} ${style.text} ${className}`}
    >
      <IconComponent className={sizeConfig.icon} />
    </div>
  );
};
