
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme, THEMES } from '../theme';

interface ThemeContextType {
  currentTheme: AppTheme;
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = useState<AppTheme>(THEMES.default);

  const setTheme = (themeId: string) => {
    const theme = THEMES[themeId];
    if (theme) {
      setCurrentThemeState(theme);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const { colors, font, radius, borderWidth, buttonBorderWidth, shadow, baseFontSize, bgPattern } = currentTheme;

    // Layout & Typography Variables
    root.style.setProperty('--font-main', font);
    root.style.setProperty('--radius-main', radius);
    root.style.setProperty('--border-width', borderWidth);
    root.style.setProperty('--border-width-btn', buttonBorderWidth);
    root.style.setProperty('--shadow-theme', shadow);
    root.style.setProperty('--base-font-size', baseFontSize);
    root.style.setProperty('--bg-pattern', bgPattern || 'none');

    // Color Variables
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-dark', colors.primaryDark);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-secondary-dark', colors.secondaryDark);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-accent-dark', colors.accentDark);
    root.style.setProperty('--color-danger', colors.danger);
    root.style.setProperty('--color-danger-dark', colors.dangerDark);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-muted', colors.textMuted);
    root.style.setProperty('--color-border', colors.border);
    
    // Core Values
    root.style.setProperty('--color-value-1', colors.value1);
    root.style.setProperty('--color-value-2', colors.value2);
    root.style.setProperty('--color-value-3', colors.value3);
    root.style.setProperty('--color-value-4', colors.value4);

  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
