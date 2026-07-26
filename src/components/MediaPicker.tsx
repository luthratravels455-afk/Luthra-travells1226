import React, { useState } from 'react';
import { Upload, Image as ImageIcon, RefreshCw, X, Eye } from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';
import { mediaService } from '../services/mediaService';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/Button';

export interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  value,
  onChange,
  label = 'Image Asset',
  placeholder = 'https://images.unsplash.com/... or upload image',
  className = '',
}) => {
  const { showToast } = useToast();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [uploading, setSubmitting] = useState(false);

  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
      showToast('Only JPG, PNG, WEBP, and SVG files are supported.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const result = await mediaService.uploadImage(file);
      onChange(result.url);
      showToast('Image uploaded and set successfully!', 'success');
    } catch (err: any) {
      showToast('Upload failed: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-zinc-300 block">
          {label}
        </label>
      )}

      {/* Image Preview & Input Controls Box */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3 space-y-3">
        {value ? (
          <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 h-36 group">
            <img
              src={value}
              alt="Asset Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-zinc-900/90 text-white rounded-xl hover:text-[#C9A227] transition-colors"
                title="View Full Resolution"
              >
                <Eye className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setLibraryOpen(true)}
                className="p-2 bg-[#C9A227] text-zinc-950 rounded-xl font-bold text-xs flex items-center gap-1 shadow-lg"
                title="Replace Image"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Replace
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 bg-rose-950/90 text-rose-300 rounded-xl hover:bg-rose-900 transition-colors"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-zinc-800 rounded-xl p-4 text-center text-xs text-zinc-400 bg-zinc-900/40">
            No image selected yet
          </div>
        )}

        {/* Input & Library Trigger Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]"
          />

          <div className="flex gap-2">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
              onChange={handleDirectFileUpload}
              className="hidden"
              id={`direct-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            />
            <label
              htmlFor={`direct-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#C9A227]/40 text-xs text-zinc-200 font-medium transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>{uploading ? 'Uploading...' : 'Upload'}</span>
            </label>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setLibraryOpen(true)}
              leftIcon={<ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" />}
            >
              Media Library
            </Button>
          </div>
        </div>
      </div>

      {/* Media Library Picker Modal */}
      <MediaLibraryModal
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelectImage={(url) => onChange(url)}
        title={`Select Image for ${label}`}
      />
    </div>
  );
};
