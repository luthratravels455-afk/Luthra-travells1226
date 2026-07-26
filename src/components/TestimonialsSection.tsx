import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionTitle } from './ui/Typography';
import { Container } from './ui/Container';
import { TestimonialCard } from './TestimonialCard';
import { GoogleReviewSummaryCard } from './GoogleReviewSummaryCard';
import { cmsService } from '../services/cmsService';
import { googleReviewsService, GoogleReviewSummary } from '../services/googleReviewsService';
import { Testimonial } from '../types';
import { CardSkeleton } from './ui/Skeleton';
import { useCMS } from '../contexts/CMSContext';

export const TestimonialsSection: React.FC = () => {
  const { settings } = useCMS();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [summary, setSummary] = useState<GoogleReviewSummary>({
    rating: 4.9,
    totalReviews: '100+',
    badgeText: 'Google Verified Reviews',
  });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadReviewsData = async () => {
      try {
        const [data, sum] = await Promise.all([
          cmsService.getTestimonials(),
          googleReviewsService.getSummaryStats(),
        ]);
        setTestimonials(data);
        setSummary(sum);
      } catch (err) {
        console.error('Error loading testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReviewsData();
  }, []);

  const title = settings.testimonials_title || 'What Our Customers Say';
  const subtitle =
    settings.testimonials_subtitle ||
    'Trusted by families, business travelers and tourists across the region.';

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials-section" className="py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C9A227]/5 blur-[140px] rounded-full pointer-events-none" />

      <Container size="7xl" className="relative z-10 space-y-12">
        {/* Section Title Required */}
        <SectionTitle
          tag="Customer Feedback"
          title={title}
          subtitle={subtitle}
        />

        {/* Google Review Summary Card Required */}
        <div className="max-w-4xl mx-auto">
          <GoogleReviewSummaryCard
            rating={summary.rating}
            totalReviews={summary.totalReviews}
            badgeText={summary.badgeText}
          />
        </div>

        {/* Testimonial Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div>
            {/* Desktop Grid View */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>

            {/* Mobile Touch Carousel View */}
            <div className="md:hidden space-y-4">
              {testimonials.length > 0 && (
                <TestimonialCard testimonial={testimonials[currentIndex]} />
              )}

              {/* Slider Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === currentIndex ? 'bg-[#C9A227] w-6' : 'bg-zinc-800'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                    aria-label="Previous Testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                    aria-label="Next Testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};
