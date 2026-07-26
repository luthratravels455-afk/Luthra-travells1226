import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-zinc-800/60 animate-pulse rounded-xl ${className}`} />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 animate-pulse">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-2 gap-2 pt-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
};
