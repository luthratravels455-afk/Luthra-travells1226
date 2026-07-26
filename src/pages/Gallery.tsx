import React, { useState, useEffect } from 'react';
import { cmsService } from '../services/cmsService';
import { GalleryItem } from '../types';
import { Container } from '../components/ui/Container';
import { SectionTitle } from '../components/ui/Typography';
import { PageSEO } from '../components/ui/SEO';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { CardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Maximize2, Sparkles } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categories = ['ALL', 'Fleet', 'Airport', 'Corporate', 'Outstation', 'Local', 'Customers'];

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await cmsService.getGallery();
        setGallery(data);
      } catch (err) {
        console.error('Error loading gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  const filteredItems = filterCategory === 'ALL'
    ? gallery
    : gallery.filter((item) =>
        item.category.toLowerCase().includes(filterCategory.toLowerCase())
      );

  const handleOpenLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24">
      <PageSEO
        title="Vehicle & Chauffeur Gallery"
        description="View high-resolution photos of Luthra Travels taxi fleet, airport meet & greet transfers, corporate delegations, and outstation trips."
      />

      <Container size="7xl" className="space-y-12">
        
        {/* Header Title */}
        <SectionTitle
          tag="Portfolio Showcase"
          title="Vehicle & Travel Gallery"
          subtitle="Explore our fleet of Toyota Innova Crysta, Maruti Ertiga, Dzire, and Amaze taxis captured during airport transfers, intercity outstation routes, and corporate mobility."
        />

        {/* Category Filters Bar Required */}
        <div className="flex flex-wrap justify-center gap-2 bg-zinc-900/80 p-2 rounded-2xl border border-zinc-800/80 max-w-3xl mx-auto backdrop-blur-md">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all ${
                filterCategory === cat
                  ? 'bg-[#C9A227] text-zinc-950 shadow-md shadow-[#C9A227]/20 font-extrabold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Responsive Image Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="No Photos in Category"
            description="There are currently no photos matching this filter category."
            actionText="Show All Photos"
            onAction={() => setFilterCategory('ALL')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => handleOpenLightbox(index)}
                className="relative group rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900 h-72 cursor-pointer hover:border-[#C9A227]/40 hover:shadow-2xl hover:shadow-[#C9A227]/10 transition-all duration-300"
              >
                {/* Lazy Loaded Image */}
                <img
                  src={item.image_url}
                  alt={item.title || 'Luthra Travels Fleet Photo'}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Category Badge & Expand Icon */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C9A227] bg-zinc-950/80 border border-[#C9A227]/30 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                    {item.category}
                  </span>

                  <div className="w-8 h-8 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-300 group-hover:text-[#C9A227] group-hover:border-[#C9A227] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Title Caption */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-mono block">
                    Click to enlarge in Lightbox
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </Container>

      {/* Lightbox Viewer Component */}
      <GalleryLightbox
        items={filteredItems}
        currentIndex={activeImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setActiveImageIndex(newIdx)}
      />
    </div>
  );
};
