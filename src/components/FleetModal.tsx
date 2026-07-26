import React from 'react';
import { X, Users, Briefcase, Wind, CheckCircle, ShieldCheck, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { FleetVehicle } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export interface FleetModalProps {
  vehicle: FleetVehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (vehicleTitle: string) => void;
}

export const FleetModal: React.FC<FleetModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onBookNow,
}) => {
  if (!isOpen || !vehicle) return null;

  const handleBookClick = () => {
    onBookNow(vehicle.title);
    onClose();
  };

  const suitableForList = [
    'IGI Airport Transfers & Meet & Greet',
    'Intercity Outstation Road Trips',
    'Local City Hourly Rentals',
    'Corporate Executive Travel',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="fleet-modal-title"
    >
      <div
        className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl shadow-black relative max-h-[90vh] flex flex-col justify-between animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close Vehicle Details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Image & Header Overlay */}
          <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
            <img
              src={vehicle.image_url}
              alt={vehicle.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Badge variant="gold" dot>
                {vehicle.tag || 'Popular Taxi'}
              </Badge>
              <Badge variant="emerald" dot>
                Available Now
              </Badge>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div>
                <span className="text-xs text-[#C9A227] font-mono uppercase tracking-widest block">
                  {vehicle.category}
                </span>
                <h2 id="fleet-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {vehicle.title}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> 100% Sanitized
                </span>
              </div>
            </div>
          </div>

          {/* Specs Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800/80 text-center">
            <div>
              <Users className="w-5 h-5 text-[#C9A227] mx-auto mb-1" />
              <span className="text-[10px] text-zinc-400 uppercase block font-mono">Passengers</span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono">{vehicle.capacity_passengers} Seats</span>
            </div>
            <div>
              <Briefcase className="w-5 h-5 text-[#C9A227] mx-auto mb-1" />
              <span className="text-[10px] text-zinc-400 uppercase block font-mono">Luggage</span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono">{vehicle.luggage_count} Large Bags</span>
            </div>
            <div>
              <Wind className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] text-zinc-400 uppercase block font-mono">Climate</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-300 font-mono">Dual AC</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A227]" /> Vehicle Overview
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Features List */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-white">Equipped Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800">
                    <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suitable For */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-white">Ideal Suitable Journeys</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
              {suitableForList.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-4">
          <div className="text-xs text-zinc-400 font-mono">
            Flat All-Inclusive Billing • Direct Concierge Confirmation
          </div>
          <Button
            variant="gold"
            size="md"
            onClick={handleBookClick}
            leftIcon={<Calendar className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Book This Taxi
          </Button>
        </div>

      </div>
    </div>
  );
};
