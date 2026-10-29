interface AvatarProps {
  emoji: string;
  online?: boolean;
  size?: 'sm' | 'md' | 'lg';
  gradient?: string;
}

const gradients = [
  'from-indigo-500 to-violet-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-600',
  'from-purple-500 to-fuchsia-600',
];

export function getGradient(id: string) {
  const index = id.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export default function Avatar({ emoji, online, size = 'md', gradient }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-base',
    md: 'w-11 h-11 text-lg',
    lg: 'w-14 h-14 text-2xl',
  };

  const onlineSizes = {
    sm: 'w-2.5 h-2.5 border-[1.5px]',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2',
  };

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizeClasses[size]} rounded-xl flex items-center justify-center bg-gradient-to-br ${
          gradient || 'from-indigo-500 to-violet-600'
        } shadow-md transition-transform duration-200`}
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' }}
      >
        <span className="drop-shadow-sm">{emoji}</span>
      </div>
      {online && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 ${onlineSizes[size]} bg-emerald-400 rounded-full border-[#0b0d14] shadow-sm shadow-emerald-400/50`}
        />
      )}
    </div>
  );
}
