import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'emerald' | 'dark' | 'outline';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  dot = false,
  className = '',
}) => {
  const variants = {
    gold: 'bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30',
    emerald: 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30',
    dark: 'bg-zinc-900 text-zinc-300 border border-zinc-800',
    outline: 'bg-transparent text-zinc-300 border border-zinc-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${variant === 'emerald' ? 'bg-emerald-400' : 'bg-[#C9A227]'}`} />
      )}
      <span>{children}</span>
    </span>
  );
};
