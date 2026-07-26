import React from 'react';
import { Award, ShieldCheck, Users, Clock, CheckCircle } from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';

export const About: React.FC = () => {
  const { settings } = useCMS();

  return (
    <div className="bg-slate-950 text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Est. 2011 • Delhi NCR</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
            14 Years of Uncompromised Mobility Excellence
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Luthra Travels was founded with a singular conviction: to eliminate the unreliability, poor vehicle hygiene, and surprise costs endemic to standard taxi aggregators.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <h2 className="font-serif text-3xl font-bold text-amber-400">
              Company-Owned Excellence
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike platform apps that outsource trips to random freelance drivers, Luthra Travels maintains an owned and direct fleet of over 65 luxury sedans, MPVs, and SUVs. Every car undergoes a 50-point safety check before leaving our depot.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              We serve over 28,000 satisfied families, Fortune 500 corporate houses, diplomatic guests, and luxury hotel guests across Delhi, Gurgaon, Noida, Agra, Jaipur, and Chandigarh.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <span className="font-serif text-3xl font-bold text-amber-400 font-mono block">65+</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Pristine Fleet Vehicles</span>
              </div>
              <div>
                <span className="font-serif text-3xl font-bold text-amber-400 font-mono block">45,000+</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Completed Trips</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop"
                alt="Luthra Travels Fleet Depot"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-amber-500/30 text-xs text-slate-300 space-y-1">
                <span className="font-serif font-bold text-amber-400 block text-sm">Gurgaon Operations Depot</span>
                <span>South City 1, Signature Towers Sector • 24/7 Dispatch Control</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
