import React from 'react';

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  tag,
  className = '',
}) => {
  return (
    <div
      className={`bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-800 space-y-4 hover:border-[#C9A227]/40 hover:shadow-xl hover:shadow-[#C9A227]/5 transition-all group ${className}`}
    >
      <div className="w-12 h-12 bg-[#C9A227]/10 rounded-xl flex items-center justify-center text-[#C9A227] group-hover:scale-110 transition-transform">
        {icon}
      </div>

      <div className="space-y-1.5">
        {tag && (
          <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest block">
            {tag}
          </span>
        )}
        <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#C9A227] transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
