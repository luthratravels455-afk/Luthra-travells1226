import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../../types';
import { cmsService } from '../../services/cmsService';
import { useToast } from '../../contexts/ToastContext';
import {
  Image as ImageIcon,
  Video,
  Grid,
  List,
  Upload,
  Search,
  Copy,
  Trash2,
  Edit3,
  Eye,
  X,
  Check,
  Plus,
  FileImage,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

export const MediaLibrary: React.FC = () => {
  const { showToast } = useToast();
  const [mediaList, setMediaList] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'IMAGES' | 'VIDEOS'>('ALL');

  // Upload / Edit States
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Fleet');
  const [newUrl, setNewUrl] = useState('');
  const [altText, setAltText] = useState('');

  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await cmsService.getGallery();
      setMediaList(data);
    } catch (err: any) {
      showToast('Error loading media: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newTitle) {
      showToast('Title and Media URL are required.', 'error');
      return;
    }

    try {
      await cmsService.createGalleryItem({
        title: newTitle.trim(),
        category: newCategory,
        image_url: newUrl.trim(),
      });
      showToast('Media added to library', 'success');
      setUploadModalOpen(false);
      setNewTitle('');
      setNewUrl('');
      setAltText('');
      loadGallery();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Remove media file from library?')) return;
    try {
      await cmsService.deleteGalleryItem(id);
      showToast('Media file removed', 'info');
      if (selectedMedia?.id === id) setSelectedMedia(null);
      loadGallery();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleCopyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Media URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Search & Filter
  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());

    const isVideo = m.image_url.includes('.mp4') || m.image_url.includes('video');
    const matchesType =
      typeFilter === 'ALL' ||
      (typeFilter === 'IMAGES' && !isVideo) ||
      (typeFilter === 'VIDEOS' && isVideo);

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#C9A227]" /> Media Library Manager
          </h2>
          <p className="text-xs text-zinc-400">Upload, organize, and copy image assets for vehicles and blog posts.</p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => setUploadModalOpen(true)}
          leftIcon={<Upload className="w-4 h-4" />}
        >
          Upload Asset
        </Button>
      </div>

      {/* Control Bar */}
      <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search assets by title or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
            {(['ALL', 'IMAGES', 'VIDEOS'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  typeFilter === type ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-zinc-400">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-zinc-800 text-[#C9A227]' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-zinc-800 text-[#C9A227]' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Display */}
      {filteredMedia.length === 0 ? (
        <EmptyState
          title="No Media Assets"
          description="Upload vehicle photos or background banners to fill your media library."
          actionText="Upload Asset"
          onAction={() => setUploadModalOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((m) => (
            <div
              key={m.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative group hover:border-[#C9A227]/40 transition-all"
            >
              <div className="relative h-32 bg-zinc-950 overflow-hidden">
                <img
                  src={m.image_url}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 bg-zinc-950/80 text-[#C9A227] text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-[#C9A227]/30">
                  {m.category}
                </span>
              </div>

              <div className="p-2.5 space-y-1">
                <span className="text-xs font-semibold text-white truncate block">{m.title}</span>
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleCopyUrl(m.image_url, m.id)}
                    className="text-[10px] text-zinc-400 hover:text-[#C9A227] flex items-center gap-1 font-mono"
                  >
                    {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === m.id ? 'Copied' : 'URL'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedMedia(m)}
                    className="text-zinc-400 hover:text-white p-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-[#C9A227] font-mono border-b border-zinc-800">
              <tr>
                <th className="p-3">Asset</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">URL</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {filteredMedia.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-800/40">
                  <td className="p-3">
                    <img src={m.image_url} alt={m.title} className="w-12 h-10 object-cover rounded-lg" />
                  </td>
                  <td className="p-3 font-semibold text-white">{m.title}</td>
                  <td className="p-3 font-mono">{m.category}</td>
                  <td className="p-3 font-mono text-[11px] text-zinc-400 max-w-xs truncate">{m.image_url}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleCopyUrl(m.image_url, m.id)}
                      className="p-1.5 bg-zinc-800 text-zinc-200 hover:text-[#C9A227] rounded-lg"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 bg-rose-950/60 text-rose-300 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleUpload}
            className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#C9A227]">Upload Asset to Library</h3>
              <button type="button" onClick={() => setUploadModalOpen(false)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Innova Crysta Front View"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Category / Tag</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Fleet">Fleet</option>
                  <option value="Airport">Airport</option>
                  <option value="Executive">Executive</option>
                  <option value="Banner">Banner</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Image or Media URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  placeholder="Descriptive text for screen readers"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
              <Button type="button" variant="secondary" size="sm" onClick={() => setUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm">
                Save to Library
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Preview Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-white text-base">{selectedMedia.title}</h3>
              <button onClick={() => setSelectedMedia(null)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <img
              src={selectedMedia.image_url}
              alt={selectedMedia.title}
              className="w-full h-64 object-cover rounded-2xl"
            />

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1 text-xs font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="text-[#C9A227]">{selectedMedia.category}</span>
              </div>
              <div className="flex justify-between">
                <span>URL:</span>
                <span className="truncate max-w-[280px] text-white">{selectedMedia.image_url}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopyUrl(selectedMedia.image_url, selectedMedia.id)}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
