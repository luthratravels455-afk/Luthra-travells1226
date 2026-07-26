import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary: 'bg-[#C9A227] hover:bg-[#b8911d] text-zinc-950 shadow-lg shadow-[#C9A227]/20 font-bold uppercase tracking-wider',
      gold: 'bg-gradient-to-r from-amber-400 via-[#C9A227] to-amber-600 hover:brightness-110 text-zinc-950 font-bold uppercase tracking-wider shadow-md shadow-[#C9A227]/25',
      secondary: 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 hover:border-zinc-700',
      outline: 'bg-transparent hover:bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/40 hover:border-[#C9A227]',
      ghost: 'bg-transparent hover:bg-zinc-800/60 text-zinc-300 hover:text-white',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-2 gap-1.5',
      md: 'text-xs sm:text-sm px-5 py-2.5 gap-2',
      lg: 'text-sm sm:text-base px-7 py-3.5 gap-2.5',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        
        <span>{children}</span>

        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
