import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are currently no items available in this view.',
  actionText,
  onAction,
  icon = <AlertCircle className="w-10 h-10 text-[#C9A227]" />,
}) => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto">
      <div className="w-16 h-16 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-2xl flex items-center justify-center mx-auto">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-xl font-bold text-white">{title}</h3>
        <p className="text-xs sm:text-sm text-zinc-400">{description}</p>
      </div>
      {actionText && onAction && (
        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
