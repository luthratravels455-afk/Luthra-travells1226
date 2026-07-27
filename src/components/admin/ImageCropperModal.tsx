import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Crop } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ImageCropperModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, croppedUrl: string) => void;
  aspectRatio?: number; // width / height, e.g., 16/9, 1, 4/3, or 0 for free
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 0,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState<number>(aspectRatio);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setSelectedRatio(aspectRatio);
    setZoom(1);
    setRotation(0);
  }, [imageSrc, aspectRatio, isOpen]);

  if (!isOpen || !imageSrc) return null;

  const handleApply = () => {
    setIsProcessing(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      // Calculate crop & canvas dimensions based on zoom & aspect ratio
      let targetWidth = img.width;
      let targetHeight = img.height;

      if (selectedRatio > 0) {
        if (targetWidth / targetHeight > selectedRatio) {
          targetWidth = targetHeight * selectedRatio;
        } else {
          targetHeight = targetWidth / selectedRatio;
        }
      }

      // Max dimension cap for performance & optimization (e.g. 1920px)
      const maxDimension = 1920;
      let finalWidth = targetWidth;
      let finalHeight = targetHeight;

      if (finalWidth > maxDimension || finalHeight > maxDimension) {
        if (finalWidth > finalHeight) {
          finalHeight = Math.round((finalHeight * maxDimension) / finalWidth);
          finalWidth = maxDimension;
        } else {
          finalWidth = Math.round((finalWidth * maxDimension) / finalHeight);
          finalHeight = maxDimension;
        }
      }

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      if (ctx) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        const cropX = (img.width - targetWidth) / 2;
        const cropY = (img.height - targetHeight) / 2;

        ctx.drawImage(
          img,
          cropX,
          cropY,
          targetWidth,
          targetHeight,
          -canvas.width / 2,
          -canvas.height / 2,
          canvas.width,
          canvas.height
        );
        ctx.restore();
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const previewUrl = URL.createObjectURL(blob);
            onCropComplete(blob, previewUrl);
            setIsProcessing(false);
            onClose();
          } else {
            setIsProcessing(false);
          }
        },
        'image/webp',
        0.88
      );
    };

    img.onerror = () => {
      setIsProcessing(false);
      onClose();
    };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fadeIn"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <Crop className="w-5 h-5 text-[#C9A227]" /> Image Crop &amp; Adjust Editor
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image Preview Box */}
        <div className="relative h-64 bg-zinc-950 rounded-2xl overflow-hidden flex items-center justify-center border border-zinc-800">
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop Target"
            className="max-h-full max-w-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          />
        </div>

        {/* Aspect Ratio Selector */}
        <div className="space-y-2">
          <span className="text-xs text-zinc-400 font-mono block">Aspect Ratio Lock</span>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {[
              { label: 'Free', value: 0 },
              { label: 'Square (1:1)', value: 1 },
              { label: '4:3 Standard', value: 4 / 3 },
              { label: '16:9 Landscape', value: 16 / 9 },
            ].map((ratio) => (
              <button
                key={ratio.label}
                type="button"
                onClick={() => setSelectedRatio(ratio.value)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  selectedRatio === ratio.value
                    ? 'bg-[#C9A227] text-zinc-950 border-[#C9A227] font-bold'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Adjust Controls: Zoom & Rotate */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400 font-mono">
              <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5 text-[#C9A227]" /> Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#C9A227] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400 font-mono">
              <span className="flex items-center gap-1"><RotateCw className="w-3.5 h-3.5 text-[#C9A227]" /> Rotate</span>
              <span>{rotation}°</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRotation((r) => (r - 90) % 360)}
                className="flex-1 bg-zinc-950 border border-zinc-800 py-1 rounded text-zinc-300 hover:text-white"
              >
                -90°
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex-1 bg-zinc-950 border border-zinc-800 py-1 rounded text-zinc-300 hover:text-white"
              >
                +90°
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="gold"
            size="sm"
            isLoading={isProcessing}
            onClick={handleApply}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Apply Crop &amp; Optimize
          </Button>
        </div>
      </div>
    </div>
  );
};
