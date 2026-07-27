import React, { useState, useRef, useEffect } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Trash2, RefreshCw, Check, X, Loader2, Sparkles } from 'lucide-react';
import supabase from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { cmsService } from '../../services/cmsService';
import { GalleryItem } from '../../types';

export interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  category?: string;
  placeholder?: string;
  className?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label = 'Vehicle / Cover Image',
  category = 'Fleet',
  placeholder = 'https://images.unsplash.com/... or upload from device',
  className = '',
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [libraryItems, setLibraryItems] = useState<GalleryItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  // Supported image MIME types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];

  const loadMediaLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const items = await cmsService.getGallery();
      setLibraryItems(items);
    } catch (err) {
      console.error('Failed to load media library:', err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (mediaLibraryOpen) {
      loadMediaLibrary();
    }
  }, [mediaLibraryOpen]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!allowedTypes.includes(file.type)) {
      showToast('Invalid file format. Please upload JPG, PNG, WEBP, or SVG images.', 'error');
      return;
    }

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds 10MB. Please choose a smaller image.', 'error');
      return;
    }

    setSubmitting(true);
    setProgress(20);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      setProgress(50);

      // Upload to Supabase Storage Bucket
      const { data, error } = await supabase.storage
        .from('luthra-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      setProgress(80);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('luthra-media')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Auto insert into Gallery Media Library
      try {
        await cmsService.createGalleryItem({
          title: file.name.split('.')[0],
          category: category,
          image_url: publicUrl,
        });
      } catch (e) {
        console.warn('Auto media library catalog warning:', e);
      }

      setProgress(100);
      onChange(publicUrl);
      showToast('Image uploaded successfully to Supabase Storage!', 'success');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      showToast('Upload failed: ' + (err.message || 'Error uploading file'), 'error');
    } finally {
      setSubmitting(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
          <span>{label}</span>
          {value && (
            <span className="text-[10px] text-emerald-400 font-mono font-normal flex items-center gap-1">
              <Check className="w-3 h-3" /> Image Active
            </span>
          )}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
      />

      {/* URL Input + Upload Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
          />
          <LinkIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-[#C9A227] hover:bg-[#b8911d] text-zinc-950 font-bold text-xs uppercase px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-[#C9A227]/10 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading... {progress}%</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMediaLibraryOpen(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-[#C9A227]/40 text-xs font-medium px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Media Library</span>
          </button>
        </div>
      </div>

      {/* Live Image Preview Box */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 p-2 flex items-center gap-3 group">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
            <img
              src={value}
              alt="Live Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-zinc-400 font-mono block truncate">
              {value}
            </span>
            <span className="text-[10px] text-[#C9A227] font-semibold block pt-0.5">
              Live Preview Ready
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 pr-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              title="Replace Image"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C9A227]" />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors"
              title="Remove Image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Media Library Selector Modal */}
      {mediaLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[85vh] flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <h3 className="font-serif text-lg font-bold text-white">Select Image from Media Library</h3>
              </div>
              <button
                type="button"
                onClick={() => setMediaLibraryOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-950 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingLibrary ? (
              <div className="py-12 text-center text-xs text-zinc-400 font-mono">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C9A227]" />
                Loading Media Catalog...
              </div>
            ) : libraryItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-400 space-y-2">
                <p>No media files found in library.</p>
                <button
                  type="button"
                  onClick={() => {
                    setMediaLibraryOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="text-[#C9A227] font-semibold underline"
                >
                  Upload New Image Now
                </button>
              </div>
            ) : (
              <div className="overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 p-1 max-h-[50vh]">
                {libraryItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onChange(item.image_url);
                      setMediaLibraryOpen(false);
                      showToast('Image selected from Media Library!', 'success');
                    }}
                    className="relative group rounded-xl overflow-hidden border border-zinc-800 hover:border-[#C9A227] bg-zinc-950 cursor-pointer h-28 transition-all"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-[10px] text-white">
                      <span className="font-semibold truncate">{item.title}</span>
                      <span className="text-[#C9A227] font-mono">Click to Select</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => {
                  setMediaLibraryOpen(false);
                  fileInputRef.current?.click();
                }}
                className="text-[#C9A227] hover:underline font-semibold flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Upload New File
              </button>

              <button
                type="button"
                onClick={() => setMediaLibraryOpen(false)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
