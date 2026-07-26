import React from 'react';
import { Star, ShieldCheck, Quote, MapPin, Calendar, Compass } from 'lucide-react';
import { Testimonial } from '../types';
import { Badge } from './ui/Badge';

export interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  className = '',
}) => {
  const rating = testimonial.rating || 5;
  const travelType = testimonial.title_role || 'Verified Customer';

  return (
    <div
      itemScope
      itemType="https://schema.org/Review"
      className={`bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 hover:border-[#C9A227]/40 rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C9A227]/5 group ${className}`}
    >
      <Quote className="w-10 h-10 text-[#C9A227]/10 absolute top-4 right-4 pointer-events-none" />

      {/* Header Info */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between gap-2">
          {/* Star Rating */}
          <div
            className="flex items-center gap-1 text-[#C9A227]"
            itemProp="reviewRating"
            itemScope
            itemType="https://schema.org/Rating"
          >
            <meta itemProp="ratingValue" content={String(rating)} />
            <meta itemProp="bestRating" content="5" />
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? 'fill-[#C9A227] text-[#C9A227]' : 'text-zinc-700 fill-zinc-800'
                }`}
              />
            ))}
          </div>

          {/* Travel Type Badge */}
          <Badge variant="gold">
            {travelType}
          </Badge>
        </div>

        {/* Review Comment */}
        <p itemProp="reviewBody" className="text-zinc-300 text-xs sm:text-sm leading-relaxed italic">
          "{testimonial.comment}"
        </p>
      </div>

      {/* Footer Info: Photo, Name, City, Date, Verified Badge */}
      <div className="flex items-center justify-between gap-3 pt-5 mt-4 border-t border-zinc-800/80 relative z-10">
        <div className="flex items-center gap-3" itemProp="author" itemScope itemType="https://schema.org/Person">
          <img
            src={
              testimonial.avatar_url ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
            }
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover border border-[#C9A227]/30 shrink-0"
          />
          <div>
            <h4 itemProp="name" className="text-white text-xs sm:text-sm font-bold font-serif flex items-center gap-1">
              {testimonial.name}
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </h4>
            
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
              {testimonial.city && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5 text-[#C9A227]" /> {testimonial.city}
                </span>
              )}
              {testimonial.date && (
                <span className="flex items-center gap-0.5">
                  <Calendar className="w-2.5 h-2.5 text-zinc-500" /> {testimonial.date}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Verified Badge Icon */}
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
          <ShieldCheck className="w-3 h-3" /> Verified
        </span>
      </div>
    </div>
  );
};
