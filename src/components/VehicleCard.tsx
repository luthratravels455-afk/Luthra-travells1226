import React, { useState } from 'react';
import { Users, Briefcase, Wind, Check, Calendar, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import { FleetVehicle } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { FleetModal } from './FleetModal';

export interface VehicleCardProps {
  vehicle: FleetVehicle;
  onBookNow: (vehicleTitle: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onBookNow,
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleBook = () => {
    onBookNow(vehicle.title);
  };

  return (
    <>
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 hover:border-[#C9A227]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C9A227]/10 flex flex-col justify-between group">
        
        {/* Card Header & Image */}
        <div className="relative h-56 overflow-hidden bg-zinc-950">
          <img
            src={vehicle.image_url}
            alt={vehicle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {vehicle.tag && (
              <Badge variant="gold">
                {vehicle.tag}
              </Badge>
            )}
            <Badge variant="emerald" dot>
              Available
            </Badge>
          </div>

          {/* Bottom Title overlay without fare price */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
            <div>
              <span className="text-[10px] text-[#C9A227] uppercase font-mono tracking-widest block">
                {vehicle.category}
              </span>
              <h3 className="font-serif text-xl font-bold text-white tracking-wide">
                {vehicle.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Clean &amp; Sanitized
              </span>
            </div>
          </div>
        </div>

        {/* Card Specs Body */}
        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {vehicle.description}
          </p>

          {/* Specs Icons Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 text-center font-mono">
            <div className="flex items-center justify-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
              <span>{vehicle.capacity_passengers} Seats</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
              <span>{vehicle.luggage_count} Bags</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-emerald-300">Air Cond.</span>
            </div>
          </div>

          {/* Clean Feature Highlights */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {vehicle.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <Check className="w-3 h-3 text-[#C9A227] shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDetailsModalOpen(true)}
              leftIcon={<Info className="w-3.5 h-3.5 text-[#C9A227]" />}
            >
              View Details
            </Button>

            <Button
              variant="gold"
              size="sm"
              onClick={handleBook}
              leftIcon={<Calendar className="w-3.5 h-3.5" />}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Fleet Details Modal */}
      <FleetModal
        vehicle={vehicle}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onBookNow={onBookNow}
      />
    </>
  );
};
