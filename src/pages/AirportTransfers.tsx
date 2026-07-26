import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plane,
  Clock,
  ShieldCheck,
  MapPin,
  CheckCircle,
  Phone,
  Calendar,
  Sparkles,
  Users,
  Briefcase,
  TrendingUp,
  HelpCircle,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { SectionTitle } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageSEO } from '../components/ui/SEO';
import { useCMS } from '../contexts/CMSContext';
import { cmsService } from '../services/cmsService';
import { FAQItem } from '../types';

export const AirportTransfers: React.FC = () => {
  const { settings } = useCMS();
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const title = settings.airport_page_title || 'Airport Taxi Services';
  const subtitle =
    settings.airport_page_subtitle ||
    'Reliable airport pickup and drop services with professional drivers, transparent pricing and on-time arrivals.';

  const phonePrimary = settings.phone_primary || '+91 99589 56593';

  // Supported airports list from CMS
  const rawAirports =
    settings.airport_list ||
    'Chandigarh International Airport (IXC), Indira Gandhi International Airport, Delhi (DEL), Shaheed Bhagat Singh International Airport (Mohali)';
  const supportedAirports = rawAirports.split(',').map((a) => a.trim());

  useEffect(() => {
    const loadAirportFaqs = async () => {
      try {
        const allFaqs = await cmsService.getFaqs();
        const airportFaqs = allFaqs.filter(
          (f) =>
            f.is_active &&
            (f.category === 'Airport Transfers' ||
              f.question.toLowerCase().includes('airport') ||
              f.question.toLowerCase().includes('flight') ||
              f.question.toLowerCase().includes('toll'))
        );
        setFaqs(airportFaqs.length > 0 ? airportFaqs : allFaqs);
      } catch (err) {
        console.error('Error loading airport FAQs:', err);
      }
    };
    loadAirportFaqs();
  }, []);

  const handleBookTaxiClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/#booking-engine');
    setTimeout(() => {
      const element = document.getElementById('booking-engine');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  // 6 Services
  const servicesList = [
    {
      title: 'Airport Pickup',
      desc: 'Seamless arrival gate pickups with live radar flight monitoring.',
      icon: <Plane className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Airport Drop',
      desc: 'Punctual departure transfers to ensure zero flight miss risks.',
      icon: <Clock className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Meet & Greet',
      desc: 'Chauffeur holds tablet name placard at arrival gates with luggage help.',
      icon: <Users className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Flight Tracking',
      desc: 'Automatic schedule adjustments for early or delayed arriving flights.',
      icon: <Sparkles className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: '24×7 Availability',
      desc: 'Round-the-clock dispatches for late-night and early-morning flights.',
      icon: <Calendar className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Professional Drivers',
      desc: 'Police background verified, uniformed, and courteous master chauffeurs.',
      icon: <ShieldCheck className="w-6 h-6 text-[#C9A227]" />,
    },
  ];

  // 6 Why Choose Features
  const whyChooseList = [
    {
      title: 'On-Time Pickup',
      desc: 'Guaranteed punctual dispatches and zero-wait exit pickups.',
      icon: <CheckCircle className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Real-Time Flight Tracking',
      desc: 'Driver is dispatched according to live IATA radar updates.',
      icon: <Sparkles className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Clean Vehicles',
      desc: 'Deep steam vacuumed seats, sanitized air filters, and fresh water.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Professional Drivers',
      desc: 'Defensively trained English & Hindi speaking chauffeurs.',
      icon: <Users className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: '24×7 Service',
      desc: 'Continuous operational desk for flight delays or urgent changes.',
      icon: <Clock className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Luggage Assistance',
      desc: 'Chauffeur assists with loading and unloading heavy bags.',
      icon: <Briefcase className="w-5 h-5 text-[#C9A227]" />,
    },
  ];

  // Schema.org structured data for SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: 'Luthra Travels Airport Taxi Services',
    description: subtitle,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Luthra Travels',
      telephone: phonePrimary,
      email: settings.email_primary || 'luthratravel455@gmail.com',
    },
    areaServed: supportedAirports,
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24">
      <PageSEO
        title="Airport Taxi Services"
        description="Reliable airport pickup and drop services for Delhi IGI (DEL), Chandigarh (IXC) & SBS Airport. On-time flight radar tracking & transparent fares."
        canonicalUrl="/airport-transfers"
      />

      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <Container size="7xl" className="space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="gold" dot>
            24x7 Airport Chauffeur Mobility
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Supported Airports Bar */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold">
            <MapPin className="w-4 h-4" /> Supported Destination Airports
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {supportedAirports.map((airport, idx) => (
              <div
                key={idx}
                className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex items-center gap-3 text-xs sm:text-sm font-semibold text-zinc-200"
              >
                <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] shrink-0">
                  <Plane className="w-4 h-4" />
                </div>
                <span>{airport}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Airport Services Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
              Dedicated Airport Offerings
            </span>
            <h2 className="font-serif text-3xl font-bold text-white mt-1">
              Airport Transfer Services
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((service, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 space-y-3 hover:border-[#C9A227]/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#C9A227]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Our Airport Service */}
        <div className="space-y-6 pt-4 border-t border-zinc-900">
          <div className="text-center">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
              Uncompromising Standards
            </span>
            <h2 className="font-serif text-3xl font-bold text-white mt-1">
              Why Choose Our Airport Taxi
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyChooseList.map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800 flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-semibold text-sm text-white font-serif">{item.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Booking CTA Card */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-[#C9A227]/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-mono font-bold uppercase">
                <TrendingUp className="w-3.5 h-3.5" /> All-Inclusive Airport Fares
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                All-Inclusive <span className="text-[#C9A227]">Flat Pricing</span>
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Transparent Pricing • No Hidden Charges. Flight status monitoring and 60 minutes complimentary airport arrival wait time included.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button
                variant="gold"
                size="lg"
                fullWidth
                onClick={handleBookTaxiClick}
                leftIcon={<Calendar className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Book Airport Taxi
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
        </div>

        {/* Editable Airport FAQs Section */}
        <div className="space-y-6 pt-4 border-t border-zinc-900 max-w-4xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">
              Airport Service FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base text-zinc-100 hover:text-[#C9A227] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#C9A227]" shrink-0 />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#C9A227]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 mt-1">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
};
