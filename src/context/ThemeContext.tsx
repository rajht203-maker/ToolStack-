import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CustomThemeSettings,
  ThemeColorPreset,
  ToolCardDensity,
  ToolCornerStyle,
  ToolFontFamily,
} from '../types';
import {
  DEFAULT_THEME_SETTINGS,
  THEME_PRESETS,
  ThemePresetConfig,
  applyThemeToDOM,
  getActiveColorConfig,
  getStoredThemeSettings,
  saveThemeSettings,
} from '../utils/themeCustomizer';

interface ThemeContextType {
  themeSettings: CustomThemeSettings;
  activeColors: ThemePresetConfig;
  setThemeSettings: (settings: CustomThemeSettings) => void;
  updatePreset: (preset: ThemeColorPreset) => void;
  updateCustomColor: (hex: string) => void;
  updateDensity: (density: ToolCardDensity) => void;
  updateCornerStyle: (style: ToolCornerStyle) => void;
  updateFontFamily: (font: ToolFontFamily) => void;
  updateAccentGlow: (glow: boolean) => void;
  resetTheme: () => void;
  isThemeModalOpen: boolean;
  setThemeModalOpen: (open: boolean) => void;
  openThemeModal: () => void;
  closeThemeModal: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeSettings, setThemeSettingsState] = useState<CustomThemeSettings>(() => {
    return getStoredThemeSettings();
  });
  const [isThemeModalOpen, setThemeModalOpen] = useState<boolean>(false);

  // Apply theme to DOM and persist on change
  useEffect(() => {
    applyThemeToDOM(themeSettings);
    saveThemeSettings(themeSettings);
  }, [themeSettings]);

  const activeColors = getActiveColorConfig(themeSettings);

  const updatePreset = useCallback((preset: ThemeColorPreset) => {
    setThemeSettingsState((prev) => ({
      ...prev,
      preset,
    }));
  }, []);

  const updateCustomColor = useCallback((hex: string) => {
    setThemeSettingsState((prev) => ({
      ...prev,
      preset: 'custom',
      customPrimaryHex: hex,
    }));
  }, []);

  const updateDensity = useCallback((density: ToolCardDensity) => {
    setThemeSettingsState((prev) => ({
      ...prev,
      density,
    }));
  }, []);

  const updateCornerStyle = useCallback((cornerStyle: ToolCornerStyle) => {
    setThemeSettingsState((prev) => ({
      ...prev,
      cornerStyle,
    }));
  }, []);

  const updateFontFamily = useCallback((fontFamily: ToolFontFamily) => {
    setThemeSettingsState((prev) => ({
      ...prev,
      fontFamily,
    }));
  }, []);

  const updateAccentGlow = useCallback((accentGlow: boolean) => {
    setThemeSettingsState((prev) => ({
      ...prev,
      accentGlow,
    }));
  }, []);

  const resetTheme = useCallback(() => {
    setThemeSettingsState(DEFAULT_THEME_SETTINGS);
  }, []);

  const openThemeModal = useCallback(() => setThemeModalOpen(true), []);
  const closeThemeModal = useCallback(() => setThemeModalOpen(false), []);

  return (
    <ThemeContext.Provider
      value={{
        themeSettings,
        activeColors,
        setThemeSettings: setThemeSettingsState,
        updatePreset,
        updateCustomColor,
        updateDensity,
        updateCornerStyle,
        updateFontFamily,
        updateAccentGlow,
        resetTheme,
        isThemeModalOpen,
        setThemeModalOpen,
        openThemeModal,
        closeThemeModal,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
