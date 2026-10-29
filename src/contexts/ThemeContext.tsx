import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'dark' | 'light' | 'custom' | 'windows98';

export interface CustomColors {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  customAccentColor: string;
  setCustomAccentColor: (color: string) => void;
  customColors: CustomColors;
  setCustomColors: (colors: CustomColors) => void;
  wallpaper: string;
  setWallpaper: (wallpaper: string) => void;
}

const defaultCustomColors: CustomColors = {
  primary: '#1a0a2e',
  secondary: '#16213e',
  tertiary: '#0f3460',
  accent: '#ff00ff',
  textPrimary: '#ffffff',
  textSecondary: '#ffd700',
};

const OVERRIDABLE_VARS = [
  '--bg-primary', '--bg-secondary', '--bg-tertiary',
  '--bg-hover', '--bg-active', '--bg-input',
  '--bg-message-in', '--bg-message-out',
  '--text-primary', '--text-secondary', '--text-tertiary', '--text-accent',
  '--accent', '--accent-hover',
  '--border-color', '--border-light',
  '--online', '--unread',
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function clearAllOverrides() {
  OVERRIDABLE_VARS.forEach((varName) => {
    document.documentElement.style.removeProperty(varName);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('rumes-theme');
    if (saved === 'rainbow') return 'custom'; // миграция
    return (saved as ThemeType) || 'dark';
  });

  const [customAccentColor, setCustomAccentColorState] = useState<string>(() => {
    const saved = localStorage.getItem('rumes-custom-accent');
    return saved || '#ffffff';
  });

  const [customColors, setCustomColorsState] = useState<CustomColors>(() => {
    const saved = localStorage.getItem('rumes-custom-colors');
    return saved ? JSON.parse(saved) : defaultCustomColors;
  });

  const [wallpaper, setWallpaperState] = useState<string>(() => {
    return localStorage.getItem('rumes-wallpaper') || 'default';
  });

  const applyTheme = (currentTheme: ThemeType, accentColor: string, custom: CustomColors, wp: string) => {
    clearAllOverrides();
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark' || currentTheme === 'light') {
      document.documentElement.style.setProperty('--accent', accentColor);
    } else if (currentTheme === 'custom') {
      document.documentElement.style.setProperty('--bg-primary', custom.primary);
      document.documentElement.style.setProperty('--bg-secondary', custom.secondary);
      document.documentElement.style.setProperty('--bg-tertiary', custom.tertiary);
      document.documentElement.style.setProperty('--accent', custom.accent);
      document.documentElement.style.setProperty('--text-primary', custom.textPrimary);
      document.documentElement.style.setProperty('--text-secondary', custom.textSecondary);
    }
    // windows98 использует только CSS, без overrides
    
    // Обои
    document.documentElement.setAttribute('data-wallpaper', wp);
  };

  useEffect(() => {
    localStorage.setItem('rumes-theme', theme);
    applyTheme(theme, customAccentColor, customColors, wallpaper);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rumes-custom-accent', customAccentColor);
    if (theme === 'dark' || theme === 'light') {
      clearAllOverrides();
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.setProperty('--accent', customAccentColor);
    }
  }, [customAccentColor]);

  useEffect(() => {
    localStorage.setItem('rumes-custom-colors', JSON.stringify(customColors));
    if (theme === 'custom') {
      clearAllOverrides();
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.setProperty('--bg-primary', customColors.primary);
      document.documentElement.style.setProperty('--bg-secondary', customColors.secondary);
      document.documentElement.style.setProperty('--bg-tertiary', customColors.tertiary);
      document.documentElement.style.setProperty('--accent', customColors.accent);
      document.documentElement.style.setProperty('--text-primary', customColors.textPrimary);
      document.documentElement.style.setProperty('--text-secondary', customColors.textSecondary);
    }
  }, [customColors]);

  useEffect(() => {
    localStorage.setItem('rumes-wallpaper', wallpaper);
    document.documentElement.setAttribute('data-wallpaper', wallpaper);
  }, [wallpaper]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme: setThemeState,
      customAccentColor,
      setCustomAccentColor: setCustomAccentColorState,
      customColors,
      setCustomColors: setCustomColorsState,
      wallpaper,
      setWallpaper: setWallpaperState,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
