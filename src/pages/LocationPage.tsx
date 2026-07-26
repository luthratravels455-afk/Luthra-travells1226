import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, ShieldCheck, Clock, CheckCircle2, ArrowRight, Navigation } from 'lucide-react';
import { seoService, LocationItem } from '../services/seoService';
import { SEOHead } from '../components/seo/SEOHead';
import { SchemaMarkup } from '../components/seo/SchemaMarkup';
import { BookingForm } from '../components/BookingForm';
import { Container } from '../components/ui/Container';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';

export const LocationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useState<LocationItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocation = async () => {
      setLoading(true);
      try {
        const item = await seoService.getLocationBySlug(slug || 'chandigarh');
        setLocation(item);
      } catch (err) {
        console.error('Error loading location page:', err);
      } finally {
        setLoading(false);
      }
    };
    loadLocation();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center pt-32">
        <div className="w-10 h-10 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!location) return null;

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24">
      <SEOHead
        title={location.title}
        description={location.meta_desc}
        focusKeyword={`${location.name} taxi service, cab booking in ${location.name}`}
      />
      <SchemaMarkup type="LocalBusiness" />
      <SchemaMarkup type="TaxiService" />
      <SchemaMarkup
        type="BreadcrumbList"
        data={{
          items: [
            { label: 'Locations', path: '/location/chandigarh' },
            { label: location.name, path: `/location/${location.slug}` },
          ],
        }}
      />

      <Container size="7xl" className="space-y-12">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Locations', path: '/location/chandigarh' }, { label: location.name }]} />

        {/* Hero & Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-mono uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" /> 24/7 Local &amp; Outstation Taxi
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              {location.h1_heading}
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {location.content}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-zinc-300 pt-2 font-mono">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Guaranteed On-Time</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A227]" /> Transparent Flat Fares</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A227]" /> Sanitized Clean Cabs</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Drivers</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <a href="tel:+919958956593">
                <Button variant="primary" leftIcon={<Phone className="w-4 h-4" />}>
                  Call Chauffeur (+91 99589 56593)
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <BookingForm initialTripType="OUTSTATION" />
          </div>
        </div>

        {/* Nearby Service Locations */}
        {location.nearby_areas && location.nearby_areas.length > 0 && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#C9A227] flex items-center gap-2">
              <Navigation className="w-5 h-5" /> Taxi Coverage Near {location.name}
            </h3>
            <p className="text-xs text-zinc-400">
              We provide express pickups and door-to-door drops across all adjoining sectors and regions:
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {location.nearby_areas.map((area, idx) => (
                <Link
                  key={idx}
                  to={`/location/${area.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-zinc-950 border border-zinc-800 hover:border-[#C9A227] px-4 py-2 rounded-xl text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
                >
                  <span>Taxi in {area}</span> <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Google Maps Location Placeholder */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center space-y-2">
          <MapPin className="w-8 h-8 text-[#C9A227] mx-auto" />
          <h4 className="font-serif font-bold text-white text-base">Service Depot Map Hub: {location.name}</h4>
          <p className="text-xs text-zinc-400">24/7 Chauffeur Dispatch Hub • Express Pickups Under 15 Minutes</p>
        </div>
      </Container>
    </div>
  );
};
