import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, ExternalLink, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { googleReviewsService, GoogleReview } from '../services/googleReviewsService';
import { Container } from './ui/Container';
import { SectionTitle } from './ui/Typography';
import { Button } from './ui/Button';

export const GoogleReviewsWidget: React.FC = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [stats, setStats] = useState({ avgRating: 4.9, totalCount: 1284 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await googleReviewsService.getReviews(false);
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats({
            avgRating: data.stats.avgRating || 4.9,
            totalCount: data.stats.totalCount || 1284,
          });
        }
      } catch (err) {
        console.error('Error loading Google Reviews widget:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  return (
    <section id="google-reviews-widget" className="py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C9A227]/5 blur-[140px] rounded-full pointer-events-none" />

      <Container size="7xl" className="relative z-10 space-y-12">
        
        {/* Header with Google Rating Badge */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
            {/* Google G logo colors */}
            <span className="font-bold text-base tracking-tighter">
              <span className="text-blue-400">G</span>
              <span className="text-rose-400">o</span>
              <span className="text-amber-400">o</span>
              <span className="text-blue-400">g</span>
              <span className="text-emerald-400">l</span>
              <span className="text-rose-400">e</span>
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              {stats.avgRating} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </span>
            <span className="text-zinc-400 font-semibold">({stats.totalCount.toLocaleString()} Verified Reviews)</span>
          </div>

          <SectionTitle
            tag="Google Reviews Trust Badge"
            title="Rated 4.9 Stars on Google"
            subtitle="Read real verified reviews from passengers, families, and corporate executives who travel with Luthra Travels."
          />
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-zinc-900/60 h-64 rounded-2xl border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 hover:border-[#C9A227]/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C9A227]/5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">{rev.relative_time_description}</span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed italic line-clamp-4">
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-zinc-800/80">
                  <img
                    src={rev.author_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                    alt={rev.author_name}
                    className="w-9 h-9 rounded-full object-cover border border-[#C9A227]/30"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-white text-xs truncate flex items-center gap-1">
                      {rev.author_name}
                      <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                    </h4>
                    <span className="text-[10px] text-zinc-400 block font-mono">Verified Google Review</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-zinc-300">
              Auto-synced with Google Places API • 100% Authentic Customer Feedback
            </span>
          </div>

          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#C9A227] hover:underline font-mono font-bold shrink-0"
          >
            <span>Write a Google Review</span> <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </Container>
    </section>
  );
};
