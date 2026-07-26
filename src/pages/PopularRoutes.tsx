import React, { useState, useEffect } from 'react';
import { routesService } from '../services/routesService';
import { PopularRoute } from '../types';
import { RouteCard } from '../components/RouteCard';
import { SectionTitle } from '../components/ui/Typography';
import { Container } from '../components/ui/Container';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageSEO } from '../components/ui/SEO';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Sparkles, ShieldCheck, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PopularRoutes: React.FC = () => {
  const [routes, setRoutes] = useState<PopularRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPopularRoutesData = async () => {
      try {
        const rData = await routesService.getAllRoutes();
        setRoutes(rData);
      } catch (err) {
        console.error('Error loading popular routes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPopularRoutesData();
  }, []);

  const handleBookRoute = (route: PopularRoute) => {
    try {
      localStorage.setItem('luthra_prefill_pickup', route.origin);
      localStorage.setItem('luthra_prefill_drop', route.destination);
    } catch {
      // LocalStorage fallback
    }

    navigate('/#booking-engine');
    setTimeout(() => {
      const element = document.getElementById('booking-engine');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24">
      <PageSEO
        title="Popular Taxi Routes | Intercity Cabs"
        description="Explore frequently booked taxi routes between Chandigarh, Zirakpur, Mohali, Panchkula, Delhi Airport, Shimla, Manali & Amritsar."
      />

      <Container size="7xl" className="space-y-12">
        
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Popular Routes' }]} />

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <SectionTitle
            tag="Intercity Cabs"
            title="Popular Taxi Routes"
            subtitle="Explore our most frequently booked routes with professional drivers and comfortable rides."
          />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Door-to-Door Intercity Travel • Zero Hidden Surcharges
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block flex items-center gap-1.5 justify-center md:justify-start">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Direct Concierge Dispatch
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">Seamless Intercity Transit</h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
              Every route is served by experienced highway chauffeurs with door-to-door pickup and luggage assistance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:+919958956593"
              className="bg-zinc-800 hover:bg-zinc-700 text-[#C9A227] border border-[#C9A227]/30 font-semibold text-xs px-5 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call: +91 99589 56593
            </a>
          </div>
        </div>

        {/* Routes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {routes.map((rt) => (
              <RouteCard
                key={rt.id}
                route={rt}
                onBookRoute={handleBookRoute}
              />
            ))}
          </div>
        )}

        {/* Guarantees Footer */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              All vehicles include air conditioning, clean sanitized interiors, and GPS flight-tracking dispatch.
            </span>
          </div>
          <span className="font-mono text-[#C9A227] font-semibold shrink-0">
            24×7 Route Dispatch Helpline
          </span>
        </div>

      </Container>
    </div>
  );
};
