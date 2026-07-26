import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Phone, MapPin, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { PageSEO } from '../components/ui/SEO';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-36 pb-24 flex items-center justify-center relative overflow-hidden">
      <PageSEO
        title="404 - Page Not Found"
        description="The requested page on Luthra Travels could not be found. Please navigate back to our homepage or explore our taxi services."
      />

      {/* Subtle Background Radial Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C9A227]/5 blur-[140px] rounded-full pointer-events-none" />

      <Container size="sm" className="relative z-10 text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-mono uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5" /> 404 Route Unmapped
        </div>

        {/* Big 404 Hero */}
        <div className="space-y-3">
          <h1 className="font-serif text-7xl sm:text-8xl font-black tracking-tight text-white gold-gradient-text">
            404
          </h1>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Destination Route Not Found
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            The page or route you are looking for may have been moved, renamed, or does not exist on Luthra Travels.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button
            variant="gold"
            size="md"
            onClick={() => navigate('/')}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Back to Home
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-4 h-4 text-[#C9A227]" />}
          >
            Go Back
          </Button>
        </div>

        {/* Quick Links Menu */}
        <div className="pt-8 border-t border-zinc-800/80 space-y-4 max-w-md mx-auto text-xs text-zinc-400">
          <span className="font-mono text-[#C9A227] uppercase tracking-wider block font-semibold">
            Explore Popular Taxi Services
          </span>
          <div className="grid grid-cols-2 gap-2 text-left font-medium">
            <Link to="/airport-transfers" className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#C9A227] hover:text-white transition-colors flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9A227]" /> Airport Transfers
            </Link>
            <Link to="/outstation-taxi" className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#C9A227] hover:text-white transition-colors flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C9A227]" /> Outstation Taxi
            </Link>
            <Link to="/fleet" className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#C9A227] hover:text-white transition-colors flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#C9A227]" /> Fleet Catalog
            </Link>
            <Link to="/contact" className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#C9A227] hover:text-white transition-colors flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C9A227]" /> 24/7 Helpline
            </Link>
          </div>
        </div>

      </Container>
    </div>
  );
};

export default NotFound;
