import React, { useState, useEffect } from 'react';
import { X, Search, Check, Image as ImageIcon, Grid, List, Trash2, Copy, ExternalLink, Plus } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { GalleryItem } from '../../types';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

export interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItemUrl, setSelectedItemUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await cmsService.getGallery();
      setItems(data);
    } catch (err: any) {
      console.error('Failed to load media items:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = ['ALL', 'Fleet', 'Hero', 'Blogs', 'Gallery', 'Testimonials', 'General'];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'ALL' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const handleConfirmSelect = () => {
    if (selectedItemUrl) {
      onSelectImage(selectedItemUrl);
      onClose();
    }
  };

  const handleCopyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    showToast('Public Image URL copied to clipboard!', 'success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fadeIn"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Media Library Explorer</h3>
              <p className="text-[11px] text-zinc-400 font-mono">Select existing uploaded media or asset URLs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search media files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#C9A227] text-zinc-950'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="flex border border-zinc-800 rounded-lg p-0.5 bg-zinc-950 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-zinc-800 text-[#C9A227]' : 'text-zinc-500'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-zinc-800 text-[#C9A227]' : 'text-zinc-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Media Container */}
        <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[420px] p-2 bg-zinc-950 rounded-2xl border border-zinc-800/80">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-zinc-400 text-xs font-mono">
              Syncing Media Library Assets...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-2 text-zinc-500 text-xs">
              <ImageIcon className="w-8 h-8 opacity-40" />
              <span>No media matching filters</span>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => {
                const isSelected = selectedItemUrl === item.image_url;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemUrl(item.image_url)}
                    className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all bg-zinc-900 ${
                      isSelected
                        ? 'border-[#C9A227] ring-2 ring-[#C9A227]/50 scale-[0.98]'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <div className="h-32 bg-zinc-950 relative">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#C9A227] text-zinc-950 rounded-full p-1 shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 flex justify-between items-center text-xs">
                      <span className="truncate font-medium text-white text-[11px]">{item.title}</span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyUrl(item.image_url, e)}
                        className="text-zinc-400 hover:text-[#C9A227] p-1 shrink-0"
                        title="Copy Public URL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80 text-xs">
              {filteredItems.map((item) => {
                const isSelected = selectedItemUrl === item.image_url;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemUrl(item.image_url)}
                    className={`flex items-center justify-between p-3 cursor-pointer hover:bg-zinc-900 transition-colors ${
                      isSelected ? 'bg-zinc-900/80 text-[#C9A227]' : 'text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image_url} alt={item.title} className="w-10 h-10 object-cover rounded-lg bg-zinc-900" />
                      <div>
                        <span className="font-semibold text-white block">{item.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{item.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCopyUrl(item.image_url, e)}
                        className="p-1.5 text-zinc-400 hover:text-[#C9A227]"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a href={item.image_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 text-zinc-400 hover:text-white">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Confirmation */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
          <span className="text-xs text-zinc-400 font-mono">
            {selectedItemUrl ? 'Asset Selected' : 'Click any asset to select'}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              disabled={!selectedItemUrl}
              onClick={handleConfirmSelect}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Use Selected Asset
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
