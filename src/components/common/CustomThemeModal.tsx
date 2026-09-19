import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEME_PRESETS, ThemePresetConfig } from '../../utils/themeCustomizer';
import { ThemeColorPreset, ToolCardDensity, ToolCornerStyle, ToolFontFamily } from '../../types';
import {
  Palette,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  Type,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Heart,
  ArrowRight,
} from 'lucide-react';

interface CustomThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomThemeModal: React.FC<CustomThemeModalProps> = ({ isOpen, onClose }) => {
  const {
    themeSettings,
    activeColors,
    updatePreset,
    updateCustomColor,
    updateDensity,
    updateCornerStyle,
    updateFontFamily,
    resetTheme,
  } = useTheme();

  const [hexInput, setHexInput] = useState(themeSettings.customPrimaryHex || '#4f46e5');

  if (!isOpen) return null;

  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      updateCustomColor(val);
    }
  };

  const presetList = Object.values(THEME_PRESETS);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-colors"
              style={{ backgroundColor: activeColors.primary }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Custom Tools Theme</span>
                <span
                  className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: activeColors.lightBg,
                    color: activeColors.textColor,
                  }}
                >
                  {activeColors.name}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize your tool palette, card density, corner styling, and typography.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Section 1: Color Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Primary Accent Theme</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                {themeSettings.preset === 'custom' ? 'Custom Color' : activeColors.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {presetList.map((preset) => {
                const isSelected = themeSettings.preset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => updatePreset(preset.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 group relative cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20 bg-slate-50 dark:bg-slate-800/80 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-110"
                      style={{ backgroundColor: preset.primary }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {preset.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {preset.primary}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Custom Hex Choice */}
              <button
                type="button"
                onClick={() => updatePreset('custom')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 group relative cursor-pointer ${
                  themeSettings.preset === 'custom'
                    ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20 bg-slate-50 dark:bg-slate-800/80 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-110 border border-slate-300 dark:border-slate-600"
                  style={{ backgroundColor: hexInput }}
                >
                  {themeSettings.preset === 'custom' && (
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    Custom Hex
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {hexInput}
                  </p>
                </div>
              </button>
            </div>

            {/* Custom Color Picker Input */}
            {themeSettings.preset === 'custom' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center gap-3 animate-in fade-in duration-200">
                <input
                  type="color"
                  value={hexInput}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                />
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Enter Hex Color Code:
                  </label>
                  <input
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#4f46e5"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    maxLength={7}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Card Density & Corners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Density */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span>Tool Card Density</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateDensity('comfortable')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    themeSettings.density === 'comfortable'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Comfortable</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateDensity('compact')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    themeSettings.density === 'compact'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Compact</span>
                </button>
              </div>
            </div>

            {/* Corner Radius */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span>Corner Shape</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['sharp', 'rounded', 'pill'] as ToolCornerStyle[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => updateCornerStyle(style)}
                    className={`p-2 rounded-xl border text-xs font-bold capitalize transition-all text-center ${
                      themeSettings.cornerStyle === style
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {style === 'sharp' ? '8px Tech' : style === 'rounded' ? '16px Soft' : '24px Pill'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Typography */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <span>Workspace Font Style</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateFontFamily('sans')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  themeSettings.fontFamily === 'sans'
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <p className="text-xs font-bold font-sans">Plus Jakarta Sans</p>
                <p className="text-[10px] text-slate-400">Clean modern proportional typography</p>
              </button>
              <button
                type="button"
                onClick={() => updateFontFamily('mono')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  themeSettings.fontFamily === 'mono'
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <p className="text-xs font-bold font-mono">JetBrains Mono</p>
                <p className="text-[10px] text-slate-400">Developer terminal monospaced layout</p>
              </button>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Theme Preview
            </label>
            <div
              className={`p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md transition-all flex flex-col justify-between`}
              style={{
                borderRadius:
                  themeSettings.cornerStyle === 'sharp'
                    ? '8px'
                    : themeSettings.cornerStyle === 'pill'
                    ? '24px'
                    : '16px',
                fontFamily:
                  themeSettings.fontFamily === 'mono'
                    ? "'JetBrains Mono', monospace"
                    : 'inherit',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: activeColors.primary }}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: activeColors.lightBg,
                    color: activeColors.textColor,
                  }}
                >
                  {activeColors.name} Preview
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Image Compression & Optimization Suite
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Process high-resolution PNG, JPEG, and WebP files directly in your browser.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Image Category</span>
                <span
                  className="font-bold flex items-center gap-1"
                  style={{ color: activeColors.textColor }}
                >
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 rounded-b-3xl">
          <button
            type="button"
            onClick={resetTheme}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-102"
            style={{ backgroundColor: activeColors.primary }}
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
