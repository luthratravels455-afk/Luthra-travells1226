import React from 'react';

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  tag?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  tag,
  align = 'center',
  className = '',
}) => {
  const alignment = align === 'center' ? 'text-center max-w-3xl mx-auto' : align === 'right' ? 'text-right ml-auto max-w-3xl' : 'text-left max-w-3xl';

  return (
    <div className={`space-y-3 ${alignment} ${className}`}>
      {tag && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-mono uppercase tracking-widest">
          {tag}
        </span>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const SectionSubtitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-zinc-400 text-sm sm:text-base leading-relaxed ${className}`}>
    {children}
  </p>
);
