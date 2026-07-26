import React, { useState, useEffect } from 'react';
import { Compass, ShieldCheck, Award, MapPin, Sparkles, Phone, ArrowRight, CheckCircle2, Star, Calendar, MessageSquare } from 'lucide-react';
import { BookingForm } from '../components/BookingForm';
import { routesService } from '../services/routesService';
import { cmsService } from '../services/cmsService';
import { PopularRoute } from '../types';
import { Container } from '../components/ui/Container';
import { SectionTitle } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { PageSEO } from '../components/ui/SEO';
import { useCMS } from '../contexts/CMSContext';

export const OutstationTaxi: React.FC = () => {
  const { settings } = useCMS();
  const [routes, setRoutes] = useState<PopularRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [routeFilter, setFilter] = useState<'ALL' | 'FEATURED' | 'POPULAR'>('ALL');

  const [selectedPickup, setSelectedPickup] = useState('');
  const [selectedDrop, setSelectedDrop] = useState('');

  // Featured Manali Tour settings
  const tourTitle = settings.outstation_tour_title || 'Manali Tour Package Available';
  const tourDesc = settings.outstation_tour_desc || 'Book comfortable and reliable taxi service for your Manali trip with professional drivers and well-maintained vehicles.';
  const tourVisible = settings.outstation_tour_visible !== 'false';
  const tourImage = settings.outstation_tour_image || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop';
  const phonePrimary = settings.phone_primary || '+91 99589 56593';

  useEffect(() => {
    const loadRoutesData = async () => {
      try {
        const data = await routesService.getAllRoutes();
        setRoutes(data || []);
      } catch (err) {
        console.error('Error fetching routes:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRoutesData();
  }, []);

  const handleSelectRouteForBooking = (origin: string, destination: string) => {
    setSelectedPickup(origin);
    setSelectedDrop(destination);
    const element = document.getElementById('booking-engine');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper for displaying prices safely (No ₹0 for empty/null)
  const formatPriceDisplay = (priceVal?: number | null) => {
    if (priceVal === null || priceVal === undefined || priceVal === 0) {
      return 'Contact for Price';
    }
    return `₹${priceVal.toLocaleString()}`;
  };

  const filteredRoutes = routes.filter((rt) => {
    if (rt.is_active === false) return false;
    if (routeFilter === 'FEATURED') return rt.is_featured === true || rt.is_popular === true;
    if (routeFilter === 'POPULAR') return rt.is_popular === true;
    return true;
  });

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24">
      <PageSEO
        title="Outstation Taxi Services"
        description="Book premium intercity cabs from Chandigarh, Delhi, Mohali, Zirakpur, Ghaziabad to Amritsar, Patiala, Ludhiana, and Manali with flat pricing."
      />

      <Container size="7xl" className="space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#C9A227]/10 border border-[#C9A227]/30 px-3.5 py-1.5 rounded-full text-[#C9A227] text-xs font-mono uppercase tracking-widest">
            <Compass className="w-4 h-4" /> Intercity Outstation Mobility
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Premium Outstation Chauffeur Rentals
          </h1>
          <p className="text-zinc-300 text-base leading-relaxed">
            Travel seamlessly across North India with transparent flat rates, verified highway drivers, and company-owned vehicles.
          </p>
        </div>

        {/* FEATURED TOUR PACKAGE SECTION (MANALI TOUR) */}
        {tourVisible && (
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-[#C9A227]/40 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="gold" dot>Featured Tour Package</Badge>
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> All-Inclusive Mountain Cabs
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {tourTitle}
                </h2>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  {tourDesc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Mountain Certified Drivers</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                    <span>Complimentary Bottled Water</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => handleSelectRouteForBooking('Delhi NCR / Chandigarh', 'Manali')}
                    className="bg-[#C9A227] hover:bg-[#b8911d] text-zinc-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#C9A227]/20"
                  >
                    <Calendar className="w-4 h-4" /> Book Manali Tour Package <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`tel:${phonePrimary.replace(/\s+/g, '')}`}
                    className="bg-zinc-900 border border-zinc-800 hover:border-[#C9A227] text-zinc-200 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#C9A227]" /> Call for Custom Quote
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl h-64 sm:h-72">
                  <img
                    src={tourImage}
                    alt={tourTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-zinc-950/80 backdrop-blur-md rounded-xl border border-[#C9A227]/30 text-xs font-mono text-[#C9A227]">
                    Customized Itineraries &amp; Sightseeing Drops
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Section: Dynamic Routes Grid + Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Dynamic CMS Routes List */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">Intercity Route Directory</span>
                <h2 className="font-serif text-2xl font-bold text-white mt-0.5">Popular One-Way &amp; Round-Trip Cabs</h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 text-xs font-mono">
                {(['ALL', 'FEATURED', 'POPULAR'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      routeFilter === f ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Routes Grid */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-zinc-900/50 h-28 rounded-2xl border border-zinc-800 animate-pulse" />
                ))}
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className="p-8 bg-zinc-900/60 rounded-2xl border border-zinc-800 text-center text-zinc-400 text-sm">
                No active routes found matching this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredRoutes.map((rt) => {
                  const displayPrice = formatPriceDisplay(rt.price);
                  const isContactPrice = displayPrice === 'Contact for Price';

                  return (
                    <div
                      key={rt.id}
                      className="bg-zinc-900/80 border border-zinc-800 hover:border-[#C9A227]/40 p-5 rounded-2xl transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-lg text-white group-hover:text-[#C9A227] transition-colors">
                            {rt.origin}
                          </span>
                          <span className="text-[#C9A227] font-mono font-bold">→</span>
                          <span className="font-serif font-bold text-lg text-white group-hover:text-[#C9A227] transition-colors">
                            {rt.destination}
                          </span>

                          {rt.is_featured && <Badge variant="gold">Featured</Badge>}
                        </div>

                        <p className="text-xs text-zinc-400 flex flex-wrap items-center gap-3 font-mono">
                          {rt.distance_km && <span>{rt.distance_km} KM</span>}
                          {rt.estimated_time && <span>• {rt.estimated_time}</span>}
                          {rt.vehicle_type && <span>• {rt.vehicle_type}</span>}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 block uppercase font-mono">One Way Fare</span>
                          <span className={`font-mono font-extrabold ${isContactPrice ? 'text-amber-400 text-xs' : 'text-[#C9A227] text-lg'}`}>
                            {displayPrice}
                          </span>
                        </div>

                        <button
                          onClick={() => handleSelectRouteForBooking(rt.origin, rt.destination)}
                          className="bg-zinc-800 hover:bg-[#C9A227] hover:text-zinc-950 text-zinc-200 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          Book Route
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="p-5 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2 font-semibold text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> State entry permit taxes &amp; tolls included or transparently passed through.
              </div>
              <div className="flex items-center gap-2 font-semibold text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Experienced highway chauffeurs with 24x7 GPS telemetry monitoring.
              </div>
            </div>

          </div>

          {/* Right Column: Embedded Booking Engine */}
          <div className="lg:col-span-5 space-y-6">
            <BookingForm initialTripType="OUTSTATION" initialVehicle="Toyota Innova Crysta" />
          </div>

        </div>

      </Container>
    </div>
  );
};
