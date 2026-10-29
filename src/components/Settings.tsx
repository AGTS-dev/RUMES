import { useState } from 'react';
import { useTheme, ThemeType } from '../contexts/ThemeContext';
import WallpaperPicker from './WallpaperPicker';

type SettingsTab = 'general' | 'appearance' | 'wallpapers' | 'about';

export default function Settings() {
  const { theme, setTheme, customAccentColor, setCustomAccentColor, customColors, setCustomColors } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const themes: { id: ThemeType; name: string; icon: string; description: string }[] = [
    { id: 'dark', name: 'Тёмная', icon: '🌙', description: 'Классическая тёмная тема' },
    { id: 'light', name: 'Светлая', icon: '☀️', description: 'Светлая тема для дневного использования' },
    { id: 'custom', name: 'Своя', icon: '🎨', description: 'Полностью настраиваемая тема' },
    { id: 'windows98', name: 'Windows 98', icon: '💾', description: 'Олдскул интерфейс' },
    { id: 'russia', name: 'Россия', icon: '🇷🇺', description: 'Тематический дизайн' },
  ];

  const handleCustomColorChange = (key: keyof typeof customColors, value: string) => {
    setCustomColors({ ...customColors, [key]: value });
  };

  const tabs = [
    { id: 'general' as SettingsTab, label: 'Общие', icon: '⚙️' },
    { id: 'appearance' as SettingsTab, label: 'Оформление', icon: '🎨' },
    { id: 'wallpapers' as SettingsTab, label: 'Обои', icon: '🖼️' },
    { id: 'about' as SettingsTab, label: 'О приложении', icon: 'ℹ️' },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h1 className="settings-title">Настройки</h1>
      </div>

      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="settings-tab-icon">{tab.icon}</span>
            <span className="settings-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="settings-content">
        {/* Общие настройки */}
        {activeTab === 'general' && (
          <div className="settings-section">
            <h2 className="settings-section-title">Общие настройки</h2>
            <div className="settings-info">
              <div className="info-row">
                <span className="info-label">Язык</span>
                <span className="info-value">Русский</span>
              </div>
              <div className="info-row">
                <span className="info-label">Уведомления</span>
                <span className="info-value">Включены</span>
              </div>
              <div className="info-row">
                <span className="info-label">Звуки</span>
                <span className="info-value">Включены</span>
              </div>
            </div>
            <p className="settings-note">Больше настроек будет добавлено в будущих обновлениях</p>
          </div>
        )}

        {/* Оформление */}
        {activeTab === 'appearance' && (
          <>
            <div className="settings-section">
              <h2 className="settings-section-title">Тема оформления</h2>
              <div className="theme-grid">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`theme-card ${theme === t.id ? 'active' : ''}`}
                  >
                    <div className="theme-icon">{t.icon}</div>
                    <div className="theme-name">{t.name}</div>
                    <div className="theme-description">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Акцентный цвет для Dark/Light */}
            {(theme === 'dark' || theme === 'light') && (
              <div className="settings-section">
                <h2 className="settings-section-title">Акцентный цвет</h2>
                <div className="accent-color-picker">
                  <div className="color-picker-row">
                    <label className="color-label">Основной акцент</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={customAccentColor}
                        onChange={(e) => setCustomAccentColor(e.target.value)}
                        className="color-input"
                      />
                      <span className="color-value">{customAccentColor}</span>
                    </div>
                  </div>
                  <div className="preset-colors">
                    <span className="preset-label">Быстрый выбор:</span>
                    <div className="preset-grid">
                      {['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#00ff88'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setCustomAccentColor(color)}
                          className="preset-color-btn"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Кастомизация темы "Своя" */}
            {theme === 'custom' && (
              <div className="settings-section">
                <h2 className="settings-section-title">Кастомизация темы</h2>
                <div className="rainbow-customizer">
                  <div className="color-picker-row">
                    <label className="color-label">Основной фон</label>
                    <div className="color-input-wrapper">
                      <input type="color" value={customColors.primary} onChange={(e) => handleCustomColorChange('primary', e.target.value)} className="color-input" />
                      <span className="color-value">{customColors.primary}</span>
                    </div>
                  </div>
                  <div className="color-picker-row">
                    <label className="color-label">Вторичный фон</label>
                    <div className="color-input-wrapper">
                      <input type="color" value={customColors.secondary} onChange={(e) => handleCustomColorChange('secondary', e.target.value)} className="color-input" />
                      <span className="color-value">{customColors.secondary}</span>
                    </div>
                  </div>
                  <div className="color-picker-row">
                    <label className="color-label">Третичный фон</label>
                    <div className="color-input-wrapper">
                      <input type="color" value={customColors.tertiary} onChange={(e) => handleCustomColorChange('tertiary', e.target.value)} className="color-input" />
                      <span className="color-value">{customColors.tertiary}</span>
                    </div>
                  </div>
                  <div className="color-picker-row">
                    <label className="color-label">Акцентный цвет</label>
                    <div className="color-input-wrapper">
                      <input type="color" value={customColors.accent} onChange={(e) => handleCustomColorChange('accent', e.target.value)} className="color-input" />
                      <span className="color-value">{customColors.accent}</span>
                    </div>
                  </div>
                  <div className="color-picker-row">
                    <label className="color-label">Основной текст</label>
                    <div className="color-input-wrapper">
                      <input type="color" value={customColors.textPrimary} onChange={(e) => handleCustomColorChange('textPrimary', e.target.value)} className="color-input" />
                      <span className="color-value">{customColors.textPrimary}</span>
                    </div>
                  </div>
                  <div className="color-picker-row">
                    <label className="color-label">Вторичный текст</label>
                    <div className="color-input-wrapper">
                      <input type="color" value={customColors.textSecondary} onChange={(e) => handleCustomColorChange('textSecondary', e.target.value)} className="color-input" />
                      <span className="color-value">{customColors.textSecondary}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCustomColors({
                      primary: '#1a0a2e', secondary: '#16213e', tertiary: '#0f3460',
                      accent: '#ff00ff', textPrimary: '#ffffff', textSecondary: '#ffd700',
                    })}
                    className="reset-btn"
                  >
                    Сбросить к стандартным цветам
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Обои */}
        {activeTab === 'wallpapers' && (
          <div className="settings-section">
            <h2 className="settings-section-title">Обои чата</h2>
            <WallpaperPicker />
          </div>
        )}

        {/* О приложении */}
        {activeTab === 'about' && (
          <div className="settings-section">
            <h2 className="settings-section-title">О приложении</h2>
            <div className="settings-info">
              <div className="info-row">
                <span className="info-label">Версия</span>
                <span className="info-value">1.0.0</span>
              </div>
              <div className="info-row">
                <span className="info-label">Разработчик</span>
                <span className="info-value">RUMES Team</span>
              </div>
              <div className="info-row">
                <span className="info-label">Лицензия</span>
                <span className="info-value">MIT</span>
              </div>
            </div>
            <div className="about-description">
              <p>RUMES — современный мессенджер с полной кастомизацией интерфейса.</p>
              <p>Поддерживает множество тем оформления, включая тематические дизайны.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
