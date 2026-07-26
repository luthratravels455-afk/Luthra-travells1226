import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export interface AdminStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
  className = '',
}) => {
  return (
    <div
      className={`bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-xl p-5 space-y-3 hover:border-[#C9A227]/40 transition-all ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-400 font-semibold uppercase tracking-wider">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#C9A227]">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="font-serif text-2xl sm:text-3xl font-extrabold text-white font-mono">
          {value}
        </span>

        {change && (
          <span
            className={`inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              isPositive
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-950 text-rose-300 border border-rose-500/30'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{change}</span>
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-zinc-500 font-mono pt-1 border-t border-zinc-800/60">
          {subtitle}
        </p>
      )}
    </div>
  );
};
