import React, { useState } from 'react';
import { Navigation, Clock, Calendar, ArrowRight, Info } from 'lucide-react';
import { PopularRoute } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { RouteModal } from './RouteModal';
import { useNavigate } from 'react-router-dom';

export interface RouteCardProps {
  route: PopularRoute;
  onBookRoute?: (route: PopularRoute) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  onBookRoute,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (onBookRoute) {
      onBookRoute(route);
    } else {
      try {
        localStorage.setItem('luthra_prefill_pickup', route.origin);
        localStorage.setItem('luthra_prefill_drop', route.destination);
      } catch {
        // Storage fallback
      }
      navigate('/#booking-engine');
      setTimeout(() => {
        const element = document.getElementById('booking-engine');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    }
  };

  return (
    <>
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 hover:border-[#C9A227]/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C9A227]/10 flex flex-col justify-between group space-y-4">
        
        {/* Header Badges */}
        <div className="flex justify-between items-center">
          <Badge variant="gold" dot>
            Intercity Route
          </Badge>
          <span className="text-[11px] font-mono text-zinc-400">
            {route.distance_km} KM
          </span>
        </div>

        {/* Route Cities */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] text-[#C9A227] font-mono uppercase tracking-widest block">
            Executive Route
          </span>
          <div className="flex items-center gap-2 font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#C9A227] transition-colors">
            <span>{route.origin}</span>
            <Navigation className="w-4 h-4 text-[#C9A227] shrink-0" />
            <span className="text-[#C9A227]">{route.destination}</span>
          </div>
        </div>

        {/* Distance & Time */}
        <div className="grid grid-cols-2 gap-2 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
            <span>{route.estimated_time}</span>
          </div>
          <div className="text-right text-zinc-400">
            <span>{route.vehicle_type || 'Selected Taxi'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setModalOpen(true)}
            leftIcon={<Info className="w-3.5 h-3.5 text-[#C9A227]" />}
          >
            Details
          </Button>

          <Button
            variant="gold"
            size="sm"
            onClick={handleBookNow}
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Book Now
          </Button>
        </div>

      </div>

      {/* Details Modal */}
      <RouteModal
        route={route}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};
