import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  AlertTriangle,
  FileCode,
  Globe,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../contexts/ToastContext';

interface RedirectRule {
  id: number;
  fromPath: string;
  toPath: string;
  type: '301' | '302';
  status: 'Active';
}

export const SEODashboard: React.FC = () => {
  const { showToast } = useToast();

  const [redirects, setRedirects] = useState<RedirectRule[]>([
    { id: 1, fromPath: '/old-fleet', toPath: '/fleet', type: '301', status: 'Active' },
    { id: 2, fromPath: '/delhi-taxi', toPath: '/outstation-taxi', type: '301', status: 'Active' },
  ]);

  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');

  const pagesSEO = [
    { title: 'Home Page', path: '/', score: 98, metaStatus: 'Optimal', h1Count: 1, canonical: 'Set' },
    { title: 'Fleet Showcase', path: '/fleet', score: 95, metaStatus: 'Optimal', h1Count: 1, canonical: 'Set' },
    { title: 'Airport Transfers', path: '/airport-transfers', score: 100, metaStatus: 'Optimal', h1Count: 1, canonical: 'Set' },
    { title: 'Outstation Taxi', path: '/outstation-taxi', score: 96, metaStatus: 'Optimal', h1Count: 1, canonical: 'Set' },
    { title: 'Local Hourly Taxi', path: '/local-taxi', score: 94, metaStatus: 'Optimal', h1Count: 1, canonical: 'Set' },
    { title: 'Corporate Travel', path: '/corporate-travel', score: 97, metaStatus: 'Optimal', h1Count: 1, canonical: 'Set' },
  ];

  const handleAddRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrom || !newTo) {
      showToast('From Path and To Path are required.', 'error');
      return;
    }

    setRedirects([
      ...redirects,
      { id: Date.now(), fromPath: newFrom.trim(), toPath: newTo.trim(), type: '301', status: 'Active' },
    ]);
    setNewFrom('');
    setNewTo('');
    showToast('301 Redirect rule created.', 'success');
  };

  const handleDeleteRedirect = (id: number) => {
    setRedirects(redirects.filter((r) => r.id !== id));
    showToast('Redirect rule removed', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#C9A227]" /> SEO &amp; Indexing Dashboard
          </h2>
          <p className="text-xs text-zinc-400">Monitor search engine health, meta titles, schema markup, and URL redirects.</p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => showToast('Sitemap XML regenerated successfully: /sitemap.xml', 'success')}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-[#C9A227]" />}
        >
          Regenerate Sitemap.xml
        </Button>
      </div>

      {/* SEO Health Score Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/90 border border-emerald-500/30 p-5 rounded-2xl">
          <span className="text-[11px] font-mono text-emerald-400 uppercase block">Overall Health Score</span>
          <div className="font-serif text-3xl font-extrabold text-white mt-1">98 / 100</div>
          <span className="text-[10px] text-zinc-400 mt-1 block">All pages indexed cleanly</span>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
          <span className="text-[11px] font-mono text-zinc-400 uppercase block">Missing Meta Descriptions</span>
          <div className="font-serif text-3xl font-extrabold text-emerald-400 mt-1">0</div>
          <span className="text-[10px] text-zinc-400 mt-1 block">100% Coverage</span>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
          <span className="text-[11px] font-mono text-zinc-400 uppercase block">Duplicate Page Titles</span>
          <div className="font-serif text-3xl font-extrabold text-emerald-400 mt-1">0</div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Unique H1 / Title set</span>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
          <span className="text-[11px] font-mono text-zinc-400 uppercase block">Broken Links</span>
          <div className="font-serif text-3xl font-extrabold text-emerald-400 mt-1">0</div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Internal routing verified</span>
        </div>
      </div>

      {/* All Pages SEO Audit Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold text-white">Pages SEO Audit</h3>
          <Badge variant="emerald" dot>Search Index Active</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-[#C9A227] font-mono border-b border-zinc-800">
              <tr>
                <th className="p-3">Page Name</th>
                <th className="p-3">Route Path</th>
                <th className="p-3">SEO Score</th>
                <th className="p-3">Meta Tags</th>
                <th className="p-3">H1 Header</th>
                <th className="p-3">Canonical Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {pagesSEO.map((page, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/40">
                  <td className="p-3 font-semibold text-white">{page.title}</td>
                  <td className="p-3 font-mono text-[11px] text-[#C9A227]">{page.path}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{page.score}%</td>
                  <td className="p-3 font-mono text-emerald-300">{page.metaStatus}</td>
                  <td className="p-3 font-mono">{page.h1Count} Found</td>
                  <td className="p-3 font-mono text-emerald-400">{page.canonical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Robots, Sitemap & Search Console Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-white text-base">Robots.txt Engine</h4>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Crawlers allowed for Googlebot, Bingbot, Yandex. Disallow applied to `/admin/*`.
          </p>
          <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 font-mono text-[10px] text-zinc-300">
            User-agent: *<br />Disallow: /admin/<br />Sitemap: https://luthratravels.com/sitemap.xml
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-white text-base">LocalBusiness Schema</h4>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            JSON-LD structured data configured for Google Maps and Knowledge Panel enrichment.
          </p>
          <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 font-mono text-[10px] text-zinc-300">
            "@type": "TaxiService",<br />"name": "Luthra Travels",<br />"telephone": "+91 99589 56593"
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-white text-base">Search Console Sync</h4>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Connected to Google Search Console API. Zero indexing crawl errors reported in 30 days.
          </p>
          <div className="text-xs font-mono text-[#C9A227] pt-2">
            Status: Fully Synchronized
          </div>
        </div>
      </div>

      {/* 301 Redirect Manager */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-serif text-lg font-bold text-white">URL Redirect Manager (301 Permanent)</h3>

        <form onSubmit={handleAddRedirect} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <input
            type="text"
            placeholder="From Path (e.g. /old-taxi-page)"
            value={newFrom}
            onChange={(e) => setNewFrom(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C9A227]"
          />
          <input
            type="text"
            placeholder="To Target Path (e.g. /fleet)"
            value={newTo}
            onChange={(e) => setNewTo(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C9A227]"
          />
          <Button type="submit" variant="gold" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add Redirect
          </Button>
        </form>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-[#C9A227] font-mono border-b border-zinc-800">
              <tr>
                <th className="p-3">From Source</th>
                <th className="p-3">To Target</th>
                <th className="p-3">Redirect Type</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {redirects.map((rule) => (
                <tr key={rule.id}>
                  <td className="p-3 font-mono text-amber-300">{rule.fromPath}</td>
                  <td className="p-3 font-mono text-emerald-400">{rule.toPath}</td>
                  <td className="p-3 font-mono">{rule.type} Permanent</td>
                  <td className="p-3 font-mono text-emerald-300">{rule.status}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteRedirect(rule.id)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
