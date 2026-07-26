import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, RefreshCw, Check, AlertCircle, FileImage } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  onOpenMediaLibrary?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Image Asset',
  helperText = 'Upload an image file (JPG, PNG, WEBP max 5MB) or paste a URL.',
  onOpenMediaLibrary,
}) => {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = async (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setError('Invalid format. Please upload JPG, PNG, WEBP, or SVG.');
      showToast('Invalid file format', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      showToast('File size exceeds 5MB limit', 'error');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileBase64: base64,
            contentType: file.type,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        onChange(data.url);
        setUrlInput(data.url);
        showToast('Image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      showToast('Image URL applied', 'success');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <FileImage className="w-3.5 h-3.5 text-[#C9A227]" /> {label}
        </label>
        {onOpenMediaLibrary && (
          <button
            type="button"
            onClick={onOpenMediaLibrary}
            className="text-[11px] font-mono text-[#C9A227] hover:underline flex items-center gap-1"
          >
            <ImageIcon className="w-3 h-3" /> Select from Library
          </button>
        )}
      </div>

      {/* Tabs: File Upload vs URL */}
      <div className="flex gap-2 border-b border-zinc-800 pb-2">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
            tab === 'upload' ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
            tab === 'url' ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" /> Image URL
        </button>
      </div>

      {/* Upload Dropzone Tab */}
      {tab === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#C9A227] bg-[#C9A227]/10'
              : value
              ? 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
              : 'border-zinc-800 hover:border-[#C9A227]/50 bg-zinc-950'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="hidden"
          />

          {uploading ? (
            <div className="py-4 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#C9A227] mx-auto" />
              <p className="text-xs text-zinc-300 font-mono">Uploading image to cloud storage...</p>
            </div>
          ) : value ? (
            <div className="flex items-center gap-4 text-left p-1" onClick={(e) => e.stopPropagation()}>
              <img src={value} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-zinc-700 shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Image Active
                </span>
                <p className="text-[11px] text-zinc-400 font-mono truncate">{value}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => { onChange(''); setUrlInput(''); }}
                    className="text-[10px] font-mono bg-rose-950/60 hover:bg-rose-900 text-rose-300 px-2.5 py-1 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-[#C9A227]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">
                  Click to browse or drag &amp; drop image here
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">JPG, PNG, WEBP, or SVG up to 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL Input Tab */}
      {tab === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="bg-[#C9A227] hover:bg-[#b8911d] text-zinc-950 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
            >
              Apply
            </button>
          </div>

          {value && (
            <div className="flex items-center gap-3 p-2 bg-zinc-950 rounded-xl border border-zinc-800">
              <img src={value} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-zinc-700" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-zinc-400 font-mono block truncate">{value}</span>
              </div>
              <button
                type="button"
                onClick={() => { onChange(''); setUrlInput(''); }}
                className="text-zinc-500 hover:text-rose-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-[10px] text-zinc-500">{helperText}</p>
      )}
    </div>
  );
};
