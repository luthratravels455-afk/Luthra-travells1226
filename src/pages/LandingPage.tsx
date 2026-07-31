import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Phone, Sparkles } from 'lucide-react';
import { seoService, LandingPageItem } from '../services/seoService';
import { PageSEO } from '../components/ui/SEO';
import { BookingForm } from '../components/BookingForm';
import { Container } from '../components/ui/Container';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<LandingPageItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      try {
        const item = await seoService.getLandingPageBySlug(slug || 'airport-taxi');
        setPage(item);
      } catch (err) {
        console.error('Error loading landing page:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center pt-32">
        <div className="w-10 h-10 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24">
      <PageSEO
        title={page.title}
        description={page.meta_description}
      />

      <Container size="7xl" className="space-y-12">
        <Breadcrumb items={[{ label: 'Services', path: '/fleet' }, { label: page.title }]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Google Ads Certified Service
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              {page.h1_title || page.title}
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {page.meta_description}
            </p>

            <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-3">
              <h3 className="font-serif font-bold text-white text-base">Key Service Features:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300">
                {(page.features || []).map((feat: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <a href="tel:+919958956593">
                <Button variant="gold" size="lg" leftIcon={<Phone className="w-4 h-4" />}>
                  Call Now (+91 99589 56593)
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <BookingForm initialTripType="AIRPORT" />
          </div>
        </div>
      </Container>
    </div>
  );
};
