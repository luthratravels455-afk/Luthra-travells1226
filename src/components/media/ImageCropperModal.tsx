import React, { useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Crop } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ImageCropperModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
  aspectRatio?: number; // width / height, e.g., 16/9, 1, 4/3
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 16 / 9,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [processing, setProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  if (!isOpen || !imageSrc) return null;

  const handleApplyCrop = () => {
    if (!imgRef.current) return;
    setProcessing(true);

    try {
      const img = imgRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const width = img.naturalWidth;
      const height = img.naturalHeight;

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.drawImage(img, -width / 2, -height / 2);
        ctx.restore();
      }

      canvas.toBlob((blob) => {
        if (blob) {
          onCropComplete(blob);
          onClose();
        }
        setProcessing(false);
      }, 'image/webp', 0.9);
    } catch (err) {
      console.error('Crop error:', err);
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
            <Crop className="w-5 h-5 text-[#C9A227]" /> Image Optimization &amp; Cropper
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Preview Area */}
        <div className="relative h-64 bg-zinc-950 rounded-2xl overflow-hidden flex items-center justify-center border border-zinc-800">
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop Preview"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.1s ease-out',
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Controls */}
        <div className="space-y-4 text-xs text-zinc-300">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1 font-mono">
              <ZoomIn className="w-4 h-4 text-[#C9A227]" /> Zoom ({Math.round(zoom * 100)}%)
            </span>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#C9A227]"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1 font-mono">
              <RotateCw className="w-4 h-4 text-[#C9A227]" /> Rotation ({rotation}°)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-1"
              >
                Rotate 90°
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                }}
                className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-xs"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="gold"
            size="sm"
            isLoading={processing}
            onClick={handleApplyCrop}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Apply &amp; Crop
          </Button>
        </div>

      </div>
    </div>
  );
};
