import React, { useState, useEffect } from 'react';
import { X, Search, Copy, Check, Trash2, Image as ImageIcon, Grid, List, Plus } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { GalleryItem } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { ImageUploader } from './ImageUploader';

export interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadUrl, setUploadUrl] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await cmsService.getGallery();
      setItems(data);
    } catch (err) {
      console.error('Error loading media library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadMedia();
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyUrl = (id: number, url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Image URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this image permanently?')) return;
    try {
      await cmsService.deleteGalleryItem(id);
      showToast('Media deleted', 'info');
      loadMedia();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleNewUploadSuccess = async (url: string) => {
    setUploadUrl(url);
    await loadMedia();
    onSelectImage(url);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-4xl w-full h-[80vh] flex flex-col justify-between overflow-hidden shadow-2xl shadow-black relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Media Assets Library</h3>
              <p className="text-xs text-zinc-400">Select an existing image or upload a new asset to use.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-950 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar Bar */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search images by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#C9A227] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs ${viewMode === 'grid' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-400 bg-zinc-900'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs ${viewMode === 'list' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-400 bg-zinc-900'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Quick Upload Dropzone */}
          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-wider block mb-2">Upload New Media Asset</span>
            <ImageUploader
              value={uploadUrl}
              onChange={handleNewUploadSuccess}
              helperText="Upload image and select immediately."
            />
          </div>

          {/* Media Grid / List */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-zinc-950 h-36 rounded-xl border border-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-semibold text-zinc-300">No media assets found</p>
              <p className="text-xs text-zinc-500">Upload a new file using the dropzone above.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectImage(item.image_url);
                    onClose();
                  }}
                  className="group relative bg-zinc-950 border border-zinc-800 hover:border-[#C9A227] rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:shadow-[#C9A227]/10"
                >
                  <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover" />
                  <div className="p-2 space-y-0.5 bg-zinc-900">
                    <span className="text-[10px] text-[#C9A227] font-mono block truncate">{item.category}</span>
                    <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                  </div>

                  {/* Actions Hover Overlay */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCopyUrl(item.id, item.image_url, e)}
                      className="p-1.5 bg-zinc-900/90 text-zinc-300 hover:text-white rounded-lg border border-zinc-700"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 bg-rose-950/90 text-rose-300 hover:text-rose-200 rounded-lg border border-rose-800"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectImage(item.image_url);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 hover:border-[#C9A227] rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.image_url} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                      <span className="text-[10px] text-[#C9A227] font-mono">{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleCopyUrl(item.id, item.image_url, e)}
                      className="p-1.5 bg-zinc-900 text-zinc-300 rounded-lg border border-zinc-800 text-xs"
                    >
                      {copiedId === item.id ? 'Copied' : 'Copy Link'}
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 bg-rose-950/60 text-rose-300 rounded-lg border border-rose-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
          <span>{filtered.length} Media Assets Available</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
