import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverGlow = true,
}) => {
  return (
    <div
      className={`bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl overflow-hidden transition-all duration-300 ${
        hoverGlow ? 'hover:border-[#C9A227]/40 hover:shadow-xl hover:shadow-[#C9A227]/5 hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-zinc-800/80 ${className}`}>{children}</div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-zinc-800/80 bg-zinc-950/40 ${className}`}>{children}</div>
);
