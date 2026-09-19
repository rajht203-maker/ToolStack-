import { CustomThemeSettings, ThemeColorPreset, ToolCardDensity, ToolCornerStyle, ToolFontFamily } from '../types';

export const THEME_STORAGE_KEY = 'toolstack_custom_theme';

export interface ThemePresetConfig {
  id: ThemeColorPreset;
  name: string;
  primary: string;
  hover: string;
  lightBg: string;
  darkBg: string;
  textColor: string;
  ringColor: string;
  gradient: string;
}

export const THEME_PRESETS: Record<Exclude<ThemeColorPreset, 'custom'>, ThemePresetConfig> = {
  indigo: {
    id: 'indigo',
    name: 'Indigo Pro',
    primary: '#4f46e5',
    hover: '#4338ca',
    lightBg: '#eef2ff',
    darkBg: '#1e1b4b',
    textColor: '#4338ca',
    ringColor: '#6366f1',
    gradient: 'from-indigo-600 to-violet-600',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    primary: '#059669',
    hover: '#047857',
    lightBg: '#ecfdf5',
    darkBg: '#064e3b',
    textColor: '#047857',
    ringColor: '#10b981',
    gradient: 'from-emerald-600 to-teal-600',
  },
  violet: {
    id: 'violet',
    name: 'Royal Violet',
    primary: '#7c3aed',
    hover: '#6d28d9',
    lightBg: '#f5f3ff',
    darkBg: '#2e1065',
    textColor: '#6d28d9',
    ringColor: '#8b5cf6',
    gradient: 'from-violet-600 to-purple-600',
  },
  ocean: {
    id: 'ocean',
    name: 'Pacific Ocean',
    primary: '#0284c7',
    hover: '#0369a1',
    lightBg: '#f0f9ff',
    darkBg: '#082f49',
    textColor: '#0369a1',
    ringColor: '#0ea5e9',
    gradient: 'from-sky-600 to-cyan-600',
  },
  rose: {
    id: 'rose',
    name: 'Sunset Rose',
    primary: '#e11d48',
    hover: '#be123c',
    lightBg: '#fff1f2',
    darkBg: '#4c0519',
    textColor: '#be123c',
    ringColor: '#f43f5e',
    gradient: 'from-rose-600 to-pink-600',
  },
  amber: {
    id: 'amber',
    name: 'Golden Amber',
    primary: '#d97706',
    hover: '#b45309',
    lightBg: '#fffbeb',
    darkBg: '#451a03',
    textColor: '#b45309',
    ringColor: '#f59e0b',
    gradient: 'from-amber-600 to-orange-600',
  },
  teal: {
    id: 'teal',
    name: 'Modern Teal',
    primary: '#0d9488',
    hover: '#0f766e',
    lightBg: '#f0fdfa',
    darkBg: '#042f2e',
    textColor: '#0f766e',
    ringColor: '#14b8a6',
    gradient: 'from-teal-600 to-emerald-600',
  },
  slate: {
    id: 'slate',
    name: 'Developer Slate',
    primary: '#334155',
    hover: '#1e293b',
    lightBg: '#f1f5f9',
    darkBg: '#0f172a',
    textColor: '#1e293b',
    ringColor: '#64748b',
    gradient: 'from-slate-700 to-zinc-800',
  },
};

export const DEFAULT_THEME_SETTINGS: CustomThemeSettings = {
  preset: 'indigo',
  customPrimaryHex: '#4f46e5',
  density: 'comfortable',
  cornerStyle: 'rounded',
  fontFamily: 'sans',
  accentGlow: true,
};

/**
 * Loads custom theme settings from localStorage
 */
export function getStoredThemeSettings(): CustomThemeSettings {
  if (typeof window === 'undefined') return DEFAULT_THEME_SETTINGS;
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return DEFAULT_THEME_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_THEME_SETTINGS,
      ...parsed,
    };
  } catch (err) {
    console.warn('Failed to parse theme settings from localStorage:', err);
    return DEFAULT_THEME_SETTINGS;
  }
}

/**
 * Saves custom theme settings to localStorage
 */
export function saveThemeSettings(settings: CustomThemeSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save theme settings to localStorage:', err);
  }
}

/**
 * Resolves active color config based on current preset or custom color
 */
export function getActiveColorConfig(settings: CustomThemeSettings): ThemePresetConfig {
  if (settings.preset === 'custom' && settings.customPrimaryHex) {
    const hex = settings.customPrimaryHex;
    return {
      id: 'custom',
      name: 'Custom Theme',
      primary: hex,
      hover: hex,
      lightBg: `${hex}15`,
      darkBg: `${hex}25`,
      textColor: hex,
      ringColor: hex,
      gradient: 'from-[var(--theme-primary)] to-[var(--theme-primary-hover)]',
    };
  }
  return THEME_PRESETS[settings.preset as keyof typeof THEME_PRESETS] || THEME_PRESETS.indigo;
}

/**
 * Injects CSS variables and data attributes into document.documentElement
 */
export function applyThemeToDOM(settings: CustomThemeSettings): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const colors = getActiveColorConfig(settings);

  // Set CSS custom properties
  root.style.setProperty('--theme-primary', colors.primary);
  root.style.setProperty('--theme-primary-hover', colors.hover);
  root.style.setProperty('--theme-primary-light', colors.lightBg);
  root.style.setProperty('--theme-primary-dark', colors.darkBg);
  root.style.setProperty('--theme-primary-text', colors.textColor);
  root.style.setProperty('--theme-primary-ring', colors.ringColor);

  // Corner radius
  const radiusMap: Record<ToolCornerStyle, string> = {
    sharp: '8px',
    rounded: '16px',
    pill: '24px',
  };
  root.style.setProperty('--theme-radius', radiusMap[settings.cornerStyle] || '16px');

  // Font family
  const fontMap: Record<ToolFontFamily, string> = {
    sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', monospace",
  };
  root.style.setProperty('--theme-font', fontMap[settings.fontFamily] || fontMap.sans);

  // Data attributes for targeted CSS styling
  root.setAttribute('data-tool-theme', settings.preset);
  root.setAttribute('data-tool-density', settings.density);
  root.setAttribute('data-tool-corners', settings.cornerStyle);
  root.setAttribute('data-tool-font', settings.fontFamily);
}
