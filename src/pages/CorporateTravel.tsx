import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  Plane,
  Users,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  FileText,
  Phone,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingUp,
  ArrowRight,
  Headphones,
  Car,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';
import { PageSEO } from '../components/ui/SEO';
import { Container } from '../components/ui/Container';
import { SectionTitle } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { BookingForm } from '../components/BookingForm';

export const CorporateTravel: React.FC = () => {
  const { settings } = useCMS();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // If toggled off in CMS
  if (settings.corporate_visible === 'false') {
    return (
      <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24 text-center">
        <Container size="md" className="space-y-4">
          <h1 className="text-2xl font-serif font-bold text-[#C9A227]">Corporate Travel Page Currently Inactive</h1>
          <p className="text-zinc-400 text-sm">Please contact our 24/7 Concierge Desk at +91 99589 56593 for corporate inquiries.</p>
        </Container>
      </div>
    );
  }

  const title = settings.corporate_title || 'Corporate Travel Solutions';
  const subtitle =
    settings.corporate_subtitle ||
    'Professional transportation services for companies, executives, employees, hotels and business events with reliable drivers and transparent pricing.';

  const ratePerKm = settings.default_rate_per_km || '14';
  const phonePrimary = settings.phone_primary || '+91 99589 56593';

  // 8 Corporate Services Required
  const corporateServices = [
    {
      title: 'Employee Transportation',
      desc: 'Scheduled daily pick-and-drop shuttles for office staff and late-night shift transfers.',
      icon: <Users className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Corporate Airport Transfers',
      desc: 'Priority flight status tracking and meet-and-greet placards at IGI T1/T2/T3 & Chandigarh IXC.',
      icon: <Plane className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Executive Travel',
      desc: 'Premium chauffeur-driven Innova Crysta and Dzire sedans for C-suite directors and board members.',
      icon: <Briefcase className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Business Meetings',
      desc: 'Dedicated hourly rentals with chauffeur on standby for multi-location corporate meetings.',
      icon: <Clock className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Hotel Guest Transfers',
      desc: 'Seamless luxury mobility partnerships for 5-star hotels, resorts, and corporate guest houses.',
      icon: <Building2 className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Event Transportation',
      desc: 'Convoy management for corporate summits, product launches, shareholder AGMs, and conferences.',
      icon: <Calendar className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Long-Term Travel Contracts',
      desc: 'Custom annual or semi-annual fleet agreements tailored to enterprise corporate budgets.',
      icon: <FileText className="w-6 h-6 text-[#C9A227]" />,
    },
    {
      title: 'Monthly Corporate Plans',
      desc: 'Itemized consolidated GST billing with zero hassle digital expense voucher management.',
      icon: <FileCheck2 className="w-6 h-6 text-[#C9A227]" />,
    },
  ];

  // 8 Why Businesses Choose Us Required
  const whyBusinessesChooseUs = [
    {
      title: 'Professional Chauffeurs',
      desc: 'Uniformed, police background verified, and trained in corporate confidentiality.',
      icon: <ShieldCheck className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'On-Time Pickup',
      desc: 'Guaranteed zero-minute delays with real-time vehicle dispatch tracking.',
      icon: <Clock className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Invoice Support',
      desc: 'Itemized GST compliant digital vouchers for effortless corporate finance audits.',
      icon: <FileText className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: '24×7 Availability',
      desc: 'Round-the-clock priority dispatch and emergency fleet reservations.',
      icon: <Headphones className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Dedicated Customer Support',
      desc: 'Single point of contact account manager assigned to your organization.',
      icon: <Award className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Transparent Billing',
      desc: 'Fixed per-kilometer pricing, pre-calculated tolls, and zero hidden markups.',
      icon: <TrendingUp className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Well Maintained Vehicles',
      desc: 'Company-owned, daily sanitized air-conditioned sedans and MPVs.',
      icon: <Car className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      title: 'Safe & Reliable Service',
      desc: 'Live GPS telemetry, speed monitoring, and flight radar status updates.',
      icon: <CheckCircle2 className="w-5 h-5 text-[#C9A227]" />,
    },
  ];

  // 4-Step Process Required
  const processSteps = [
    {
      step: '01',
      title: 'Share Your Requirements',
      desc: 'Submit your company travel itinerary, employee count, or corporate event fleet needs.',
    },
    {
      step: '02',
      title: 'Receive a Custom Quote',
      desc: 'Get a transparent B2B quote with customized per-kilometer or monthly corporate contract rates.',
    },
    {
      step: '03',
      title: 'Confirm Booking',
      desc: 'Lock in your fleet allocation with instant digital confirmation and assigned driver details.',
    },
    {
      step: '04',
      title: 'Travel with Confidence',
      desc: 'Experience punctual executive rides with live GPS monitoring and consolidated GST invoicing.',
    },
  ];

  // 7 Business Benefits Required
  const businessBenefits = [
    'Monthly Billing with 30-day payment cycles for verified corporate accounts',
    'Dedicated Account Manager available 24/7 for custom bookings',
    'Priority Vehicle Booking allocation during peak conference hours',
    'Flexible Scheduling and easy itinerary modifications with zero penalty fees',
    'GST Invoice Support with itemized digital vouchers for accounting',
    'Reliable Chauffeurs trained defensively for highway and city navigation',
    'Custom Travel Plans for daily employee shuttles or VIP guest transfers',
  ];

  // Corporate FAQs Required
  const corporateFaqs = [
    {
      question: 'Can companies sign long-term contracts?',
      answer:
        'Yes, we offer 6-month and annual corporate fleet contracts with customized monthly billing cycles, volume discounts, and dedicated vehicles.',
    },
    {
      question: 'Do you provide GST invoices?',
      answer:
        'Absolutely. All corporate bookings receive 100% tax-compliant digital GST invoices with detailed trip logs, vehicle numbers, and passenger vouchers for seamless company audits.',
    },
    {
      question: 'Can we schedule recurring bookings?',
      answer:
        'Yes, our corporate portal supports automated daily, weekly, or monthly recurring employee pick-and-drop schedules without needing to re-enter details.',
    },
    {
      question: 'Do you offer airport transfers for employees?',
      answer:
        'Yes, we provide 24/7 airport pickup and drop transfers at IGI Airport Delhi (T1, T2, T3) and Chandigarh IXC Airport with live flight radar tracking.',
    },
  ];

  const handleRequestQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('booking-engine');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24">
      <PageSEO
        title={`${title} | Luthra Travels`}
        description={subtitle}
        canonicalUrl="https://luthratravels.com/corporate-travel"
      />

      <Container size="7xl" className="space-y-20">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <SectionTitle
            tag="B2B Mobility Solutions"
            title={title}
            subtitle={subtitle}
          />

          {/* Pricing Highlight Required */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Starting from ₹{ratePerKm} per KM • Corporate Pricing Available • Transparent Billing • No Hidden Charges
          </div>
        </div>

        {/* Hero Banner Grid: Corporate Info + Embedded Floating Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <ShieldCheck className="w-4 h-4" /> Trusted by 150+ Corporate Accounts in Delhi NCR
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Seamless Mobility for Enterprises, Hotels &amp; Events
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Eliminate travel friction for your executives and employees. Luthra Travels delivers standardized chauffeur services across Gurgaon Cyber City, Noida, Delhi, Chandigarh, and major business hubs.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-1">
                <span className="font-serif text-2xl font-bold text-[#C9A227] font-mono block">100%</span>
                <span className="text-xs text-zinc-400 uppercase font-mono">GST Compliance</span>
              </div>
              <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-1">
                <span className="font-serif text-2xl font-bold text-[#C9A227] font-mono block">30-Day</span>
                <span className="text-xs text-zinc-400 uppercase font-mono">Credit Billing Cycle</span>
              </div>
            </div>

            {/* CTAs Required */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                variant="gold"
                size="md"
                onClick={handleRequestQuote}
                leftIcon={<Calendar className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Request Corporate Quote
              </Button>

              <a href={`tel:${phonePrimary.replace(/\s+/g, '')}`}>
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Phone className="w-4 h-4 text-[#C9A227]" />}
                >
                  Call Now ({phonePrimary})
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <BookingForm initialTripType="CORPORATE" initialVehicle="Toyota Innova Crysta" />
          </div>
        </div>

        {/* Corporate Services (8 Cards Required) */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">Enterprise Portfolio</span>
            <h2 className="font-serif text-3xl font-bold text-white">Our Corporate Services</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {corporateServices.map((svc, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-800 space-y-3 hover:border-[#C9A227]/40 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-[#C9A227]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {svc.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {svc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Businesses Choose Us (8 Feature Cards Required) */}
        <div className="space-y-10 bg-zinc-900/40 p-8 sm:p-12 rounded-3xl border border-zinc-800">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">Corporate Standards</span>
            <h2 className="font-serif text-3xl font-bold text-white">Why Businesses Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyBusinessesChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800 space-y-2.5 hover:border-[#C9A227]/30 transition-all"
              >
                <div className="w-10 h-10 bg-[#C9A227]/10 rounded-lg flex items-center justify-center">
                  {item.icon}
                </div>
                <h4 className="font-serif text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Step Corporate Process Required */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">Simple Onboarding</span>
            <h2 className="font-serif text-3xl font-bold text-white">How Corporate Booking Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((proc, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-3 relative group"
              >
                <span className="font-mono text-3xl font-extrabold text-[#C9A227] block">
                  {proc.step}
                </span>
                <h3 className="font-serif text-lg font-bold text-white">{proc.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{proc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Business Benefits Section (7 Benefits Required) */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-[#C9A227]/30 p-8 sm:p-12 rounded-3xl space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">Enterprise Advantages</span>
            <h2 className="font-serif text-3xl font-bold text-white">Business Benefits</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
                <CheckCircle2 className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate FAQs Required */}
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">Business Queries</span>
            <h2 className="font-serif text-3xl font-bold text-white">Corporate FAQs</h2>
          </div>

          <div className="space-y-4">
            {corporateFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-bold text-white text-base sm:text-lg">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#C9A227] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="bg-zinc-900 p-8 sm:p-12 rounded-3xl border border-[#C9A227]/40 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Set Up Your Corporate Travel Account Today
          </h2>
          <p className="text-zinc-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Contact our B2B mobility desk to request a customized quote, set up monthly credit billing, or arrange dedicated fleet shuttles.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="gold"
              size="lg"
              onClick={handleRequestQuote}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Request Corporate Quote
            </Button>
            <a href={`tel:${phonePrimary.replace(/\s+/g, '')}`}>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Phone className="w-4 h-4 text-[#C9A227]" />}
              >
                Call Now ({phonePrimary})
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};
