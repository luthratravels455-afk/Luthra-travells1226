import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fleetService } from '../services/fleetService';
import { FleetVehicle } from '../types';
import { BookingForm } from '../components/BookingForm';
import { Users, Briefcase, Fuel, Shield, Check, ArrowLeft, Phone, ShieldCheck } from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';

export const FleetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { settings } = useCMS();
  const [vehicle, setVehicle] = useState<FleetVehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) return;
      try {
        const data = await fleetService.getVehicleById(parseInt(id, 10));
        setVehicle(data);
      } catch (err) {
        console.error('Error fetching vehicle detail:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-32">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center pt-32 gap-4">
        <h2 className="text-2xl font-serif font-bold">Vehicle Not Found</h2>
        <Link to="/fleet" className="text-amber-400 underline">Back to Fleet Catalog</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        <Link to="/fleet" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors text-xs uppercase font-mono tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Back to Fleet Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Specs & Image */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 h-[400px]">
              <img
                src={vehicle.image_url}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              {vehicle.tag && (
                <span className="absolute top-6 left-6 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  {vehicle.tag}
                </span>
              )}
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">{vehicle.category}</span>
              <h1 className="font-serif text-4xl font-bold text-white">{vehicle.title}</h1>
              <p className="text-slate-300 text-base leading-relaxed">{vehicle.description}</p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                <Users className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <span className="text-xs text-slate-400 block uppercase">Capacity</span>
                <span className="text-base font-bold text-white font-mono">{vehicle.capacity_passengers} Seats</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                <Briefcase className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <span className="text-xs text-slate-400 block uppercase">Luggage</span>
                <span className="text-base font-bold text-white font-mono">{vehicle.luggage_count} Bags</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                <Fuel className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <span className="text-xs text-slate-400 block uppercase">Fuel</span>
                <span className="text-base font-bold text-white font-mono">{vehicle.fuel_type || 'Diesel'}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <span className="text-xs text-slate-400 block uppercase">Sanitation</span>
                <span className="text-base font-bold text-emerald-300 font-mono">100% Clean</span>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-serif text-xl font-bold text-white">Included Vehicle Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Booking Engine */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Company Owned Fleet
              </span>
              <h3 className="text-white font-serif font-bold text-xl">Direct Concierge Dispatch</h3>
              <p className="text-xs text-slate-400">
                Transparent flat billing with zero night surcharges or toll markups.
              </p>
            </div>

            <BookingForm initialVehicle={vehicle.title} />

            <a
              href={`tel:${settings.phone_primary}`}
              className="w-full bg-slate-900 border border-slate-800 hover:border-amber-400 text-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-wider transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" /> Phone Support: {settings.phone_primary}
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};