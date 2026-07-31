import React, { useState } from 'react';
import { Phone, Calendar, ShieldCheck, Sparkles, Clock, Award } from 'lucide-react';
import { BookingForm } from '../components/BookingForm';
import { FleetShowcase } from '../components/FleetShowcase';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { GoogleReviewsWidget } from '../components/GoogleReviewsWidget';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { PageSEO } from '../components/ui/SEO';

export const Home: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Toyota Innova Crysta');

  const handleBookNowScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('booking-engine');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleSelectVehicleFromFleet = (vehicleTitle: string) => {
    setSelectedVehicle(vehicleTitle);
    const element = document.getElementById('booking-engine');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <PageSEO
        title="Premium Chauffeur Services Across India"
        description="Book executive chauffeur rentals, airport transfers, outstation trips, local taxis, and corporate mobility across Delhi NCR, Agra, Jaipur & Chandigarh."
      />

      {/* LUXURY HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-zinc-950">
        
        {/* Subtle Luxury Gradient Background & Subtle Motion */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#C9A227]/10 via-[#C9A227]/5 to-transparent rounded-full blur-[140px] opacity-70 animate-pulse duration-[8000ms]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/90 to-zinc-950" />
        </div>

        <Container size="7xl" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Headlines & Value Props */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-mono tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" /> India's Elite Chauffeur Fleet
              </div>

              {/* Main Heading Required */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Premium Chauffeur Services <br className="hidden sm:block" />
                <span className="text-[#C9A227]">Across India</span>
              </h1>

              {/* Sub Heading Required */}
              <p className="text-zinc-300 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-xl">
                Airport Transfers • Outstation Trips • Local Taxi • Corporate Travel
              </p>

              {/* Trust Badges Bar */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800/80 max-w-lg">
                <div className="space-y-0.5">
                  <span className="font-serif text-2xl font-bold text-[#C9A227] font-mono block">45,000+</span>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Trips Served</span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-serif text-2xl font-bold text-[#C9A227] font-mono block">100%</span>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">On-Time Dispatches</span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-serif text-2xl font-bold text-[#C9A227] font-mono block">24x7</span>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Live Support</span>
                </div>
              </div>

              {/* CTA Buttons Required */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleBookNowScroll}
                  leftIcon={<Calendar className="w-4 h-4" />}
                >
                  Book Now
                </Button>

                <a href="tel:+919958956593">
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon={<Phone className="w-4 h-4 text-[#C9A227]" />}
                  >
                    Call Now
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 font-mono">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Sanitized Vehicles</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#C9A227]" /> Flight Radar Tracking</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-[#C9A227]" /> Flat All-Inclusive Rates</span>
              </div>

            </div>

            {/* Right Column: Premium Floating Booking Card */}
            <div className="lg:col-span-6">
              <BookingForm initialVehicle={selectedVehicle} initialTripType="OUTSTATION" />
            </div>

          </div>
        </Container>
      </section>

      {/* FLEET SHOWCASE SECTION */}
      <FleetShowcase onSelectVehicle={handleSelectVehicleFromFleet} />

      {/* WHY CHOOSE US SECTION */}
      <WhyChooseUs />

      {/* GOOGLE REVIEWS TRUST WIDGET */}
      <GoogleReviewsWidget />
    </div>
  );
};
