import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Search,
  Grid,
  List,
  Copy,
  Trash2,
  Check,
  Image as ImageIcon,
  FileImage,
  Sparkles,
  ExternalLink,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { mediaService, MediaItem } from '../services/mediaService';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/Button';

export interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string) => void;
  title?: string;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Media Library & Asset Manager',
}) => {
  const { showToast } = useToast();
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedItemUrl, setSelectedItemUrl] = useState<string | null>(null);

  // Pre-stocked default curated assets if library is empty
  const defaultAssets: MediaItem[] = [
    {
      name: 'Toyota Innova Crysta',
      url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
      category: 'Fleet',
    },
    {
      name: 'Maruti Ertiga',
      url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
      category: 'Fleet',
    },
    {
      name: 'Honda Amaze',
      url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
      category: 'Fleet',
    },
    {
      name: 'Maruti Dzire',
      url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop',
      category: 'Fleet',
    },
    {
      name: 'Taj Mahal Yamuna Expressway Route',
      url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop',
      category: 'Articles',
    },
    {
      name: 'IGI Airport Terminal 3 Pickups',
      url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop',
      category: 'Airport',
    },
  ];

  const loadMedia = async () => {
    setLoading(true);
    try {
      const items = await mediaService.getAllMedia();
      if (items && items.length > 0) {
        setMediaList(items);
      } else {
        setMediaList(defaultAssets);
      }
    } catch (err) {
      console.error('Error loading media library:', err);
      setMediaList(defaultAssets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setSubmitting(true);

    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
        showToast(`Skipped ${file.name}: Only JPG, PNG, WEBP, SVG files are supported.`, 'error');
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        showToast(`Skipped ${file.name}: Maximum file size is 10MB.`, 'error');
        continue;
      }

      try {
        const result = await mediaService.uploadImage(file);
        successCount++;
        setMediaList((prev) => [
          { name: file.name, url: result.url, created_at: new Date().toISOString() },
          ...prev,
        ]);
      } catch (err: any) {
        showToast(`Failed to upload ${file.name}: ${err.message}`, 'error');
      }
    }

    if (successCount > 0) {
      showToast(`Successfully uploaded ${successCount} media asset(s)!`, 'success');
      loadMedia();
    }
    setSubmitting(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Image URL copied to clipboard!', 'success');
  };

  const handleDeleteMedia = async (item: MediaItem) => {
    if (!window.confirm(`Delete "${item.name}" from Media Library? Warning: If this image is used on a page, it may become unavailable.`)) return;

    try {
      await mediaService.deleteMedia(item.name || item.url);
      setMediaList((prev) => prev.filter((m) => m.url !== item.url));
      showToast('Media file deleted from storage.', 'info');
    } catch (err: any) {
      showToast('Error deleting media: ' + err.message, 'error');
    }
  };

  const filteredMedia = mediaList.filter((m) =>
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-5xl w-full h-[85vh] overflow-hidden shadow-2xl shadow-black relative flex flex-col justify-between animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">{title}</h2>
              <p className="text-xs text-zinc-400 font-mono">Upload, search, select, or manage persistent media assets</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              dragActive
                ? 'border-[#C9A227] bg-[#C9A227]/10'
                : 'border-zinc-800 hover:border-[#C9A227]/40 bg-zinc-950/40'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="media-library-file-input"
            />
            <label htmlFor="media-library-file-input" className="cursor-pointer space-y-2 block">
              <Upload className="w-8 h-8 text-[#C9A227] mx-auto animate-bounce duration-1000" />
              <div>
                <span className="text-sm font-bold text-white block">
                  {uploading ? 'Uploading Asset...' : 'Click or Drag & Drop Images Here'}
                </span>
                <span className="text-xs text-zinc-400">
                  Supports JPG, PNG, WEBP, SVG (Max 10MB per file)
                </span>
              </div>
            </label>
          </div>

          {/* Search & Toolbar Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search media files by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-400 hover:bg-zinc-800'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  viewMode === 'list' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-400 hover:bg-zinc-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media Grid / List Display */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-zinc-950 h-40 rounded-2xl border border-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((item, idx) => {
                const isSelected = selectedItemUrl === item.url;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedItemUrl(item.url)}
                    className={`group relative rounded-2xl overflow-hidden border bg-zinc-950 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-[#C9A227] ring-2 ring-[#C9A227]/50 shadow-xl shadow-[#C9A227]/10'
                        : 'border-zinc-800 hover:border-[#C9A227]/40'
                    }`}
                  >
                    <div className="h-36 overflow-hidden bg-zinc-950 relative">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#C9A227] text-zinc-950 p-1 rounded-full shadow-lg">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="p-3 space-y-1">
                      <span className="text-xs font-semibold text-white truncate block">{item.name}</span>
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(item.url);
                          }}
                          className="text-[11px] text-[#C9A227] hover:underline flex items-center gap-1 font-mono"
                        >
                          <Copy className="w-3 h-3" /> Copy URL
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMedia(item);
                          }}
                          className="text-zinc-500 hover:text-rose-400 p-1"
                          title="Delete File"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Preview</th>
                    <th className="p-3">File Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {filteredMedia.map((item, idx) => (
                    <tr
                      key={idx}
                      onClick={() => setSelectedItemUrl(item.url)}
                      className={`hover:bg-zinc-900/60 cursor-pointer ${
                        selectedItemUrl === item.url ? 'bg-[#C9A227]/10' : ''
                      }`}
                    >
                      <td className="p-3">
                        <img src={item.url} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-zinc-800" />
                      </td>
                      <td className="p-3 font-semibold text-white">{item.name}</td>
                      <td className="p-3 font-mono text-zinc-400">{item.category || 'General'}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(item.url);
                          }}
                          className="text-[#C9A227] hover:underline font-mono"
                        >
                          Copy
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMedia(item);
                          }}
                          className="text-rose-400 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono">
            {selectedItemUrl ? 'Selected image ready for form assignment' : 'Click any image to select'}
          </span>

          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {onSelectImage && (
              <Button
                variant="gold"
                size="sm"
                disabled={!selectedItemUrl}
                onClick={() => {
                  if (selectedItemUrl) {
                    onSelectImage(selectedItemUrl);
                    onClose();
                  }
                }}
                rightIcon={<Check className="w-4 h-4" />}
              >
                Apply Image Selection
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
