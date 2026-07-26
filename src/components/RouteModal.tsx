import React from 'react';
import { X, MapPin, Navigation, Clock, ShieldCheck, Phone, Calendar, ArrowRight, Car } from 'lucide-react';
import { PopularRoute } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useNavigate } from 'react-router-dom';

export interface RouteModalProps {
  route: PopularRoute | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RouteModal: React.FC<RouteModalProps> = ({
  route,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !route) return null;

  const handleBookRoute = () => {
    try {
      localStorage.setItem('luthra_prefill_pickup', route.origin);
      localStorage.setItem('luthra_prefill_drop', route.destination);
    } catch {
      // Storage fallback
    }

    onClose();
    navigate('/#booking-engine');

    setTimeout(() => {
      const element = document.getElementById('booking-engine');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  const defaultVehicles = [
    { title: 'Maruti Dzire', capacity: '4 Seats', note: 'Ideal for small groups / express transfers' },
    { title: 'Honda Amaze', capacity: '4 Seats', note: 'Sleek compact sedan, quiet cabin' },
    { title: 'Maruti Ertiga', capacity: '6 Seats', note: 'Spacious MPV for family luggage' },
    { title: 'Toyota Innova Crysta', capacity: '7 Seats', note: 'Luxury captain seats & maximum comfort' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="route-modal-title"
    >
      <div
        className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl shadow-black relative max-h-[90vh] flex flex-col justify-between animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close Route Details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Header Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="gold" dot>
              Intercity Route
            </Badge>
            <Badge variant="emerald" dot>
              Instant Dispatch
            </Badge>
          </div>

          {/* Route Title */}
          <div className="space-y-1">
            <span className="text-xs text-[#C9A227] font-mono uppercase tracking-widest block">
              Popular Intercity Taxi Route
            </span>
            <h2 id="route-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <span>{route.origin}</span>
              <Navigation className="w-5 h-5 text-[#C9A227] shrink-0" />
              <span className="text-[#C9A227]">{route.destination}</span>
            </h2>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800/80 text-center font-mono">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">Distance</span>
              <span className="text-sm font-bold text-white">{route.distance_km} KM</span>
            </div>
            <div>
              <Clock className="w-4 h-4 text-[#C9A227] mx-auto mb-0.5" />
              <span className="text-[10px] text-zinc-400 uppercase block">Est. Time</span>
              <span className="text-xs font-bold text-zinc-200">{route.estimated_time}</span>
            </div>
          </div>

          {/* Vehicle Options */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-[#C9A227]" /> Available Taxi Vehicle Options
            </h3>
            <div className="space-y-2">
              {defaultVehicles.map((v, i) => (
                <div key={i} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white block">{v.title}</span>
                    <span className="text-[11px] text-zinc-400 block">{v.note}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#C9A227] font-semibold">{v.capacity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Highlights */}
          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transparent billing with zero hidden driver night surcharges.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Door-to-door pickup from your location in {route.origin}.</span>
            </div>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 sm:p-6 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a href="tel:+919958956593" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              leftIcon={<Phone className="w-4 h-4 text-[#C9A227]" />}
            >
              Call Now (+91 99589 56593)
            </Button>
          </a>

          <Button
            variant="gold"
            size="md"
            fullWidth
            onClick={handleBookRoute}
            leftIcon={<Calendar className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Book This Route
          </Button>
        </div>

      </div>
    </div>
  );
};
