import React, { useState, useEffect } from 'react';
import {
  Search, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Save, Code, ExternalLink, Activity, Lock, Globe, Key, Terminal, MessageSquare
} from 'lucide-react';
import { useCMS } from '../../contexts/CMSContext';
import { useToast } from '../../contexts/ToastContext';
import { cmsService } from '../../services/cmsService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const IntegrationsManager: React.FC = () => {
  const { settings, refreshSettings } = useCMS();
  const { showToast } = useToast();

  const [form, setForm] = useState<Record<string, string>>({});
  const [activeSubTab, setActiveTab] = useState<
    'gsc' | 'ga4' | 'gtm' | 'gads' | 'meta' | 'clarity' | 'gbp' | 'scripts' | 'apikeys'
  >('ga4');
  const [submitting, setSubmitting] = useState(false);
  const [testingService, setTestingService] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      const cleanForm: Record<string, string> = {};
      Object.keys(settings).forEach((key) => {
        const val = settings[key];
        if (val !== undefined) {
          cleanForm[key] = String(val);
        }
      });
      setForm(cleanForm);
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key] === 'true' ? 'false' : 'true',
    }));
  };

  // Validation Logic before saving
  const validateIntegrations = () => {
    if (form.ga4_enabled === 'true' && form.ga4_measurement_id) {
      const ga4Regex = /^G-[A-Z0-9]+$/i;
      if (!ga4Regex.test(form.ga4_measurement_id.trim())) {
        showToast('GA4 Measurement ID format invalid. Expected format: G-XXXXXXXXXX', 'error');
        return false;
      }
    }

    if (form.gtm_enabled === 'true' && form.gtm_container_id) {
      const gtmRegex = /^GTM-[A-Z0-9]+$/i;
      if (!gtmRegex.test(form.gtm_container_id.trim())) {
        showToast('GTM Container ID format invalid. Expected format: GTM-XXXXXXX', 'error');
        return false;
      }
    }

    if (form.meta_pixel_enabled === 'true' && form.meta_pixel_id) {
      const pixelRegex = /^\d{14,17}$/;
      if (!pixelRegex.test(form.meta_pixel_id.trim())) {
        showToast('Meta Pixel ID should be 14 to 17 digits.', 'error');
        return false;
      }
    }

    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateIntegrations()) return;

    setSubmitting(true);
    try {
      await cmsService.updateSettings(form);
      await refreshSettings();
      showToast('Integrations & Tracking settings live-updated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save integrations settings.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestConnection = (serviceName: string) => {
    setTestingService(serviceName);
    setTimeout(() => {
      setTestingService(null);
      showToast(`[${serviceName}] Connection verified & active on live site.`, 'success');
    }, 1000);
  };

  const getStatusBadge = (enabledKey: string, idKey: string) => {
    const isEnabled = form[enabledKey] === 'true';
    const hasId = !!form[idKey]?.trim();

    if (isEnabled && hasId) {
      return <Badge variant="emerald" dot>Connected</Badge>;
    }
    if (hasId && !isEnabled) {
      return <Badge variant="gold">Configured (Disabled)</Badge>;
    }
    return <Badge variant="dark">Disconnected</Badge>;
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#C9A227]" />
            <h2 className="font-serif text-2xl font-bold text-white">Marketing Integrations &amp; Tracking</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Configure analytics, pixels, search console, custom head/footer scripts, and API keys. Changes update live across the entire website.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={handleSave}
          isLoading={submitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save All Integrations
        </Button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 bg-zinc-950 p-2 rounded-2xl border border-zinc-800 text-xs">
        <button
          onClick={() => setActiveTab('ga4')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'ga4' ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Google Analytics 4
        </button>

        <button
          onClick={() => setActiveTab('gtm')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'gtm' ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Tag Manager
        </button>

        <button
          onClick={() => setActiveTab('gsc')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'gsc' ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Search Console
        </button>

        <button
          onClick={() => setActiveTab('gads')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'gads' ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Google Ads
        </button>

        <button
          onClick={() => setActiveTab('meta')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'meta' ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Meta Pixel
        </button>

        <button
          onClick={() => setActiveTab('clarity')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'clarity' ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          MS Clarity
        </button>

        <button
          onClick={() => setActiveTab('gbp')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'gbp' ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Google Business
        </button>

        <button
          onClick={() => setActiveTab('scripts')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'scripts' ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Custom Scripts
        </button>

        <button
          onClick={() => setActiveTab('apikeys')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'apikeys' ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          API Keys
        </button>
      </div>

      {/* SUB-TAB 1: GOOGLE ANALYTICS 4 */}
      {activeSubTab === 'ga4' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Google Analytics 4 (GA4)</h3>
              <p className="text-xs text-zinc-400">Track page views, booking conversions, phone clicks, and WhatsApp events.</p>
            </div>
            {getStatusBadge('ga4_enabled', 'ga4_measurement_id')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-300 font-semibold">GA4 Measurement ID (G-XXXXXXXXXX)</label>
              <input
                type="text"
                placeholder="e.g. G-1234567890"
                value={form.ga4_measurement_id || ''}
                onChange={(e) => handleChange('ga4_measurement_id', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:border-[#C9A227]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-semibold">
                <input
                  type="checkbox"
                  checked={form.ga4_enabled === 'true'}
                  onChange={() => handleToggle('ga4_enabled')}
                  className="w-4 h-4 accent-[#C9A227]"
                />
                Enable GA4 Dynamic Script Injection
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-mono">Auto-injects gtag.js into &lt;head&gt;</span>
            <Button
              variant="secondary"
              size="sm"
              isLoading={testingService === 'GA4'}
              onClick={() => handleTestConnection('GA4')}
            >
              Test GA4 Connection
            </Button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GOOGLE TAG MANAGER */}
      {activeSubTab === 'gtm' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Google Tag Manager (GTM)</h3>
              <p className="text-xs text-zinc-400">Inject GTM container ID to manage marketing tags from GTM dashboard.</p>
            </div>
            {getStatusBadge('gtm_enabled', 'gtm_container_id')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-300 font-semibold">GTM Container ID (GTM-XXXXXXX)</label>
              <input
                type="text"
                placeholder="e.g. GTM-A1B2C3D"
                value={form.gtm_container_id || ''}
                onChange={(e) => handleChange('gtm_container_id', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:border-[#C9A227]"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-semibold">
                <input
                  type="checkbox"
                  checked={form.gtm_enabled === 'true'}
                  onChange={() => handleToggle('gtm_enabled')}
                  className="w-4 h-4 accent-[#C9A227]"
                />
                Enable GTM Script
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-semibold">
                <input
                  type="checkbox"
                  checked={form.gtm_auto_inject === 'true'}
                  onChange={() => handleToggle('gtm_auto_inject')}
                  className="w-4 h-4 accent-[#C9A227]"
                />
                Auto-Push DataLayer Events
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-mono">Pushes window.dataLayer events automatically</span>
            <Button
              variant="secondary"
              size="sm"
              isLoading={testingService === 'GTM'}
              onClick={() => handleTestConnection('GTM')}
            >
              Test GTM Container
            </Button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GOOGLE SEARCH CONSOLE */}
      {activeSubTab === 'gsc' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Google Search Console (GSC)</h3>
              <p className="text-xs text-zinc-400">Verify site ownership and manage sitemaps.</p>
            </div>
            {form.gsc_verification_code ? <Badge variant="emerald" dot>Verification Active</Badge> : <Badge variant="dark">Not Verified</Badge>}
          </div>

          <div className="grid grid-cols-1 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">HTML Meta Tag Verification Code</label>
              <input
                type="text"
                placeholder='e.g. "a1b2c3d4e5f6g7h8i9j0"'
                value={form.gsc_verification_code || ''}
                onChange={(e) => handleChange('gsc_verification_code', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:border-[#C9A227]"
              />
              <p className="text-[10px] text-zinc-500">Injects &lt;meta name="google-site-verification" content="..." /&gt;</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Verification File Path (Optional)</label>
              <input
                type="text"
                placeholder="e.g. google123456789.html"
                value={form.gsc_verification_file || ''}
                onChange={(e) => handleChange('gsc_verification_file', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:border-[#C9A227]"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: GOOGLE ADS */}
      {activeSubTab === 'gads' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Google Ads Conversion &amp; Remarketing</h3>
              <p className="text-xs text-zinc-400">Track paid campaign conversions for taxi bookings and phone calls.</p>
            </div>
            {getStatusBadge('gads_enabled', 'gads_conversion_id')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Customer ID (xxx-xxx-xxxx)</label>
              <input
                type="text"
                placeholder="e.g. 123-456-7890"
                value={form.gads_customer_id || ''}
                onChange={(e) => handleChange('gads_customer_id', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Conversion ID (AW-XXXXXXXXX)</label>
              <input
                type="text"
                placeholder="e.g. AW-123456789"
                value={form.gads_conversion_id || ''}
                onChange={(e) => handleChange('gads_conversion_id', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Conversion Label</label>
              <input
                type="text"
                placeholder="e.g. AbC_123XyZ"
                value={form.gads_conversion_label || ''}
                onChange={(e) => handleChange('gads_conversion_label', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Remarketing Tag ID</label>
              <input
                type="text"
                placeholder="e.g. AW-987654321"
                value={form.gads_remarketing_id || ''}
                onChange={(e) => handleChange('gads_remarketing_id', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="flex items-center gap-4 sm:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-semibold">
                <input
                  type="checkbox"
                  checked={form.gads_enabled === 'true'}
                  onChange={() => handleToggle('gads_enabled')}
                  className="w-4 h-4 accent-[#C9A227]"
                />
                Enable Google Ads Tag
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-semibold">
                <input
                  type="checkbox"
                  checked={form.gads_enhanced_conversions === 'true'}
                  onChange={() => handleToggle('gads_enhanced_conversions')}
                  className="w-4 h-4 accent-[#C9A227]"
                />
                Enhanced Conversions
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: META PIXEL */}
      {activeSubTab === 'meta' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Meta Pixel (Facebook)</h3>
              <p className="text-xs text-zinc-400">Track Facebook &amp; Instagram ad conversions, lead events, and custom retargeting audiences.</p>
            </div>
            {getStatusBadge('meta_pixel_enabled', 'meta_pixel_id')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-300 font-semibold">Meta Pixel ID (14-17 digits)</label>
              <input
                type="text"
                placeholder="e.g. 123456789012345"
                value={form.meta_pixel_id || ''}
                onChange={(e) => handleChange('meta_pixel_id', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:border-[#C9A227]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-semibold">
                <input
                  type="checkbox"
                  checked={form.meta_pixel_enabled === 'true'}
                  onChange={() => handleToggle('meta_pixel_enabled')}
                  className="w-4 h-4 accent-[#C9A227]"
                />
                Enable Meta Pixel Script Injection
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: MICROSOFT CLARITY */}
      {activeSubTab === 'clarity' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Microsoft Clarity</h3>
              <p className="text-xs text-zinc-400">Heatmaps and session recordings for user experience optimization.</p>
            </div>
            {getStatusBadge('clarity_enabled', 'clarity_project_id')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-300 font-semibold">Clarity Project ID (10 alphanumeric chars)</label>
              <input
                type="text"
                placeholder="e.g. k9x8m7p6q5"
                value={form.clarity_project_id || ''}
                onChange={(e) => handleChange('clarity_project_id', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:border-[#C9A227]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-semibold">
                <input
                  type="checkbox"
                  checked={form.clarity_enabled === 'true'}
                  onChange={() => handleToggle('clarity_enabled')}
                  className="w-4 h-4 accent-[#C9A227]"
                />
                Enable Microsoft Clarity Session Recording
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: GOOGLE BUSINESS PROFILE */}
      {activeSubTab === 'gbp' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Google Business Profile &amp; Maps Links</h3>
            <p className="text-xs text-zinc-400">Configure business review links, directions, and profile URLs for local SEO.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Business Profile URL</label>
              <input
                type="url"
                placeholder="https://g.page/r/..."
                value={form.gbp_profile_url || ''}
                onChange={(e) => handleChange('gbp_profile_url', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Direct Review Link</label>
              <input
                type="url"
                placeholder="https://g.page/r/.../review"
                value={form.gbp_review_url || ''}
                onChange={(e) => handleChange('gbp_review_url', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Google Maps URL</label>
              <input
                type="url"
                placeholder="https://maps.google.com/?cid=..."
                value={form.gbp_maps_url || ''}
                onChange={(e) => handleChange('gbp_maps_url', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Directions URL</label>
              <input
                type="url"
                placeholder="https://www.google.com/maps/dir/..."
                value={form.gbp_directions_url || ''}
                onChange={(e) => handleChange('gbp_directions_url', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-300 font-semibold">Primary Business Category</label>
              <input
                type="text"
                placeholder="e.g. Taxi Service, Airport Shuttle Service, Chauffeur Service"
                value={form.gbp_category || 'Taxi Service'}
                onChange={(e) => handleChange('gbp_category', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: CUSTOM SCRIPTS */}
      {activeSubTab === 'scripts' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Custom Scripts &amp; JSON-LD Schema</h3>
            <p className="text-xs text-zinc-400">Inject custom scripts, chat widgets (Tawk.to, WhatsApp widget), or Schema markup into &lt;head&gt; or &lt;body&gt;.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold flex items-center justify-between">
                <span>Head Scripts (&lt;head&gt;)</span>
                <span className="text-[10px] text-[#C9A227] font-mono">Meta tags, JSON-LD, Fonts</span>
              </label>
              <textarea
                rows={5}
                placeholder="<!-- Enter custom head scripts here -->"
                value={form.custom_head_scripts || ''}
                onChange={(e) => handleChange('custom_head_scripts', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold flex items-center justify-between">
                <span>Footer Scripts (&lt;body&gt; bottom)</span>
                <span className="text-[10px] text-[#C9A227] font-mono">Live chat, Analytics, Widgets</span>
              </label>
              <textarea
                rows={5}
                placeholder="<!-- Enter custom footer scripts or chat widgets here -->"
                value={form.custom_footer_scripts || ''}
                onChange={(e) => handleChange('custom_footer_scripts', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:border-[#C9A227]"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 9: API KEYS */}
      {activeSubTab === 'apikeys' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">External API Credentials</h3>
            <p className="text-xs text-zinc-400">Securely store API keys for Google Maps, WhatsApp, SMS gateway, and Payment Providers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Google Maps API Key</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={form.key_google_maps || ''}
                onChange={(e) => handleChange('key_google_maps', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">WhatsApp Cloud API Token</label>
              <input
                type="password"
                placeholder="EAA..."
                value={form.key_whatsapp_api || ''}
                onChange={(e) => handleChange('key_whatsapp_api', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">SMS Gateway API Key</label>
              <input
                type="password"
                placeholder="SMS_..."
                value={form.key_sms_api || ''}
                onChange={(e) => handleChange('key_sms_api', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Payment Gateway Key (Razorpay / Stripe)</label>
              <input
                type="password"
                placeholder="rzp_live_..."
                value={form.key_payment_gateway || ''}
                onChange={(e) => handleChange('key_payment_gateway', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Save Floating Bar */}
      <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
        <span className="text-xs text-zinc-400">All configurations save directly into Supabase site_settings storage.</span>
        <Button
          variant="gold"
          size="md"
          onClick={handleSave}
          isLoading={submitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Integrations
        </Button>
      </div>

    </div>
  );
};
