import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-slate-950 text-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6 prose prose-invert">
        <h1 className="font-serif text-4xl font-bold text-amber-400">Privacy Policy</h1>
        <p className="text-sm text-slate-400 font-mono">Last Updated: February 2025</p>

        <p className="text-slate-300 text-sm leading-relaxed">
          At Luthra Travels, we respect the confidentiality of our passengers, corporate clients, and online guests. This Privacy Policy details how we handle information collected during booking and travel.
        </p>

        <h3 className="text-lg font-serif font-bold text-white">1. Information We Collect</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          We collect essential details required for dispatching chauffeur services: passenger name, phone number, pickup/drop addresses, flight details, and email address for digital invoices.
        </p>

        <h3 className="text-lg font-serif font-bold text-white">2. Data Discretion</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          We never sell, rent, or trade client personal data to third-party marketing firms. Information is strictly shared with assigned chauffeurs and operational dispatchers for flight tracking and navigation.
        </p>

        <h3 className="text-lg font-serif font-bold text-white">3. Payment Security</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          All digital payments, UPI transfers, and card transactions are handled through encrypted RBI-compliant payment gateways.
        </p>
      </div>
    </div>
  );
};
