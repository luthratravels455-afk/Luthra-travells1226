import React, { useState } from 'react';
import { BlogPost } from '../../types';
import { blogService } from '../../services/blogService';
import { useToast } from '../../contexts/ToastContext';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

export interface BlogManagerProps {
  blogs: BlogPost[];
  onRefresh: () => void;
}

export const BlogManager: React.FC<BlogManagerProps> = ({ blogs, onRefresh }) => {
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  // Modal / Form States
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null);
  const [saving, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ['ALL', 'Travel Guide', 'Corporate Mobility', 'Fleet & Maintenance', 'Route Highlights'];

  // Filter Logic
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || b.category === selectedCategory;

    const isPublished = b.is_published !== false;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && isPublished) ||
      (statusFilter === 'DRAFT' && !isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTogglePublish = async (blog: BlogPost) => {
    try {
      const updatedStatus = !blog.is_published;
      await blogService.updateBlog(blog.id, { is_published: updatedStatus });
      showToast(
        `Article "${blog.title}" is now ${updatedStatus ? 'Published' : 'Draft'}`,
        'success'
      );
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      await blogService.deleteBlog(id);
      showToast('Article deleted', 'info');
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    if (!editingBlog.title || !editingBlog.content) {
      showToast('Title and content are required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const slug =
        editingBlog.slug ||
        editingBlog.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

      const payload: Partial<BlogPost> = {
        ...editingBlog,
        slug,
        category: editingBlog.category || 'Travel Guide',
        author: editingBlog.author || 'Luthra Editorial Desk',
        read_time: editingBlog.read_time || '5 min read',
        publish_date: editingBlog.publish_date || new Date().toISOString().split('T')[0],
        cover_image:
          editingBlog.cover_image ||
          'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop',
        is_published: editingBlog.is_published !== false,
      };

      if (editingBlog.id) {
        await blogService.updateBlog(editingBlog.id, payload);
        showToast('Blog article updated', 'success');
      } else {
        await blogService.createBlog(payload);
        showToast('New blog article published', 'success');
      }

      setEditingBlog(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#C9A227]" /> Blog &amp; Travel Articles
          </h2>
          <p className="text-xs text-zinc-400">Manage travel guides, C-suite insights, and SEO news articles.</p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() =>
            setEditingBlog({
              title: '',
              excerpt: '',
              content: '',
              category: 'Travel Guide',
              author: 'Luthra Editorial Desk',
              read_time: '5 min read',
              publish_date: new Date().toISOString().split('T')[0],
              cover_image:
                'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop',
              is_published: true,
            })
          }
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Article
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                selectedCategory === cat ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Toggle */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
          {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg ${
                statusFilter === st ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {paginatedBlogs.length === 0 ? (
        <EmptyState
          title="No Articles Found"
          description="Try adjusting your search terms or publish a new travel guide."
          actionText="Create Article"
          onAction={() =>
            setEditingBlog({
              title: '',
              excerpt: '',
              content: '',
              category: 'Travel Guide',
              author: 'Luthra Editorial Desk',
              is_published: true,
            })
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBlogs.map((post) => {
            const isPub = post.is_published !== false;
            return (
              <div
                key={post.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#C9A227]/40 transition-all group"
              >
                {/* Image Cover */}
                <div className="relative h-44 bg-zinc-950 overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#C9A227] text-zinc-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono">
                    {post.category}
                  </span>
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                      isPub
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {isPub ? 'Published' : 'Draft'}
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-base font-bold text-white leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#C9A227]" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C9A227]" /> {post.read_time}
                    </span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setPreviewBlog(post)}
                    className="text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C9A227]" /> Preview
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingBlog(post)}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded-lg"
                      title="Edit Article"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-zinc-800 text-xs text-zinc-400">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleSaveBlog}
            className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-3xl max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                {editingBlog.id ? 'Edit Blog Article' : 'Create New Article'}
              </h3>
              <button type="button" onClick={() => setEditingBlog(null)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingBlog.title || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  placeholder="e.g. The Ultimate Delhi to Agra Luxury Road Trip Guide"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Category</label>
                  <select
                    value={editingBlog.category || 'Travel Guide'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Travel Guide">Travel Guide</option>
                    <option value="Corporate Mobility">Corporate Mobility</option>
                    <option value="Fleet & Maintenance">Fleet &amp; Maintenance</option>
                    <option value="Route Highlights">Route Highlights</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={editingBlog.author || 'Luthra Editorial Desk'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingBlog.cover_image || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, cover_image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={editingBlog.excerpt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  placeholder="Summary snippet displayed on blog cards..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Article Body Content *</label>
                <textarea
                  rows={8}
                  required
                  value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  placeholder="Write full article text here..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={editingBlog.is_published !== false}
                  onChange={(e) => setEditingBlog({ ...editingBlog, is_published: e.target.checked })}
                  className="w-4 h-4 accent-[#C9A227]"
                />
                <label htmlFor="pub-check" className="text-xs text-zinc-300 font-semibold">
                  Publish Article Immediately
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditingBlog(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm" isLoading={saving}>
                Save Article
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <Badge variant="gold">{previewBlog.category}</Badge>
              <button onClick={() => setPreviewBlog(null)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <h2 className="font-serif text-2xl font-bold text-white">{previewBlog.title}</h2>
            <div className="text-xs text-zinc-400 font-mono">
              By {previewBlog.author} • {previewBlog.read_time} • {previewBlog.publish_date}
            </div>

            <img
              src={previewBlog.cover_image}
              alt={previewBlog.title}
              className="w-full h-56 object-cover rounded-2xl"
            />

            <p className="text-sm italic text-[#C9A227] font-medium border-l-2 border-[#C9A227] pl-3">
              {previewBlog.excerpt}
            </p>

            <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line border-t border-zinc-800 pt-3">
              {previewBlog.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
