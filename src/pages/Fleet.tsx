import React, { useState, useEffect } from 'react';
import { fleetService } from '../services/fleetService';
import { FleetVehicle } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { BookingForm } from '../components/BookingForm';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const Fleet: React.FC = () => {
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedVehicleTitle, setSelectedVehicleTitle] = useState('Toyota Innova Crysta');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFleet = async () => {
      try {
        const data = await fleetService.getAllFleet();
        setFleet(data);
      } catch (err) {
        console.error('Error loading fleet:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFleet();
  }, []);

  const filteredFleet = categoryFilter === 'ALL'
    ? fleet
    : fleet.filter(v => v.category.toLowerCase().includes(categoryFilter.toLowerCase()) || (v.tag && v.tag.toLowerCase().includes(categoryFilter.toLowerCase())));

  const handleBookVehicle = (title: string) => {
    setSelectedVehicleTitle(title);
    const element = document.getElementById('booking-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Company Owned Fleet
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
            The Luthra Travels Fleet
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From executive business sedans to 12-seater Maharaja luxury coaches. Every vehicle is company owned, fully insured, sanitized daily, and equipped with amenities.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 max-w-2xl mx-auto">
          {['ALL', 'MPV', 'Sedan', 'SUV', 'VIP Luxury', 'Group'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Fleet Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-slate-900/50 h-96 rounded-2xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFleet.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} onBookNow={handleBookVehicle} />
            ))}
          </div>
        )}

        {/* Embedded Booking Section */}
        <div id="booking-section" className="pt-12 border-t border-slate-900">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Instant Reservation</span>
            <h2 className="font-serif text-3xl font-bold text-white mt-1">
              Book Your Selected Fleet Vehicle
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <BookingForm initialVehicle={selectedVehicleTitle} />
          </div>
        </div>

      </div>
    </div>
  );
};
