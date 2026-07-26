import React, { useState, useEffect, useMemo } from 'react';
import { Search, HelpCircle, ChevronDown, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { FAQItem } from '../types';
import { cmsService } from '../services/cmsService';
import { Container } from './ui/Container';
import { SectionTitle } from './ui/Typography';
import { CardSkeleton } from './ui/Skeleton';
import { EmptyState } from './ui/EmptyState';

export interface FAQModuleProps {
  showTitle?: boolean;
  limit?: number;
}

export const FAQModule: React.FC<FAQModuleProps> = ({
  showTitle = true,
  limit,
}) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [openId, setOpenId] = useState<number | null>(1);

  const categories = [
    'ALL',
    'Booking',
    'Airport',
    'Outstation',
    'Local Taxi',
    'Corporate',
    'Payments',
    'Pricing',
  ];

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await cmsService.getFaqs();
        // Sort by sorting_order
        const sorted = (data || []).sort((a, b) => (a.sorting_order || 0) - (b.sorting_order || 0));
        setFaqs(sorted.filter((f) => f.is_active !== false));
      } catch (err) {
        console.error('Error loading FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFaqs();
  }, []);

  // Filter logic
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        faq.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        (faq.category && faq.category.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const displayedFaqs = limit ? filteredFaqs.slice(0, limit) : filteredFaqs;

  const toggleAccordion = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Structured FAQ Schema for SEO
  const faqSchema = useMemo(() => {
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: displayedFaqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
    return JSON.stringify(schemaData);
  }, [displayedFaqs]);

  return (
    <section id="faq-module" className="py-16 bg-zinc-950 text-white relative overflow-hidden">
      {/* JSON-LD Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchema }}
      />

      <Container size="7xl" className="space-y-10 relative z-10">
        
        {showTitle && (
          <SectionTitle
            tag="Concierge Desk Support"
            title="Frequently Asked Questions"
            subtitle="Find instant answers regarding booking, airport transfers, rate calculations, payments, and corporate mobility accounts."
          />
        )}

        {/* Search Bar & Category Filter Bar */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search questions (e.g. airport pickup, GST invoice, cancellation, rate/km)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-[#C9A227] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors shadow-lg"
              aria-label="Search FAQs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#C9A227] text-zinc-950 shadow-md shadow-[#C9A227]/20 font-extrabold'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Questions List */}
        {loading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {[1, 2, 3, 4].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : displayedFaqs.length === 0 ? (
          <EmptyState
            title="No Matching Questions Found"
            description={`We couldn't find any FAQs matching "${searchQuery}". Try selecting another category or clear your search query.`}
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
          />
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {displayedFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              const regionId = `faq-answer-${faq.id}`;
              const buttonId = `faq-button-${faq.id}`;

              return (
                <div
                  key={faq.id}
                  className={`bg-zinc-900/80 backdrop-blur-md border ${
                    isOpen ? 'border-[#C9A227]/50 shadow-lg shadow-[#C9A227]/5' : 'border-zinc-800/80 hover:border-zinc-700'
                  } rounded-2xl overflow-hidden transition-all duration-300`}
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={regionId}
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? 'text-[#C9A227]' : 'text-zinc-500'}`} />
                      <span className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                        {faq.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {faq.category && (
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-zinc-950 text-[#C9A227] border border-zinc-800">
                          {faq.category}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-5 h-5 text-[#C9A227] transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={regionId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-4 animate-fadeIn"
                    >
                      <p className="whitespace-pre-line">{faq.answer}</p>

                      <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified Concierge Policy
                        </span>
                        <span>Category: {faq.category || 'General'}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </Container>
    </section>
  );
};
