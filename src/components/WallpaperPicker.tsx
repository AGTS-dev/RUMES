import { useTheme } from '../contexts/ThemeContext';

const wallpapers = [
  { id: 'default', name: 'По умолчанию', preview: 'linear-gradient(135deg, #0e1621 0%, #17212b 100%)' },
  { id: 'gradient-blue', name: 'Синий градиент', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'gradient-sunset', name: 'Закат', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'gradient-ocean', name: 'Океан', preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'gradient-forest', name: 'Лес', preview: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)' },
  { id: 'gradient-night', name: 'Ночь', preview: 'linear-gradient(135deg, #000428 0%, #004e92 100%)' },
  { id: 'pattern-dots', name: 'Точки', preview: 'radial-gradient(circle, #ffffff22 1px, transparent 1px)' },
  { id: 'pattern-grid', name: 'Сетка', preview: 'linear-gradient(#ffffff11 1px, transparent 1px), linear-gradient(90deg, #ffffff11 1px, transparent 1px)' },
  { id: 'solid-dark', name: 'Тёмный', preview: '#000000' },
  { id: 'solid-gray', name: 'Серый', preview: '#2a2a2a' },
  { id: 'russia-kokoshnik', name: 'Кокошник', preview: 'linear-gradient(135deg, #c41e3a 0%, #ffd700 100%)' },
  { id: 'russia-pattern', name: 'Узоры', preview: 'linear-gradient(135deg, #fff8e7 0%, #ffd700 100%)' },
  { id: 'russia-birch', name: 'Берёзовая роща', preview: 'linear-gradient(135deg, #f5f5dc 0%, #228B22 100%)' },
  { id: 'russia-winter', name: 'Русская зима', preview: 'linear-gradient(135deg, #E0FFFF 0%, #B0E0E6 100%)' },
];

export default function WallpaperPicker() {
  const { wallpaper, setWallpaper } = useTheme();

  return (
    <div className="wallpaper-grid">
      {wallpapers.map((wp) => (
        <button
          key={wp.id}
          onClick={() => setWallpaper(wp.id)}
          className={`wallpaper-item ${wallpaper === wp.id ? 'active' : ''}`}
          style={{ background: wp.preview }}
          title={wp.name}
        >
          {wallpaper === wp.id && (
            <div className="wallpaper-check">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
