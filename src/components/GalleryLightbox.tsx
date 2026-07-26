import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types';

export interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const currentItem = items[currentIndex] || null;

  const handlePrev = useCallback(() => {
    setZoomLevel(1);
    const newIdx = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    onNavigate(newIdx);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    setZoomLevel(1);
    const newIdx = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIdx);
  }, [currentIndex, items.length, onNavigate]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-2xl animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Image Viewer Lightbox"
    >
      {/* Top Controls Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-30 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] flex items-center justify-center text-xs font-mono font-bold">
            {currentIndex + 1}/{items.length}
          </span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline-block">
            {currentItem.category || 'Gallery'}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-1.5 backdrop-blur-md">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Zoom Out (-)"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-[#C9A227] min-w-[40px] text-center font-bold">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Zoom In (+)"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {zoomLevel > 1 && (
            <button
              onClick={handleResetZoom}
              className="p-1 text-zinc-400 hover:text-[#C9A227] transition-colors ml-1 border-l border-zinc-800 pl-2"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Close Lightbox */}
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#C9A227] flex items-center justify-center transition-colors"
          aria-label="Close Lightbox (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Previous Button */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#C9A227] flex items-center justify-center transition-all hover:scale-105"
        aria-label="Previous Image (Left Arrow)"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div className="max-w-5xl max-h-[80vh] px-16 py-8 overflow-auto flex items-center justify-center relative z-20">
        <img
          src={currentItem.image_url}
          alt={currentItem.title || 'Luthra Travels Gallery Photo'}
          className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
          loading="eager"
        />
      </div>

      {/* Navigation Next Button */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#C9A227] flex items-center justify-center transition-all hover:scale-105"
        aria-label="Next Image (Right Arrow)"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Title Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-30 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent text-center space-y-1">
        <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
          {currentItem.category}
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white max-w-xl mx-auto">
          {currentItem.title}
        </h3>
      </div>
    </div>
  );
};
