import React from 'react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="bg-slate-950 text-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6 prose prose-invert">
        <h1 className="font-serif text-4xl font-bold text-amber-400">Terms & Conditions</h1>
        <p className="text-sm text-slate-400 font-mono">Effective: February 2025</p>

        <p className="text-slate-300 text-sm leading-relaxed">
          By reserving a vehicle with Luthra Travels, you agree to our operational guidelines and transparent service terms outlined below.
        </p>

        <h3 className="text-lg font-serif font-bold text-white">1. Tolls & State Permit Taxes</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          All fixed outstation packages include driver allowance and vehicle fuel. Toll taxes and state entry permits are billed at actual receipt costs unless explicitly noted as all-inclusive.
        </p>

        <h3 className="text-lg font-serif font-bold text-white">2. Free Waiting Allowance</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Airport transfers include 60 minutes of complimentary waiting time post flight landing. Point-to-point city pickups include 15 minutes complimentary waiting time.
        </p>

        <h3 className="text-lg font-serif font-bold text-white">3. Cancellation Policy</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Free cancellation is available up to 4 hours prior to scheduled pickup for city/airport transfers, and up to 12 hours prior for outstation round trips.
        </p>
      </div>
    </div>
  );
};
