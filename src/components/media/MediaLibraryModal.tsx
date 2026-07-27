import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Grid,
  List,
  Upload,
  Check,
  Trash2,
  Copy,
  ExternalLink,
  Folder,
  Tag,
  RefreshCw,
} from 'lucide-react';
import { mediaService, MediaItem } from '../../services/mediaService';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

export interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  category?: string;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  category = 'All',
}) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const categories = ['All', 'Fleet', 'Blogs', 'Gallery', 'Testimonials', 'Branding', 'SEO'];

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await mediaService.getMediaItems();
      setItems(data || []);
    } catch (err: any) {
      console.error('Error loading media library:', err);
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

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      activeCategory === 'All' ||
      (item.category && item.category.toLowerCase().includes(activeCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await mediaService.uploadImage(files[i], activeCategory !== 'All' ? activeCategory : 'General');
      }
      showToast('Images uploaded to Media Library!', 'success');
      loadMedia();
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectAndClose = (url: string) => {
    onSelectImage(url);
    onClose();
  };

  const handleCopyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    showToast('Public Image URL copied to clipboard!', 'success');
  };

  const handleDeleteItem = async (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this file from Media Library?')) return;

    try {
      await mediaService.deleteMediaItem(name);
      showToast('Image deleted from library', 'info');
      loadMedia();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUrls.length === 0) return;
    if (!window.confirm(`Delete ${selectedUrls.length} selected items?`)) return;

    try {
      await mediaService.bulkDeleteMediaItems(selectedUrls);
      showToast('Selected items deleted', 'info');
      setSelectedUrls([]);
      loadMedia();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const toggleSelectUrl = (name: string) => {
    if (selectedUrls.includes(name)) {
      setSelectedUrls((prev) => prev.filter((n) => n !== name));
    } else {
      setSelectedUrls((prev) => [...prev, name]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-5xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
              Enterprise Asset Manager
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">Media Library</h2>
          </div>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="bg-[#C9A227] hover:bg-[#b8911d] text-zinc-950 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 transition-colors">
                <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Files'}
              </span>
            </label>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search images by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          {/* Folder Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg border ${
                viewMode === 'grid'
                  ? 'bg-[#C9A227] text-zinc-950 border-[#C9A227]'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg border ${
                viewMode === 'list'
                  ? 'bg-[#C9A227] text-zinc-950 border-[#C9A227]'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={loadMedia}
              className="p-2 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg"
              title="Refresh Media"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Bulk Bar */}
        {selectedUrls.length > 0 && (
          <div className="bg-[#C9A227]/10 border border-[#C9A227]/30 p-3 rounded-xl flex items-center justify-between text-xs text-[#C9A227]">
            <span>{selectedUrls.length} items selected</span>
            <button
              onClick={handleBulkDelete}
              className="bg-rose-950 border border-rose-500/40 text-rose-300 px-3 py-1 rounded-lg hover:bg-rose-900 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
            </button>
          </div>
        )}

        {/* Media Grid / List */}
        <div className="overflow-y-auto flex-1 max-h-[50vh] pr-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-zinc-950 h-32 rounded-xl border border-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-zinc-400">
              <p>No media files found matching filter.</p>
              <p className="text-xs">Upload new images using the button above.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectAndClose(item.url)}
                  className="group relative bg-zinc-950 border border-zinc-800 hover:border-[#C9A227]/60 rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] flex flex-col"
                >
                  <div className="h-28 overflow-hidden bg-black relative">
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    
                    {/* Select Overlay Button */}
                    <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAndClose(item.url);
                        }}
                        className="bg-[#C9A227] text-zinc-950 text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Select
                      </button>
                    </div>
                  </div>

                  <div className="p-2 space-y-1 bg-zinc-900 flex-1 flex flex-col justify-between">
                    <span className="text-[10px] text-zinc-300 truncate font-mono block">
                      {item.name}
                    </span>
                    <div className="flex justify-between items-center text-[9px] text-zinc-500 pt-1">
                      <span>{item.category || 'Media'}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => handleCopyUrl(item.url, e)}
                          className="hover:text-[#C9A227]"
                          title="Copy Public URL"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteItem(item.name, e)}
                          className="hover:text-rose-400"
                          title="Delete File"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 font-mono text-[10px] uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Preview</th>
                    <th className="p-3">File Name</th>
                    <th className="p-3">Folder</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {filteredItems.map((item, idx) => (
                    <tr
                      key={idx}
                      onClick={() => handleSelectAndClose(item.url)}
                      className="hover:bg-zinc-900/60 cursor-pointer"
                    >
                      <td className="p-2 w-16">
                        <img src={item.url} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                      </td>
                      <td className="p-3 font-mono font-medium text-white truncate max-w-xs">{item.name}</td>
                      <td className="p-3 text-zinc-400">{item.category || 'General'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectAndClose(item.url);
                          }}
                          className="bg-[#C9A227] text-zinc-950 text-xs font-bold px-3 py-1 rounded-lg mr-2"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
          <span>Total {filteredItems.length} files in view</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </div>
  );
};
