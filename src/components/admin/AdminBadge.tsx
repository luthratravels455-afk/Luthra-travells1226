import React from 'react';

export type BadgeStatus =
  | 'NEW'
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ON_TRIP'
  | 'Active'
  | 'Inactive'
  | 'Published'
  | 'Draft'
  | string;

export interface AdminBadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const norm = (status || '').toUpperCase();

  const styles: Record<string, string> = {
    NEW: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
    PENDING: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    CONFIRMED: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    COMPLETED: 'bg-zinc-800 text-zinc-200 border-zinc-700',
    CANCELLED: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
    ON_TRIP: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
    ACTIVE: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    INACTIVE: 'bg-zinc-900 text-zinc-500 border-zinc-800',
    PUBLISHED: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    DRAFT: 'bg-zinc-900 text-zinc-400 border-zinc-800',
  };

  const dots: Record<string, string> = {
    NEW: 'bg-blue-400',
    PENDING: 'bg-amber-400',
    CONFIRMED: 'bg-emerald-400',
    COMPLETED: 'bg-zinc-400',
    CANCELLED: 'bg-rose-400',
    ON_TRIP: 'bg-purple-400',
    ACTIVE: 'bg-emerald-400',
    INACTIVE: 'bg-zinc-600',
    PUBLISHED: 'bg-emerald-400',
    DRAFT: 'bg-zinc-500',
  };

  const styleClass = styles[norm] || 'bg-zinc-900 text-zinc-300 border-zinc-800';
  const dotClass = dots[norm] || 'bg-[#C9A227]';
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider rounded-md border ${styleClass} ${sizeClass} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
      <span>{status}</span>
    </span>
  );
};
