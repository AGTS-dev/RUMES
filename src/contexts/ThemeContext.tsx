import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'dark' | 'light' | 'rainbow';

export interface RainbowColors {
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
  rainbowColors: RainbowColors;
  setRainbowColors: (colors: RainbowColors) => void;
}

const defaultRainbowColors: RainbowColors = {
  primary: '#1a0a2e',
  secondary: '#16213e',
  tertiary: '#0f3460',
  accent: '#ff00ff',
  textPrimary: '#ffffff',
  textSecondary: '#ffd700',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('rumes-theme');
    return (saved as ThemeType) || 'dark';
  });

  const [customAccentColor, setCustomAccentColor] = useState<string>(() => {
    const saved = localStorage.getItem('rumes-custom-accent');
    return saved || '#ffffff';
  });

  const [rainbowColors, setRainbowColors] = useState<RainbowColors>(() => {
    const saved = localStorage.getItem('rumes-rainbow-colors');
    return saved ? JSON.parse(saved) : defaultRainbowColors;
  });

  useEffect(() => {
    localStorage.setItem('rumes-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rumes-custom-accent', customAccentColor);
    
    // Применяем кастомный акцентный цвет для dark и light тем
    if (theme === 'dark' || theme === 'light') {
      document.documentElement.style.setProperty('--accent', customAccentColor);
      document.documentElement.style.setProperty('--accent-hover', customAccentColor);
    }
  }, [customAccentColor, theme]);

  useEffect(() => {
    localStorage.setItem('rumes-rainbow-colors', JSON.stringify(rainbowColors));
    
    // Применяем кастомные цвета радужной темы
    if (theme === 'rainbow') {
      document.documentElement.style.setProperty('--bg-primary', rainbowColors.primary);
      document.documentElement.style.setProperty('--bg-secondary', rainbowColors.secondary);
      document.documentElement.style.setProperty('--bg-tertiary', rainbowColors.tertiary);
      document.documentElement.style.setProperty('--accent', rainbowColors.accent);
      document.documentElement.style.setProperty('--text-primary', rainbowColors.textPrimary);
      document.documentElement.style.setProperty('--text-secondary', rainbowColors.textSecondary);
    }
  }, [rainbowColors, theme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme,
      customAccentColor,
      setCustomAccentColor,
      rainbowColors,
      setRainbowColors
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
