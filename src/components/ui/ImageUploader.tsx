import React, { useState, useRef, useEffect } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, RefreshCw, Check, Grid } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { GalleryItem } from '../../types';

export interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  label = 'Image',
  placeholder = 'Paste image URL or upload file below...',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'library'>('upload');
  const [urlInput, setUrlInput] = useState(value);
  const [dragOver, setDragOver] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(value);
  }, [value]);

  const loadGallery = async () => {
    if (galleryItems.length > 0) return;
    setLoadingGallery(true);
    try {
      const data = await cmsService.getGallery();
      setGalleryItems(data || []);
    } catch (err) {
      console.error('Error loading media library:', err);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
        setUrlInput(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
          <span>{label}</span>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setUrlInput('');
              }}
              className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove Image
            </button>
          )}
        </label>
      )}

      {/* Preview Box if value exists */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group h-40">
          <img src={value} alt="Uploaded Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C9A227]" /> Replace
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setUrlInput('');
              }}
              className="bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
          {/* Method Tabs */}
          <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-semibold font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'upload' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> File Upload
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'url' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Paste URL
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('library');
                loadGallery();
              }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'library' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Media Library
            </button>
          </div>

          {/* Tab 1: Upload / Drag & Drop */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-[#C9A227] bg-[#C9A227]/10' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40'
              }`}
            >
              <Upload className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
              <p className="text-xs font-semibold text-zinc-200">
                Click to Browse or Drag &amp; Drop Image Here
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">PNG, JPG, WEBP, SVG supported</p>
            </div>
          )}

          {/* Tab 2: Paste URL */}
          {activeTab === 'url' && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={placeholder}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="bg-[#C9A227] hover:bg-[#b8911d] text-zinc-950 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Apply
              </button>
            </div>
          )}

          {/* Tab 3: Media Library */}
          {activeTab === 'library' && (
            <div className="space-y-2">
              {loadingGallery ? (
                <div className="text-xs text-zinc-400 text-center py-4">Loading Media Library...</div>
              ) : galleryItems.length === 0 ? (
                <div className="text-xs text-zinc-500 text-center py-4">No Media Items found. Upload one above.</div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                  {galleryItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onChange(item.image_url);
                        setUrlInput(item.image_url);
                      }}
                      className="relative rounded-lg overflow-hidden border border-zinc-800 h-16 group hover:border-[#C9A227]"
                    >
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Check className="w-4 h-4 text-[#C9A227]" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
