import React from 'react';
import { FAQModule } from '../components/FAQModule';
import { PageSEO } from '../components/ui/SEO';

export const FAQPage: React.FC = () => {
  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-28 pb-20">
      <PageSEO
        title="Frequently Asked Questions & Support"
        description="Find answers to common taxi booking, airport pickup, outstation trip, rate calculation, GST invoice, and payment questions with Luthra Travels."
      />
      <FAQModule showTitle={true} />
    </div>
  );
};
