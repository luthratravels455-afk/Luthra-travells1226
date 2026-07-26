import React, { useState, useEffect } from 'react';
import { SectionTitle } from './ui/Typography';
import { Container } from './ui/Container';
import { VehicleCard } from './VehicleCard';
import { fleetService } from '../services/fleetService';
import { FleetVehicle } from '../types';
import { CardSkeleton } from './ui/Skeleton';
import { Sparkles, ShieldCheck } from 'lucide-react';

export interface FleetShowcaseProps {
  onSelectVehicle?: (vehicleTitle: string) => void;
}

export const FleetShowcase: React.FC<FleetShowcaseProps> = ({ onSelectVehicle }) => {
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFleetData = async () => {
      try {
        const vehicles = await fleetService.getAllFleet();
        // Ensure ONLY active non-imported vehicles are displayed
        setFleet((vehicles || []).filter((v) => v.is_active !== false));
      } catch (err) {
        console.error('Error loading fleet showcase:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFleetData();
  }, []);

  const handleBookVehicle = (title: string) => {
    if (onSelectVehicle) {
      onSelectVehicle(title);
    }
    const element = document.getElementById('booking-engine');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="fleet-showcase" className="py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C9A227]/5 blur-[120px] rounded-full pointer-events-none" />

      <Container size="7xl" className="relative z-10 space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <SectionTitle
            tag="Company Owned Taxi Fleet"
            title="Luxury Fleet"
            subtitle="Choose the perfect vehicle for your journey. Every ride is maintained to the highest standards for comfort, safety and reliability."
          />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" /> All-Inclusive Flat Fares • Zero Hidden Charges
          </div>
        </div>

        {/* Fleet Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fleet.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onBookNow={handleBookVehicle}
              />
            ))}
          </div>
        )}

        {/* Bottom Trust Guarantee */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              100% Guaranteed Vehicle Dispatch • Cleaned &amp; Sanitized After Every Trip • Professional Master Chauffeurs
            </span>
          </div>
          <span className="font-mono text-[#C9A227] font-semibold shrink-0">
            No Extra Driver Night Surcharges
          </span>
        </div>

      </Container>
    </section>
  );
};
