import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Car,
  Clock,
  Briefcase,
  ShoppingBag,
  Users,
  Building,
  Train,
  HeartPulse,
  Compass,
  ShieldCheck,
  CheckCircle,
  Phone,
  Calendar,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';
import { PageSEO } from '../components/ui/SEO';
import { Container } from '../components/ui/Container';
import { SectionTitle } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';

export const LocalTaxi: React.FC = () => {
  const { settings } = useCMS();
  const navigate = useNavigate();

  // Active accordion FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (settings.local_taxi_visible === 'false') {
    return (
      <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24 text-center">
        <Container size="md" className="space-y-4">
          <h1 className="font-serif text-3xl font-bold text-white">Local Taxi Services Unavailable</h1>
          <p className="text-zinc-400 text-sm">This section is currently disabled in CMS.</p>
          <Link to="/" className="text-[#C9A227] underline text-sm">Return Home</Link>
        </Container>
      </div>
    );
  }

  const pageTitle = settings.local_taxi_title || 'Local Taxi Services';
  const pageSubtitle =
    settings.local_taxi_subtitle ||
    'Comfortable, affordable and reliable taxi services for daily travel, shopping, office, family trips and city rides.';

  const phonePrimary = settings.phone_primary || '+91 99589 56593';

  // Default Service Areas
  const serviceAreas = (
    settings.local_service_areas ||
    'Zirakpur, Derabassi, Mohali, Chandigarh, Panchkula, Kharar'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // 8 Local Services
  const localServices = [
    {
      title: 'City Rides',
      desc: 'Quick point-to-point transfers across city limits with zero waiting hassle.',
      icon: <Car className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Daily Office Commute',
      desc: 'Punctual, stress-free daily commute for corporate professionals and executives.',
      icon: <Briefcase className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Shopping Trips',
      desc: 'Keep a comfortable car with boot space while you shop across markets and malls.',
      icon: <ShoppingBag className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Family Travel',
      desc: 'Spacious 6-seater Ertiga & 7-seater Innova Crysta for family outings and events.',
      icon: <Users className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Hotel Transfers',
      desc: 'Doorstep pickup and drop for hotel guests, resort delegates, and visitors.',
      icon: <Building className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Railway Station Pickup & Drop',
      desc: 'Timely transfers to Chandigarh, Mohali & Ambala Railway Stations.',
      icon: <Train className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Hospital Visits',
      desc: 'Gentle, safe, and compassionate transport for medical appointments and clinics.',
      icon: <HeartPulse className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Custom Local Trips',
      desc: 'Tailored hourly packages and multi-stop local itineraries to suit your schedule.',
      icon: <Compass className="w-6 h-6 text-[#C9A227]" />,
    },
  ];

  // Why Choose Our Local Taxi (8 Features)
  const whyChooseFeatures = [
    {
      title: 'Quick Pickup',
      desc: 'Chauffeur arrives at your doorstep within 15 minutes of booking confirmation.',
      icon: <Clock className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Professional Drivers',
      desc: 'Police verified, courteous, and local route expert chauffeurs.',
      icon: <ShieldCheck className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Clean Vehicles',
      desc: 'Daily steam-sanitized, climate-controlled, and spotless interior cabins.',
      icon: <Sparkles className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: '24×7 Availability',
      desc: 'Round-the-clock city dispatch for early morning or late night rides.',
      icon: <Clock className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Transparent Billing',
      desc: 'Transparent flat billing with no hidden charges or driver night surprises.',
      icon: <ShieldCheck className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Safe Family Travel',
      desc: 'Gentle city driving standards, comfortable seating, and utmost safety.',
      icon: <Users className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'GPS Enabled Trips',
      desc: 'Live vehicle tracking and navigation for safe and transparent transit.',
      icon: <MapPin className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Instant Booking',
      desc: 'Instant booking confirmation via direct WhatsApp and SMS dispatch.',
      icon: <CheckCircle className="w-5 h-5 text-[#C9A227]" />,
    },
  ];

  // How It Works (4 Steps)
  const steps = [
    {
      step: 'Step 1',
      title: 'Enter Pickup Location',
      desc: 'Specify your exact pickup address, city area, and drop destination.',
    },
    {
      step: 'Step 2',
      title: 'Choose Vehicle',
      desc: 'Select from Innova Crysta, Ertiga, Dzire, or Amaze to fit your group.',
    },
    {
      step: 'Step 3',
      title: 'Confirm Booking',
      desc: 'Log reservation with instant WhatsApp confirmation.',
    },
    {
      step: 'Step 4',
      title: 'Enjoy Your Ride',
      desc: 'Board your clean, air-conditioned vehicle and ride comfortably.',
    },
  ];

  // Local Taxi FAQs
  const localFaqs = [
    {
      q: 'Do you provide hourly taxi service?',
      a: 'Yes, we provide flexible hourly local rental packages (4 Hours / 40 KM, 8 Hours / 80 KM, 12 Hours / 120 KM) so you can keep a dedicated vehicle and driver for as long as needed.',
    },
    {
      q: 'Can I book for multiple stops?',
      a: 'Absolutely! Our local taxi service allows unlimited stopovers for shopping, meetings, or visiting family across Zirakpur, Mohali, Chandigarh, Panchkula, and surrounding areas.',
    },
    {
      q: 'Do you provide night service?',
      a: 'Yes, our local taxi dispatch operates 24x7. Whether you need a 3 AM airport drop or late-night station pickup, our drivers are on standby.',
    },
    {
      q: 'Can I schedule rides in advance?',
      a: 'Yes, you can schedule your local pickup hours, days, or weeks in advance using our instant booking form or WhatsApp line.',
    },
  ];

  const handleBookLocalTaxiClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/#booking-engine');
    setTimeout(() => {
      const el = document.getElementById('booking-engine');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24">
      <PageSEO
        title="Local Taxi Services"
        description={`${pageTitle} - ${pageSubtitle}. Service areas: ${serviceAreas.join(', ')}.`}
      />

      <Container size="7xl" className="space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <SectionTitle
            tag="City Rides & Daily Travel"
            title={pageTitle}
            subtitle={pageSubtitle}
          />
        </div>

        {/* Service Areas Section */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-[#C9A227] text-xs font-mono uppercase tracking-widest">
            <MapPin className="w-4 h-4" /> Service Locations Covered
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Local Taxi Coverage Areas
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Prompt doorstep pickups available across all major nearby sectors and towns:
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {serviceAreas.map((area, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-950 border border-[#C9A227]/30 text-zinc-200 text-xs font-semibold font-mono hover:border-[#C9A227] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Services Grid (8 Cards) */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
              Tailored City Mobility
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">Our Local Taxi Offerings</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {localServices.map((srv, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-800 space-y-3 hover:border-[#C9A227]/40 hover:shadow-xl hover:shadow-[#C9A227]/5 transition-all group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-[#C9A227]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {srv.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Our Local Taxi (8 Features) */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
              Unmatched City Standards
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">Why Choose Our Local Taxi?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800/80 space-y-2.5 hover:border-[#C9A227]/30 transition-all"
              >
                <div className="w-10 h-10 bg-[#C9A227]/10 rounded-lg flex items-center justify-center">
                  {feat.icon}
                </div>
                <h4 className="font-serif font-bold text-white text-base">{feat.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-[#C9A227]/30 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-mono font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Affordable &amp; Transparent
            </div>
            <h3 className="font-serif text-3xl font-extrabold text-white">
              Transparent <span className="text-[#C9A227]">Flat Billing</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Transparent pricing with no hidden charges. Flat rates for all local city rides and hourly rentals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Button
              variant="gold"
              size="lg"
              onClick={handleBookLocalTaxiClick}
              leftIcon={<Calendar className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Book Local Taxi
            </Button>
            <a href={`tel:${phonePrimary.replace(/\s+/g, '')}`} className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                leftIcon={<Phone className="w-4 h-4 text-[#C9A227]" />}
              >
                Call Now
              </Button>
            </a>
          </div>
        </div>

        {/* How It Works (4 Steps) */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
              Easy 4-Step Process
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 space-y-3 relative overflow-hidden"
              >
                <span className="text-[10px] font-mono text-[#C9A227] uppercase font-bold bg-[#C9A227]/10 px-2.5 py-1 rounded-full border border-[#C9A227]/20">
                  {st.step}
                </span>
                <h3 className="font-serif text-lg font-bold text-white pt-1">{st.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Local Taxi FAQs */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {localFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-serif font-bold text-white text-base sm:text-lg flex items-center justify-between gap-4 hover:text-[#C9A227] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-[#C9A227]" shrink-0 />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#C9A227]" shrink-0 />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Booking CTA */}
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 text-center space-y-6">
          <h2 className="font-serif text-3xl font-bold text-white">
            Need a Local Taxi Right Away?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Reserve your city taxi in less than 60 seconds. Our 24/7 concierge is standing by to confirm your driver dispatch.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button
              variant="gold"
              size="lg"
              onClick={handleBookLocalTaxiClick}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Book Local Taxi Now
            </Button>
            <a href={`tel:${phonePrimary.replace(/\s+/g, '')}`}>
              <Button variant="secondary" size="lg" leftIcon={<Phone className="w-4 h-4 text-[#C9A227]" />}>
                Call Hotline ({phonePrimary})
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};
