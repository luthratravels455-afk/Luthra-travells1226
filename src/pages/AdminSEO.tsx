import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';
import { seoService } from '../services/seoService';
import { Copy, FileText, Code } from 'lucide-react';

export const AdminSEO: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'sitemap' | 'robots' | 'schema' | 'tracking'>('sitemap');
  const [copied, setTouchedCopied] = useState(false);
  const [sitemapXml, setSitemapXml] = useState<string>('Loading sitemap...');
  const [robotsTxt, setRobotsTxt] = useState<string>('Loading robots.txt...');

  useEffect(() => {
    const loadCode = async () => {
      try {
        const sm = await seoService.generateSitemapXml();
        const rb = await seoService.generateRobotsTxt();
        setSitemapXml(sm);
        setRobotsTxt(rb);
      } catch (err) {
        console.error('Error generating SEO code:', err);
      }
    };
    loadCode();
  }, []);

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(sitemapXml);
    setTouchedCopied(true);
    showToast('XML Sitemap copied to clipboard!', 'success');
    setTimeout(() => setTouchedCopied(false), 3000);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-28 pb-20">
      <Container size="7xl" className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
          <div>
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">SEO &amp; Analytics Engine</span>
            <h1 className="font-serif text-3xl font-bold text-white">Admin SEO CMS Control Center</h1>
          </div>
          <Button variant="gold" size="sm" onClick={handleCopySitemap} leftIcon={<Copy className="w-4 h-4" />}>
            {copied ? 'Copied Sitemap' : 'Copy Sitemap XML'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-zinc-900 p-2 rounded-2xl border border-zinc-800">
          {[
            { id: 'sitemap', label: 'XML Sitemap' },
            { id: 'robots', label: 'robots.txt' },
            { id: 'schema', label: 'JSON-LD Schemas' },
            { id: 'tracking', label: 'Google Ads & Tracking' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all uppercase ${
                activeTab === tab.id ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'sitemap' && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-serif font-bold text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C9A227]" /> Generated XML Sitemap (Automatic)
            </h3>
            <textarea
              readOnly
              rows={12}
              value={sitemapXml}
              className="w-full bg-zinc-950 font-mono text-xs text-[#C9A227] p-4 rounded-xl border border-zinc-800 focus:outline-none"
            />
          </div>
        )}

        {activeTab === 'robots' && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-serif font-bold text-white text-lg flex items-center gap-2">
              <Code className="w-5 h-5 text-[#C9A227]" /> Generated robots.txt
            </h3>
            <textarea
              readOnly
              rows={8}
              value={robotsTxt}
              className="w-full bg-zinc-950 font-mono text-xs text-emerald-400 p-4 rounded-xl border border-zinc-800 focus:outline-none"
            />
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 text-xs text-zinc-300">
            <h3 className="font-serif font-bold text-white text-lg">Google Ads &amp; Analytics Conversion Architecture</h3>
            <p className="leading-relaxed">
              Tracking architecture is live across all pages via <code className="text-[#C9A227] bg-zinc-950 px-1 py-0.5 rounded">AnalyticsTracker</code>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="font-bold text-white block text-sm">Call Conversion Tracking</span>
                <span>Fires event <code className="text-amber-400">call_button_click</code> on +91 99589 56593 clicks.</span>
              </div>
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="font-bold text-white block text-sm">WhatsApp Conversion Tracking</span>
                <span>Fires event <code className="text-emerald-400">whatsapp_click</code> on wa.me links.</span>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
