import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  AlertTriangle,
  CheckCircle,
  Code,
  FileText,
  Save,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Layers,
  Copy,
  Info,
} from 'lucide-react';
import { seoService, PageSEORecord } from '../../services/seoService';
import { cmsService } from '../../services/cmsService';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../ui/Button';

export const SEOManager: React.FC = () => {
  const { showToast } = useToast();

  const corePages = [
    { path: '/', label: 'Home Page (/)' },
    { path: '/fleet', label: 'Fleet Catalog (/fleet)' },
    { path: '/airport-transfers', label: 'Airport Transfers (/airport-transfers)' },
    { path: '/outstation-taxi', label: 'Outstation Taxi (/outstation-taxi)' },
    { path: '/local-taxi', label: 'Local Taxi (/local-taxi)' },
    { path: '/corporate-travel', label: 'Corporate Travel (/corporate-travel)' },
    { path: '/about', label: 'About Us (/about)' },
    { path: '/blog', label: 'Blog Journal (/blog)' },
    { path: '/gallery', label: 'Photo Gallery (/gallery)' },
    { path: '/faq', label: 'FAQ Support (/faq)' },
    { path: '/contact', label: 'Contact Us (/contact)' },
  ];

  const [selectedPath, setSelectedPath] = useState<string>('/');
  const [allSeoRecords, setAllSeoRecords] = useState<PageSEORecord[]>([]);
  const [currentSeo, setCurrentSeo] = useState<Partial<PageSEORecord>>({
    page_path: '/',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    robots_meta: 'index, follow',
    og_title: '',
    og_description: '',
    og_image: '',
    og_type: 'website',
    twitter_card: 'summary_large_image',
    schema_type: 'LocalBusiness',
    custom_json_ld: '',
  });

  const [robotsTxt, setRobotsTxt] = useState<string>(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: https://luthratravels.com/api/sitemap`
  );

  const [slugInput, setSlugInput] = useState<string>('');
  const [generatedSlug, setGeneratedSlug] = useState<string>('');
  const [saving, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSEOData = async () => {
    setLoading(true);
    try {
      const records = await seoService.getAllPageSEO();
      setAllSeoRecords(records);

      const activeRec = records.find((r) => r.page_path === selectedPath);
      if (activeRec) {
        setCurrentSeo(activeRec);
      } else {
        setCurrentSeo({
          page_path: selectedPath,
          meta_title: 'Luthra Travels',
          meta_description: '',
          canonical_url: `https://luthratravels.com${selectedPath}`,
          robots_meta: 'index, follow',
          og_title: '',
          og_description: '',
          og_image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
          og_type: 'website',
          twitter_card: 'summary_large_image',
          schema_type: 'LocalBusiness',
          custom_json_ld: '',
        });
      }

      const settings = await cmsService.getSettings();
      if (settings.robots_txt) {
        setRobotsTxt(settings.robots_txt);
      }
    } catch (err: any) {
      showToast('Error fetching SEO data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSEOData();
  }, [selectedPath]);

  // Auto Slug Generator
  const handleGenerateSlug = (text: string) => {
    setSlugInput(text);
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setGeneratedSlug(slug);
  };

  // SEO Score Calculation
  const calculateSEOScore = () => {
    let score = 0;
    const titleLen = (currentSeo.meta_title || '').length;
    const descLen = (currentSeo.meta_description || '').length;

    if (titleLen >= 30 && titleLen <= 60) score += 25;
    else if (titleLen > 0) score += 12;

    if (descLen >= 120 && descLen <= 160) score += 25;
    else if (descLen > 0) score += 12;

    if (currentSeo.canonical_url) score += 15;
    if (currentSeo.og_image) score += 15;
    if (currentSeo.robots_meta?.includes('index')) score += 10;
    if (currentSeo.schema_type) score += 10;

    return Math.min(100, score);
  };

  const getMissingWarnings = () => {
    const warnings: string[] = [];
    const titleLen = (currentSeo.meta_title || '').length;
    const descLen = (currentSeo.meta_description || '').length;

    if (titleLen === 0) warnings.push('Meta Title is missing.');
    else if (titleLen < 30) warnings.push('Meta Title is short (< 30 characters).');
    else if (titleLen > 60) warnings.push('Meta Title is long (> 60 characters).');

    if (descLen === 0) warnings.push('Meta Description is missing.');
    else if (descLen < 120) warnings.push('Meta Description is short (< 120 characters).');
    else if (descLen > 160) warnings.push('Meta Description exceeds 160 characters.');

    if (!currentSeo.canonical_url) warnings.push('Canonical URL is not specified.');
    if (!currentSeo.og_image) warnings.push('Open Graph social share image is missing.');

    return warnings;
  };

  const seoScore = calculateSEOScore();
  const warnings = getMissingWarnings();

  const handleSavePageSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await seoService.savePageSEO({
        ...currentSeo,
        page_path: selectedPath,
      });
      showToast(`SEO settings saved for ${selectedPath}!`, 'success');
      loadSEOData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveRobotsTxt = async () => {
    try {
      await cmsService.updateSettings({ robots_txt: robotsTxt });
      showToast('Robots.txt updated in Supabase settings!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#C9A227]" /> Enterprise SEO Management System
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure dynamic Meta Tags, Open Graph cards, Robots policy, and JSON-LD Schemas across all routes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/sitemap"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900 border border-zinc-800 hover:border-[#C9A227] text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#C9A227]" /> View Sitemap.xml <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/api/robots"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900 border border-zinc-800 hover:border-[#C9A227] text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-[#C9A227]" /> View Robots.txt <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Page Selector & Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Page Switcher */}
        <div className="lg:col-span-8 bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-3">
          <label className="text-xs font-semibold text-zinc-300 block uppercase font-mono">
            Select Route to Audit &amp; Configure:
          </label>
          <select
            value={selectedPath}
            onChange={(e) => setSelectedPath(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-sm text-white font-mono font-semibold"
          >
            {corePages.map((p) => (
              <option key={p.path} value={p.path}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* SEO Score Health Indicator */}
        <div className="lg:col-span-4 bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase block">SEO Health Index</span>
            <div className="text-2xl font-serif font-bold text-white mt-1 flex items-center gap-2">
              <span>{seoScore}%</span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                seoScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                seoScore >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {seoScore >= 80 ? 'Optimal' : seoScore >= 50 ? 'Needs Optimization' : 'Poor'}
              </span>
            </div>
          </div>

          <div className="w-16 h-16 rounded-full border-4 border-zinc-800 flex items-center justify-center font-mono font-bold text-sm text-[#C9A227] relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-zinc-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={seoScore >= 80 ? 'text-emerald-400' : seoScore >= 50 ? 'text-[#C9A227]' : 'text-rose-400'}
                strokeDasharray={`${seoScore}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white">{seoScore}%</span>
          </div>
        </div>

      </div>

      {/* GOOGLE SERP LIVE PREVIEW */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
            Google SERP Snippet Preview
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">Live Search Rendering</span>
        </div>

        {/* Google Result Mockup Card */}
        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800/80 space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <div className="w-4 h-4 rounded-full bg-[#C9A227] text-zinc-950 font-serif font-black flex items-center justify-center text-[9px]">
              LT
            </div>
            <span className="text-zinc-300 font-medium">Luthra Travels</span>
            <span className="text-zinc-600">›</span>
            <span className="text-zinc-400 font-mono text-[11px]">https://luthratravels.com{selectedPath}</span>
          </div>

          <h3 className="text-blue-400 hover:underline font-normal text-lg sm:text-xl font-serif line-clamp-1 cursor-pointer">
            {currentSeo.meta_title || 'Luthra Travels | Premium Taxi Services Across India'}
          </h3>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {currentSeo.meta_description || 'Experience safe, comfortable and reliable taxi services with professional drivers and transparent pricing.'}
          </p>
        </div>
      </div>

      {/* MISSING SEO WARNINGS */}
      {warnings.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/30 p-5 rounded-2xl space-y-2">
          <h4 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> SEO Optimization Recommendations:
          </h4>
          <ul className="list-disc list-inside text-xs text-amber-200/80 space-y-1 font-mono">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* SEO CONFIGURATION FORM */}
      <form onSubmit={handleSavePageSEO} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <h3 className="font-serif text-xl font-bold text-white">
            Configure SEO for <span className="text-[#C9A227] font-mono">{selectedPath}</span>
          </h3>
          <Button type="submit" variant="gold" size="sm" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
            Save Page SEO
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          
          {/* Meta Title */}
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex justify-between items-center">
              <label className="text-zinc-300 font-semibold">
                Meta Title <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[11px] font-mono ${
                (currentSeo.meta_title || '').length >= 30 && (currentSeo.meta_title || '').length <= 60
                  ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {(currentSeo.meta_title || '').length} / 60 chars
              </span>
            </div>
            <input
              type="text"
              required
              value={currentSeo.meta_title || ''}
              onChange={(e) => setCurrentSeo({ ...currentSeo, meta_title: e.target.value })}
              placeholder="e.g. Premium Taxi Services Across India | Luthra Travels"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-white text-sm"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex justify-between items-center">
              <label className="text-zinc-300 font-semibold">
                Meta Description <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[11px] font-mono ${
                (currentSeo.meta_description || '').length >= 120 && (currentSeo.meta_description || '').length <= 160
                  ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {(currentSeo.meta_description || '').length} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={currentSeo.meta_description || ''}
              onChange={(e) => setCurrentSeo({ ...currentSeo, meta_description: e.target.value })}
              placeholder="e.g. Book executive chauffeur rentals, airport transfers, outstation trips, local taxis, and corporate mobility with transparent per-KM pricing."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-white text-sm"
            />
          </div>

          {/* Canonical URL */}
          <div className="space-y-1">
            <label className="text-zinc-300 font-semibold">Canonical URL</label>
            <input
              type="url"
              value={currentSeo.canonical_url || ''}
              onChange={(e) => setCurrentSeo({ ...currentSeo, canonical_url: e.target.value })}
              placeholder={`https://luthratravels.com${selectedPath}`}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-white font-mono"
            />
          </div>

          {/* Robots Meta */}
          <div className="space-y-1">
            <label className="text-zinc-300 font-semibold">Robots Meta Directives</label>
            <select
              value={currentSeo.robots_meta || 'index, follow'}
              onChange={(e) => setCurrentSeo({ ...currentSeo, robots_meta: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-white font-mono"
            >
              <option value="index, follow">index, follow (Allow Search Engines)</option>
              <option value="noindex, follow">noindex, follow (Hide Page, Follow Links)</option>
              <option value="noindex, nofollow">noindex, nofollow (Block Search Engines)</option>
            </select>
          </div>

          {/* Open Graph Social Sharing */}
          <div className="sm:col-span-2 pt-4 border-t border-zinc-800 space-y-4">
            <h4 className="font-serif text-base font-bold text-amber-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C9A227]" /> Open Graph &amp; Social Share Cards
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">OG Share Title</label>
                <input
                  type="text"
                  value={currentSeo.og_title || ''}
                  onChange={(e) => setCurrentSeo({ ...currentSeo, og_title: e.target.value })}
                  placeholder="Defaults to Meta Title if blank"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">OG Image URL</label>
                <input
                  type="text"
                  value={currentSeo.og_image || ''}
                  onChange={(e) => setCurrentSeo({ ...currentSeo, og_image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-zinc-300 font-medium">OG Share Description</label>
                <input
                  type="text"
                  value={currentSeo.og_description || ''}
                  onChange={(e) => setCurrentSeo({ ...currentSeo, og_description: e.target.value })}
                  placeholder="Defaults to Meta Description if blank"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Structured Data (JSON-LD) */}
          <div className="sm:col-span-2 pt-4 border-t border-zinc-800 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-serif text-base font-bold text-amber-300 flex items-center gap-2">
                <Code className="w-4 h-4 text-[#C9A227]" /> Structured Data Schema (JSON-LD)
              </h4>
              <select
                value={currentSeo.schema_type || 'LocalBusiness'}
                onChange={(e) => setCurrentSeo({ ...currentSeo, schema_type: e.target.value })}
                className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white font-mono"
              >
                <option value="LocalBusiness">LocalBusiness Schema</option>
                <option value="BreadcrumbList">BreadcrumbList Schema</option>
                <option value="FAQPage">FAQPage Schema</option>
                <option value="BlogPosting">BlogPosting Schema</option>
                <option value="Organization">Organization Schema</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium block">
                Custom JSON-LD Override (Optional)
              </label>
              <textarea
                rows={5}
                value={currentSeo.custom_json_ld || ''}
                onChange={(e) => setCurrentSeo({ ...currentSeo, custom_json_ld: e.target.value })}
                placeholder='{\n  "@context": "https://schema.org",\n  "@type": "TaxiService",\n  "name": "Luthra Travels"\n}'
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-emerald-400 font-mono text-xs"
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <Button type="submit" variant="gold" size="md" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
            Save SEO Changes to Supabase
          </Button>
        </div>
      </form>

      {/* AUTO SLUG GENERATOR TOOL & ROBOTS.TXT EDITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* Slug Generator */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A227]" /> Auto URL Slug Generator
          </h3>

          <div className="space-y-2 text-xs">
            <input
              type="text"
              value={slugInput}
              onChange={(e) => handleGenerateSlug(e.target.value)}
              placeholder="Type any article or service title..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
            />

            {generatedSlug && (
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center font-mono">
                <span className="text-amber-400 text-xs">/blog/{generatedSlug}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedSlug);
                    showToast('Slug copied to clipboard!', 'info');
                  }}
                  className="text-zinc-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Robots.txt Manager */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-[#C9A227]" /> Robots.txt Code Manager
            </h3>
            <button
              type="button"
              onClick={handleSaveRobotsTxt}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs px-3 py-1.5 rounded-lg"
            >
              Save Robots.txt
            </button>
          </div>

          <textarea
            rows={5}
            value={robotsTxt}
            onChange={(e) => setRobotsTxt(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 font-mono text-xs"
          />
        </div>

      </div>
    </div>
  );
};
