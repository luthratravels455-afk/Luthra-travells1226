import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[]; className?: string }> = ({
  items,
  className = '',
}) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-xs font-mono ${className}`}>
      <Link to="/" className="text-zinc-400 hover:text-[#C9A227] transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
            {isLast || !item.path ? (
              <span className="text-[#C9A227] font-semibold tracking-wide">{item.label}</span>
            ) : (
              <Link to={item.path} className="text-zinc-400 hover:text-[#C9A227] transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
