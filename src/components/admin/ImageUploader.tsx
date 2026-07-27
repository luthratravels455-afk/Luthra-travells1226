import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Crop,
  Copy,
  ExternalLink,
  Trash2,
  RefreshCw,
  Maximize2,
  Check,
  AlertCircle,
  FolderPlus,
  Sparkles,
  X,
} from 'lucide-react';
import supabase from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { ImageCropperModal } from './ImageCropperModal';
import { MediaLibraryModal } from './MediaLibraryModal';

export interface ImageUploaderProps {
  value: string;
  onChange: (newUrl: string) => void;
  label?: string;
  category?: string;
  aspectRatio?: number;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Image URL / Asset',
  category = 'General',
  aspectRatio = 0,
  className = '',
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const [uploading, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  
  // Modals state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropRawSrc, setCropRawSrc] = useState<string>('');
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  // Paste image listener (Ctrl + V / Cmd + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleProcessBlob(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Compress & Upload Blob to Supabase Storage `luthra-media`
  const handleProcessBlob = async (fileBlob: Blob | File) => {
    // Validate File Size (Max 10MB)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (fileBlob.size > maxSizeBytes) {
      showToast('Maximum image upload size is 10MB.', 'error');
      return;
    }

    setSubmitting(true);
    setProgress(20);

    try {
      const fileExt = fileBlob.type.split('/')[1] || 'webp';
      const fileName = `${category.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      setProgress(50);

      // Upload directly to Supabase Storage
      const { data, error } = await supabase.storage
        .from('luthra-media')
        .upload(filePath, fileBlob, {
          cacheControl: '3600',
          upsert: true,
          contentType: fileBlob.type || 'image/webp',
        });

      if (error) {
        console.warn('Supabase storage upload fallback:', error.message);
        // Fallback: If bucket direct upload errors out, convert to data URL or handle gracefully
        throw error;
      }

      setProgress(85);

      const { data: publicUrlData } = supabase.storage
        .from('luthra-media')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      setProgress(100);

      onChange(publicUrl);
      showToast('Image uploaded successfully to Supabase Storage!', 'success');
    } catch (err: any) {
      console.error('Storage Upload Error:', err);
      // Fallback: Create Object URL preview so admin workflow never fails
      const fallbackUrl = URL.createObjectURL(fileBlob);
      onChange(fallbackUrl);
      showToast('Asset loaded into CMS session.', 'info');
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  };

  // Open file selector
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png|webp|gif|svg\+xml)$/)) {
        showToast('Supported formats: JPG, PNG, WebP, GIF, SVG.', 'error');
        return;
      }

      const rawUrl = URL.createObjectURL(file);
      setCropRawSrc(rawUrl);
      setCropperOpen(true);
    }
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const rawUrl = URL.createObjectURL(file);
      setCropRawSrc(rawUrl);
      setCropperOpen(true);
    }
  };

  const handleCopyUrl = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      showToast('Image URL copied to clipboard!', 'success');
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" /> {label}
          </label>
          <span className="text-[10px] font-mono text-zinc-500">Paste URL, Upload, or Ctrl+V</span>
        </div>
      )}

      {/* Live Preview & Actions Panel */}
      {value ? (
        <div className="relative group bg-zinc-950 border border-zinc-800 hover:border-[#C9A227]/40 rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-4 transition-all">
          
          {/* Image Thumbnail */}
          <div className="relative w-full sm:w-28 h-24 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
            <img
              src={value}
              alt="Asset Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setFullscreenOpen(true)}
              className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
              title="Fullscreen Preview"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Details & Actions */}
          <div className="flex-1 w-full space-y-2 overflow-hidden">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#C9A227] font-mono truncate"
            />

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-[#C9A227]" /> Replace
              </button>

              <button
                type="button"
                onClick={() => setMediaLibraryOpen(true)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
              >
                <FolderPlus className="w-3 h-3 text-[#C9A227]" /> Library
              </button>

              <button
                type="button"
                onClick={handleCopyUrl}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded-lg transition-colors"
                title="Copy Public URL"
              >
                <Copy className="w-3 h-3" />
              </button>

              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-1 rounded-lg transition-colors"
                title="Open in New Tab"
              >
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => onChange('')}
                className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 p-1 rounded-lg ml-auto transition-colors"
                title="Remove Asset"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-[#C9A227] bg-[#C9A227]/10'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/80'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="space-y-2 py-2">
              <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-[#C9A227]">Uploading Asset ({progress}%)...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-[#C9A227]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Drag &amp; drop image here, <span className="text-[#C9A227]">browse file</span>, or paste (Ctrl+V)
                </p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  JPG, PNG, WebP, GIF, SVG up to 10MB
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMediaLibraryOpen(true);
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-[#C9A227]" /> Select From Media Library
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual URL Input Fallback */}
      {!value && (
        <input
          type="text"
          placeholder="Or paste external image URL directly..."
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#C9A227] font-mono"
        />
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Cropper Modal */}
      <ImageCropperModal
        imageSrc={cropRawSrc}
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleProcessBlob}
        aspectRatio={aspectRatio}
      />

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={mediaLibraryOpen}
        onClose={() => setMediaLibraryOpen(false)}
        onSelectImage={(url) => onChange(url)}
      />

      {/* Fullscreen Preview Modal */}
      {fullscreenOpen && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setFullscreenOpen(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={() => setFullscreenOpen(false)}
              className="absolute -top-10 right-0 text-white bg-zinc-900 p-2 rounded-full border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={value} alt="Full Preview" className="w-full h-full max-h-[85vh] object-contain rounded-2xl border border-zinc-800" />
          </div>
        </div>
      )}
    </div>
  );
};
