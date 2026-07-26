import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '7xl' | 'full';
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = '7xl',
  className = '',
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
};
