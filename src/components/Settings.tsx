import { useTheme, ThemeType } from '../contexts/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  const themes: { id: ThemeType; name: string; icon: string; description: string }[] = [
    { id: 'dark', name: 'Тёмная', icon: '🌙', description: 'Классическая тёмная тема' },
    { id: 'light', name: 'Светлая', icon: '☀️', description: 'Светлая тема для дневного использования' },
    { id: 'rainbow', name: 'Радужная', icon: '🌈', description: 'Яркая радужная тема' },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h1 className="settings-title">Настройки</h1>
      </div>
      
      <div className="settings-content">
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
