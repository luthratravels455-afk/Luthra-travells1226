import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, RefreshCw, Check } from 'lucide-react';
import { Button } from './ui/Button';

export interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Image',
  className = '',
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, GIF)');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];

        // Send to /api/upload
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileBase64: base64Data,
            contentType: file.type,
          }),
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
          setUrlInput(data.url);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('File upload error:', err);
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" /> {label}
        </label>
        <div className="flex gap-1 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded ${mode === 'upload' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded ${mode === 'url' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            URL
          </button>
        </div>
      </div>

      {/* Image Preview if exists */}
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 h-36 group">
          <img src={value} alt="Uploaded Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#C9A227] text-zinc-950 font-bold text-xs rounded-lg flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-rose-900/80 text-rose-200 font-bold text-xs rounded-lg flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        </div>
      ) : mode === 'upload' ? (
        /* Drag & Drop Area */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-[#C9A227] bg-[#C9A227]/10' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
          <Upload className="w-8 h-8 text-[#C9A227] mx-auto mb-2 opacity-80" />
          <p className="text-xs font-semibold text-zinc-200">
            {uploading ? 'Uploading image...' : 'Click to Browse or Drag & Drop Image File'}
          </p>
          <span className="text-[10px] text-zinc-500 font-mono block mt-1">PNG, JPG, WebP up to 10MB</span>
        </div>
      ) : (
        /* Direct URL Mode */
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://images.unsplash.com/photo-..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2 bg-[#C9A227] text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1 shrink-0"
          >
            <Check className="w-3.5 h-3.5" /> Apply
          </button>
        </div>
      )}
    </div>
  );
};
