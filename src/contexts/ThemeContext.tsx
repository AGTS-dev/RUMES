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

// Все CSS-переменные, которые могут быть переопределены
const OVERRIDABLE_VARS = [
  '--bg-primary',
  '--bg-secondary',
  '--bg-tertiary',
  '--bg-hover',
  '--bg-active',
  '--bg-input',
  '--bg-message-in',
  '--bg-message-out',
  '--text-primary',
  '--text-secondary',
  '--text-tertiary',
  '--text-accent',
  '--accent',
  '--accent-hover',
  '--border-color',
  '--border-light',
  '--online',
  '--unread',
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Функция очистки всех inline overrides
function clearAllOverrides() {
  OVERRIDABLE_VARS.forEach((varName) => {
    document.documentElement.style.removeProperty(varName);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('rumes-theme');
    return (saved as ThemeType) || 'dark';
  });

  const [customAccentColor, setCustomAccentColorState] = useState<string>(() => {
    const saved = localStorage.getItem('rumes-custom-accent');
    return saved || '#ffffff';
  });

  const [rainbowColors, setRainbowColorsState] = useState<RainbowColors>(() => {
    const saved = localStorage.getItem('rumes-rainbow-colors');
    return saved ? JSON.parse(saved) : defaultRainbowColors;
  });

  // Функция применения темы — вызывается при любом изменении
  const applyTheme = (currentTheme: ThemeType, accentColor: string, rainbow: RainbowColors) => {
    // Сначала очищаем все inline overrides
    clearAllOverrides();

    // Устанавливаем data-theme для CSS
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Затем применяем overrides в зависимости от текущей темы
    if (currentTheme === 'dark' || currentTheme === 'light') {
      // Для dark/light применяем только кастомный акцент
      document.documentElement.style.setProperty('--accent', accentColor);
    } else if (currentTheme === 'rainbow') {
      // Для rainbow применяем все кастомные цвета
      document.documentElement.style.setProperty('--bg-primary', rainbow.primary);
      document.documentElement.style.setProperty('--bg-secondary', rainbow.secondary);
      document.documentElement.style.setProperty('--bg-tertiary', rainbow.tertiary);
      document.documentElement.style.setProperty('--accent', rainbow.accent);
      document.documentElement.style.setProperty('--text-primary', rainbow.textPrimary);
      document.documentElement.style.setProperty('--text-secondary', rainbow.textSecondary);
    }
  };

  // При изменении темы — пересчитываем всё
  useEffect(() => {
    localStorage.setItem('rumes-theme', theme);
    applyTheme(theme, customAccentColor, rainbowColors);
  }, [theme]);

  // При изменении акцентного цвета — применяем только если dark/light
  useEffect(() => {
    localStorage.setItem('rumes-custom-accent', customAccentColor);
    if (theme === 'dark' || theme === 'light') {
      clearAllOverrides();
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.setProperty('--accent', customAccentColor);
    }
  }, [customAccentColor]);

  // При изменении цветов радуги — применяем только если rainbow
  useEffect(() => {
    localStorage.setItem('rumes-rainbow-colors', JSON.stringify(rainbowColors));
    if (theme === 'rainbow') {
      clearAllOverrides();
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.setProperty('--bg-primary', rainbowColors.primary);
      document.documentElement.style.setProperty('--bg-secondary', rainbowColors.secondary);
      document.documentElement.style.setProperty('--bg-tertiary', rainbowColors.tertiary);
      document.documentElement.style.setProperty('--accent', rainbowColors.accent);
      document.documentElement.style.setProperty('--text-primary', rainbowColors.textPrimary);
      document.documentElement.style.setProperty('--text-secondary', rainbowColors.textSecondary);
    }
  }, [rainbowColors]);

  // Обёртки для setState, чтобы можно было использовать в контексте
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const setCustomAccentColor = (color: string) => {
    setCustomAccentColorState(color);
  };

  const setRainbowColors = (colors: RainbowColors) => {
    setRainbowColorsState(colors);
  };

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
