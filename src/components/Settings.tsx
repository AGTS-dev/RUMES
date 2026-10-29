import { useTheme, ThemeType } from '../contexts/ThemeContext';

export default function Settings() {
  const { theme, setTheme, customAccentColor, setCustomAccentColor, rainbowColors, setRainbowColors } = useTheme();

  const themes: { id: ThemeType; name: string; icon: string; description: string }[] = [
    { id: 'dark', name: 'Тёмная', icon: '🌙', description: 'Классическая тёмная тема' },
    { id: 'light', name: 'Светлая', icon: '☀️', description: 'Светлая тема для дневного использования' },
    { id: 'rainbow', name: 'Радужная', icon: '🌈', description: 'Яркая радужная тема' },
  ];

  const handleRainbowColorChange = (key: keyof typeof rainbowColors, value: string) => {
    setRainbowColors({ ...rainbowColors, [key]: value });
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h1 className="settings-title">Настройки</h1>
      </div>
      
      <div className="settings-content">
        {/* Тема оформления */}
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

        {/* Кастомизация радужной темы */}
        {theme === 'rainbow' && (
          <div className="settings-section">
            <h2 className="settings-section-title">Кастомизация радужной темы</h2>
            <div className="rainbow-customizer">
              <div className="color-picker-row">
                <label className="color-label">Основной фон</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={rainbowColors.primary}
                    onChange={(e) => handleRainbowColorChange('primary', e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{rainbowColors.primary}</span>
                </div>
              </div>

              <div className="color-picker-row">
                <label className="color-label">Вторичный фон</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={rainbowColors.secondary}
                    onChange={(e) => handleRainbowColorChange('secondary', e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{rainbowColors.secondary}</span>
                </div>
              </div>

              <div className="color-picker-row">
                <label className="color-label">Третичный фон</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={rainbowColors.tertiary}
                    onChange={(e) => handleRainbowColorChange('tertiary', e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{rainbowColors.tertiary}</span>
                </div>
              </div>

              <div className="color-picker-row">
                <label className="color-label">Акцентный цвет</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={rainbowColors.accent}
                    onChange={(e) => handleRainbowColorChange('accent', e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{rainbowColors.accent}</span>
                </div>
              </div>

              <div className="color-picker-row">
                <label className="color-label">Основной текст</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={rainbowColors.textPrimary}
                    onChange={(e) => handleRainbowColorChange('textPrimary', e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{rainbowColors.textPrimary}</span>
                </div>
              </div>

              <div className="color-picker-row">
                <label className="color-label">Вторичный текст</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={rainbowColors.textSecondary}
                    onChange={(e) => handleRainbowColorChange('textSecondary', e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{rainbowColors.textSecondary}</span>
                </div>
              </div>

              <button
                onClick={() => setRainbowColors({
                  primary: '#1a0a2e',
                  secondary: '#16213e',
                  tertiary: '#0f3460',
                  accent: '#ff00ff',
                  textPrimary: '#ffffff',
                  textSecondary: '#ffd700',
                })}
                className="reset-btn"
              >
                Сбросить к стандартным цветам
              </button>
            </div>
          </div>
        )}

        {/* О приложении */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
