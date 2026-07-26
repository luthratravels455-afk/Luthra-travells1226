import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

export interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Please confirm if you wish to proceed.',
  confirmText = 'Yes, Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl shadow-black relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            variant === 'danger' ? 'bg-rose-950/80 border border-rose-500/40 text-rose-400' : 'bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227]'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">{title}</h3>
            <p className="text-xs text-zinc-400">{message}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'primary' : 'gold'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className={variant === 'danger' ? '!bg-rose-600 hover:!bg-rose-500 !text-white' : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
