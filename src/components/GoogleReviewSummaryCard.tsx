import React from 'react';
import { Star, ShieldCheck, Sparkles } from 'lucide-react';

export interface GoogleReviewSummaryProps {
  rating?: number;
  totalReviews?: string;
  badgeText?: string;
  className?: string;
}

export const GoogleReviewSummaryCard: React.FC<GoogleReviewSummaryProps> = ({
  rating = 4.9,
  totalReviews = '100+',
  badgeText = 'Google Verified Reviews',
  className = '',
}) => {
  return (
    <div
      itemScope
      itemType="https://schema.org/AggregateRating"
      className={`bg-zinc-900/90 backdrop-blur-xl border border-[#C9A227]/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden ${className}`}
    >
      <meta itemProp="ratingValue" content={String(rating)} />
      <meta itemProp="bestRating" content="5" />
      <meta itemProp="reviewCount" content="120" />

      {/* Left: Google Badge Logo & Score */}
      <div className="flex items-center gap-5 text-center sm:text-left">
        <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner">
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </div>

        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-serif text-3xl font-extrabold text-white font-mono">{rating}</span>
            <div className="flex items-center gap-1 text-[#C9A227]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
              ))}
            </div>
          </div>
          <span className="text-xs text-zinc-400 font-mono block mt-0.5">
            Based on {totalReviews} Happy Customer Reviews
          </span>
        </div>
      </div>

      {/* Right: Verified Badge & Callout */}
      <div className="flex flex-col sm:items-end items-center text-center sm:text-right gap-1 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-4 sm:pt-0 sm:pl-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> {badgeText}
        </span>
        <span className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
          <Sparkles className="w-3 h-3 text-[#C9A227]" /> 100% Verified Passenger Feedback
        </span>
      </div>
    </div>
  );
};
