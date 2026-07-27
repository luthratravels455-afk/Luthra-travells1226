import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Crop,
  Copy,
  ExternalLink,
  Trash2,
  RefreshCw,
  Eye,
  Check,
  Sparkles,
  Maximize2,
  X,
} from 'lucide-react';
import { mediaService } from '../../services/mediaService';
import { useToast } from '../../contexts/ToastContext';
import { MediaLibraryModal } from './MediaLibraryModal';
import { ImageCropperModal } from './ImageCropperModal';

export interface ImageFieldManagerProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  category?: string;
  placeholder?: string;
  helpText?: string;
  aspectRatio?: number;
}

export const ImageFieldManager: React.FC<ImageFieldManagerProps> = ({
  label = 'Image URL',
  value,
  onChange,
  category = 'General',
  placeholder = 'https://images.unsplash.com/... or upload local file',
  helpText,
  aspectRatio,
}) => {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [rawImageForCrop, setRawImageForCrop] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler
  const handleFileChange = async (file: File) => {
    // Validate format
    const validFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validFormats.includes(file.type)) {
      showToast('Invalid file format. Please upload JPG, PNG, WebP, SVG, or GIF.', 'error');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds maximum limit of 10MB.', 'error');
      return;
    }

    // Option to Crop before uploading
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageForCrop(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedUpload = async (croppedBlob: Blob) => {
    setUploading(true);
    try {
      const croppedFile = new File([croppedBlob], `upload_${Date.now()}.webp`, { type: 'image/webp' });
      const result = await mediaService.uploadImage(croppedFile, category);
      onChange(result.url);
      showToast('Image compressed & uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error uploading file', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Clipboard Paste (Ctrl+V) listener
  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files && e.clipboardData.files[0]) {
      e.preventDefault();
      handleFileChange(e.clipboardData.files[0]);
      showToast('Pasted image detected from clipboard!', 'info');
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    showToast('Image URL copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
          <span>{label}</span>
          {value && (
            <span className="text-[10px] text-[#C9A227] font-mono">
              Public Storage URL Active
            </span>
          )}
        </label>
      )}

      {/* Main Input + Upload Action Bar */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        className={`bg-zinc-950 border ${
          dragOver ? 'border-[#C9A227] bg-[#C9A227]/5' : 'border-zinc-800'
        } rounded-2xl p-3 space-y-3 transition-all`}
      >
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Text Input */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-[#C9A227] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
          />

          {/* Hidden File Picker */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
            className="hidden"
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-[#C9A227] hover:bg-[#b8911d] text-zinc-950 font-bold text-xs px-3 py-2 rounded-xl inline-flex items-center gap-1 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMediaModalOpen(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs px-3 py-2 rounded-xl inline-flex items-center gap-1 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="hidden sm:inline">Media Library</span>
            </button>
          </div>
        </div>

        {/* Drag & Drop Hint */}
        <div className="text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-900 pt-2 font-mono">
          <span>Drag &amp; drop file here, or press Ctrl+V to paste image</span>
          <span>Formats: JPG, PNG, WebP, SVG, GIF (Max 10MB)</span>
        </div>

        {/* Live Preview Box */}
        {value && (
          <div className="relative group bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                onClick={() => setLightboxOpen(true)}
                className="w-14 h-14 bg-black rounded-lg overflow-hidden shrink-0 border border-zinc-800 cursor-pointer relative group/img"
              >
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1 overflow-hidden">
                <span className="text-xs font-semibold text-white truncate block">
                  Active Image Asset
                </span>
                <span className="text-[10px] text-zinc-400 font-mono truncate block max-w-xs sm:max-w-md">
                  {value}
                </span>
              </div>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-[#C9A227] text-zinc-300 hover:text-[#C9A227] rounded-lg transition-colors"
                title="Copy Image URL"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-[#C9A227] text-zinc-300 hover:text-[#C9A227] rounded-lg transition-colors"
                title="Open in New Tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-[#C9A227] text-zinc-300 hover:text-[#C9A227] rounded-lg transition-colors"
                title="Replace Image"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-rose-500 text-rose-400 rounded-lg transition-colors"
                title="Clear Image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {helpText && <p className="text-[10px] text-zinc-500 font-mono">{helpText}</p>}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectImage={(url) => onChange(url)}
        category={category}
      />

      {/* Image Cropper Modal */}
      {rawImageForCrop && (
        <ImageCropperModal
          imageSrc={rawImageForCrop}
          isOpen={cropperOpen}
          onClose={() => {
            setCropperOpen(false);
            setRawImageForCrop(null);
          }}
          onCropComplete={handleCroppedUpload}
          aspectRatio={aspectRatio}
        />
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-[#C9A227]"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={value} alt="Full Lightbox" className="max-h-[80vh] max-w-full object-contain rounded-2xl border border-zinc-800" />
            <span className="text-xs font-mono text-zinc-400 mt-2">{value}</span>
          </div>
        </div>
      )}
    </div>
  );
};
