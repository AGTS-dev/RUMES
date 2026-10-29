import { useState, useEffect } from 'react';

interface Folder {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const defaultFolders: Folder[] = [
  { id: 'all', name: 'Все чаты', icon: '💬', color: '#3390ec' },
  { id: 'personal', name: 'Личные', icon: '👤', color: '#7bc862' },
  { id: 'groups', name: 'Группы', icon: '👥', color: '#6ec9cb' },
  { id: 'channels', name: 'Каналы', icon: '📢', color: '#faa05a' },
  { id: 'bots', name: 'Боты', icon: '🤖', color: '#e17076' },
];

const iconOptions = ['💬', '👤', '👥', '📢', '🤖', '⭐', '🔥', '💼', '🎮', '📚', '🎵', '🏠', '💡', '🎨', '🚀', '🎯', '📌', '🔔', '💎', '🌟'];
const colorOptions = ['#3390ec', '#7bc862', '#6ec9cb', '#faa05a', '#e17076', '#a695e7', '#ee7aae', '#6fb1e4', '#54cb68', '#ff885e'];

export default function FolderManager() {
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('rumes-folders');
    return saved ? JSON.parse(saved) : defaultFolders;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderIcon, setNewFolderIcon] = useState('💬');
  const [newFolderColor, setNewFolderColor] = useState('#3390ec');

  useEffect(() => {
    localStorage.setItem('rumes-folders', JSON.stringify(folders));
  }, [folders]);

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      icon: newFolderIcon,
      color: newFolderColor,
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setNewFolderIcon('💬');
    setNewFolderColor('#3390ec');
    setShowAddForm(false);
  };

  const handleDeleteFolder = (id: string) => {
    if (id === 'all' || id === 'personal' || id === 'groups' || id === 'channels' || id === 'bots') {
      alert('Нельзя удалить системную папку');
      return;
    }
    setFolders(folders.filter(f => f.id !== id));
  };

  return (
    <div className="folder-manager">
      <div className="folder-list">
        {folders.map((folder) => (
          <div key={folder.id} className="folder-item">
            <div 
              className="folder-icon"
              style={{ backgroundColor: folder.color }}
            >
              {folder.icon}
            </div>
            <div className="folder-info">
              <div className="folder-name">{folder.name}</div>
            </div>
            {(folder.id !== 'all' && folder.id !== 'personal' && folder.id !== 'groups' && folder.id !== 'channels' && folder.id !== 'bots') && (
              <button 
                className="folder-delete-btn"
                onClick={() => handleDeleteFolder(folder.id)}
                title="Удалить папку"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {showAddForm ? (
        <div className="folder-add-form">
          <input
            type="text"
            placeholder="Название папки"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="folder-input"
            autoFocus
          />
          
          <div className="folder-icon-picker">
            <label>Иконка:</label>
            <div className="icon-options">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  className={`icon-option ${newFolderIcon === icon ? 'active' : ''}`}
                  onClick={() => setNewFolderIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="folder-color-picker">
            <label>Цвет:</label>
            <div className="color-options">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className={`color-option ${newFolderColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewFolderColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div className="folder-form-actions">
            <button className="folder-btn cancel" onClick={() => setShowAddForm(false)}>
              Отмена
            </button>
            <button className="folder-btn save" onClick={handleAddFolder}>
              Создать
            </button>
          </div>
        </div>
      ) : (
        <button className="folder-add-btn" onClick={() => setShowAddForm(true)}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Создать папку
        </button>
      )}
    </div>
  );
}
