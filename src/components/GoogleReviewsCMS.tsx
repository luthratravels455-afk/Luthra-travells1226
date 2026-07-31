import React, { useState, useEffect } from 'react';
import { Star, RefreshCw, CheckCircle2, XCircle, Trash2, Eye, EyeOff, Sparkles, ExternalLink } from 'lucide-react';
import { googleReviewsService, GoogleReview } from '../services/googleReviewsService';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/Button';

export const GoogleReviewsCMS: React.FC = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [stats, setStats] = useState({ avgRating: 4.9, totalCount: 1284, approvedCount: 0, featuredCount: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await googleReviewsService.getReviews(true);
      setReviews(data.reviews || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      showToast('Error loading Google Reviews: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleAutoSync = async () => {
    setSyncing(true);
    try {
      const res = await googleReviewsService.syncReviews();
      showToast(res.message || 'Synced latest verified Google Reviews', 'success');
      loadReviews();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleApprove = async (review: GoogleReview) => {
    try {
      await googleReviewsService.updateReview(review.id, { is_approved: !review.is_approved });
      showToast(review.is_approved ? 'Review Hidden from live site' : 'Review Approved & Displayed', 'success');
      loadReviews();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleFeatured = async (review: GoogleReview) => {
    try {
      await googleReviewsService.updateReview(review.id, { is_featured: !review.is_featured });
      showToast(review.is_featured ? 'Removed from Featured' : 'Marked as Featured Review', 'success');
      loadReviews();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Delete this Google Review permanently?')) return;
    try {
      await googleReviewsService.deleteReview(id);
      showToast('Review deleted', 'info');
      loadReviews();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Top Header & Stats */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest block">
              Google Places API Integration
            </span>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
              Google Reviews Management Desk
            </h2>
            <p className="text-zinc-400 text-xs mt-1">
              Auto-sync verified Google Reviews, approve/hide customer feedback, and feature 5-star testimonials.
            </p>
          </div>

          <Button
            variant="gold"
            size="sm"
            isLoading={syncing}
            onClick={handleAutoSync}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {syncing ? 'Syncing Places API...' : 'Auto-Sync Google Reviews'}
          </Button>
        </div>

        {/* Rating Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-0.5">
            <span className="text-[10px] text-zinc-400 block uppercase font-mono">Average Google Rating</span>
            <span className="text-2xl font-serif font-bold text-[#C9A227] font-mono flex items-center gap-1">
              {stats.avgRating} <Star className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
            </span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-0.5">
            <span className="text-[10px] text-zinc-400 block uppercase font-mono">Total Google Reviews</span>
            <span className="text-2xl font-serif font-bold text-white font-mono">{stats.totalCount.toLocaleString()}</span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-2xl border border-emerald-500/30 space-y-0.5">
            <span className="text-[10px] text-emerald-400 block uppercase font-mono">Approved &amp; Live</span>
            <span className="text-2xl font-serif font-bold text-emerald-300 font-mono">{stats.approvedCount}</span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-2xl border border-blue-500/30 space-y-0.5">
            <span className="text-[10px] text-blue-400 block uppercase font-mono">Featured On Homepage</span>
            <span className="text-2xl font-serif font-bold text-blue-300 font-mono">{stats.featuredCount}</span>
          </div>
        </div>
      </div>

      {/* Reviews Management Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
            <tr>
              <th className="p-3.5">Reviewer</th>
              <th className="p-3.5">Rating</th>
              <th className="p-3.5">Review Content</th>
              <th className="p-3.5">Source</th>
              <th className="p-3.5">Approval Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500 font-mono">
                  Loading Google Reviews from Supabase...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500 font-mono">
                  No Google Reviews found. Click "Auto-Sync Google Reviews" above to pull latest feedback.
                </td>
              </tr>
            ) : (
              reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-3.5 font-medium text-white">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.author_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                        alt={rev.author_name}
                        className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                      />
                      <div>
                        <span className="font-bold text-white block">{rev.author_name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono block">{rev.relative_time_description}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </td>

                  <td className="p-3.5 max-w-sm leading-relaxed text-zinc-300">
                    <p className="line-clamp-3 font-sans italic">"{rev.text}"</p>
                  </td>

                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-500/30">
                      <CheckCircle2 className="w-3 h-3 text-blue-400" /> Google
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleToggleApprove(rev)}
                        className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full cursor-pointer transition-all ${
                          rev.is_approved
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60'
                            : 'bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900/60'
                        }`}
                      >
                        {rev.is_approved ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-rose-400" />}
                        {rev.is_approved ? 'Approved (Live)' : 'Hidden (Draft)'}
                      </button>

                      {rev.is_approved && (
                        <button
                          onClick={() => handleToggleFeatured(rev)}
                          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full cursor-pointer transition-all ${
                            rev.is_featured
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                              : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                          }`}
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          {rev.is_featured ? 'Featured' : 'Mark Featured'}
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 bg-rose-950/60 text-rose-300 rounded hover:bg-rose-900 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
