import React from 'react';
import {
  Clock,
  UserCheck,
  Sparkles,
  Tag,
  CheckCircle2,
  Plane,
  Navigation,
  Heart,
  Phone,
  Calendar,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { SectionTitle } from './ui/Typography';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { useCMS } from '../contexts/CMSContext';

export const WhyChooseUs: React.FC = () => {
  const { settings } = useCMS();

  // If Section is toggled hidden in CMS, return null
  if (settings.why_choose_visible === 'false') {
    return null;
  }

  const title = settings.why_choose_title || 'Why Choose Luthra Travels?';
  const subtitle =
    settings.why_choose_subtitle ||
    'Experience safe, comfortable and reliable taxi services with professional drivers and transparent pricing.';

  const phonePrimary = settings.phone_primary || '+91 99589 56593';

  // Stats from CMS settings
  const happyCustomers = settings.stat_happy_customers || '5000+';
  const successfulTrips = settings.stat_successful_trips || '10000+';
  const vehiclesAvailable = settings.stat_vehicles_available || '4';
  const customerSupport = settings.stat_customer_support || '24×7';

  // Exactly these 8 features
  const features = [
    {
      title: '24×7 Availability',
      desc: 'Round-the-clock taxi dispatch and emergency concierge support anytime.',
      icon: <Clock className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Professional Drivers',
      desc: 'Uniformed, police background verified, and defensively trained chauffeurs.',
      icon: <UserCheck className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Clean & Sanitized Vehicles',
      desc: 'Deep steam vacuumed seats, fresh air filters, and sanitizers in every ride.',
      icon: <Sparkles className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Affordable Pricing',
      desc: 'Transparent flat billing with zero unexpected night surcharges or toll markups.',
      icon: <Tag className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'On-Time Pickup',
      desc: 'Guaranteed 0-minute pickup delays with live chauffeur tracking.',
      icon: <CheckCircle2 className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Airport Specialists',
      desc: 'Dedicated IGI Airport T1, T2 & T3 meet and greet with flight radar tracking.',
      icon: <Plane className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'GPS Enabled Trips',
      desc: 'Live vehicle telemetry and route navigation for maximum passenger security.',
      icon: <Navigation className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Safe Family Travel',
      desc: 'Comfortable seating, gentle hill driving, and child seat support for families.',
      icon: <Heart className="w-6 h-6 text-[#C9A227]" />,
    },
  ];

  const handleBookYourRide = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('booking-engine');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <section id="why-choose-us" className="py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#C9A227]/5 blur-[140px] rounded-full pointer-events-none" />

      <Container size="7xl" className="relative z-10 space-y-16">
        {/* Section Title & Subtitle */}
        <SectionTitle
          tag="Trust & Reliability"
          title={title}
          subtitle={subtitle}
        />

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-800 space-y-3 hover:border-[#C9A227]/40 hover:shadow-xl hover:shadow-[#C9A227]/5 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-[#C9A227]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Stats Counters Bar */}
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
              Proven Performance
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">Our Trust Metrics</h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
            <div className="pt-4 lg:pt-0 lg:px-4 space-y-1">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C9A227] font-mono block">
                {happyCustomers}
              </span>
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Happy Customers
              </span>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4 space-y-1">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C9A227] font-mono block">
                {successfulTrips}
              </span>
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Successful Trips
              </span>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4 space-y-1">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C9A227] font-mono block">
                {vehiclesAvailable}
              </span>
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Vehicles Available
              </span>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4 space-y-1">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C9A227] font-mono block">
                {customerSupport}
              </span>
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Customer Support
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Info Card & Call To Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-[#C9A227]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-mono font-bold uppercase">
              <TrendingUp className="w-3.5 h-3.5" /> Transparent Billing Policy
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              100% Flat <span className="text-[#C9A227]">Transparent Fares</span>
            </h3>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              No hidden charges. Transparent pricing. Every route is pre-calculated with zero unexpected night driver surcharges or toll markups.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Bill Transparency</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> GST Tax Invoice</span>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
            <Button
              variant="gold"
              size="lg"
              fullWidth
              onClick={handleBookYourRide}
              leftIcon={<Calendar className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Book Your Ride
            </Button>

            <a href={`tel:${phonePrimary.replace(/\s+/g, '')}`} className="w-full">
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                leftIcon={<Phone className="w-4 h-4 text-[#C9A227]" />}
              >
                Call Now ({phonePrimary})
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};
