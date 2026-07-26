import React from 'react';
import { X } from 'lucide-react';

export interface AdminModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative flex flex-col justify-between max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-zinc-300">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
