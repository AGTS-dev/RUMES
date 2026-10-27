interface AvatarProps {
  emoji: string;
  online?: boolean;
  size?: 'sm' | 'md' | 'lg';
  gradient?: string;
}

const gradients = [
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-yellow-600',
  'from-indigo-500 to-violet-600',
];

export function getGradient(id: string) {
  const index = id.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export default function Avatar({ emoji, online, size = 'md', gradient }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl text-sm',
    md: 'w-12 h-12 rounded-2xl text-xl',
    lg: 'w-14 h-14 rounded-2xl text-2xl',
  };

  const onlineSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br ${
          gradient || 'from-violet-500 to-cyan-500'
        } shadow-lg transition-transform duration-200`}
      >
        <span className="drop-shadow-sm">{emoji}</span>
      </div>
      {online && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 ${onlineSizes[size]} bg-emerald-400 rounded-full border-2 border-[#0a0a0f] shadow-lg shadow-emerald-400/50`}
        />
      )}
    </div>
  );
}
