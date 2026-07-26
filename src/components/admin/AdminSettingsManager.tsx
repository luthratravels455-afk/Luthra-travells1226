import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { Save, Phone, Mail, MapPin, Globe, Share2, Shield, Bell, Database, Palette, DollarSign, Clock, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface AdminSettingsManagerProps {
  settingsForm: SiteSettings;
  setSettingsForm: React.Dispatch<React.SetStateAction<SiteSettings>>;
  onSaveSettings: (e: React.FormEvent) => Promise<void>;
}

export const AdminSettingsManager: React.FC<AdminSettingsManagerProps> = ({
  settingsForm,
  setSettingsForm,
  onSaveSettings,
}) => {
  const [activeSubTab, setActiveTab] = useState<
    'general' | 'business' | 'pricing' | 'branding' | 'social' | 'notifications' | 'system'
  >('general');

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl">
      <div>
        <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-[#C9A227]" /> CMS Settings Hub
        </h2>
        <p className="text-xs text-zinc-400">
          Central management hub for business details, taxi pricing rules, branding, notifications, and system info.
        </p>
      </div>

      {/* Settings Subtabs Bar */}
      <div className="flex flex-wrap gap-2 bg-zinc-900/90 p-2 rounded-2xl border border-zinc-800">
        {[
          { id: 'general', label: 'General', icon: Globe },
          { id: 'business', label: 'Business Info', icon: MapPin },
          { id: 'pricing', label: 'Pricing Rules', icon: DollarSign },
          { id: 'branding', label: 'Branding', icon: Palette },
          { id: 'social', label: 'Social & Maps', icon: Share2 },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'system', label: 'System Info', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#C9A227] text-zinc-950 font-bold shadow-md shadow-[#C9A227]/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={onSaveSettings} className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6">
        
        {/* SUBTAB 1: GENERAL SETTINGS */}
        {activeSubTab === 'general' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white border-b border-zinc-800 pb-2">
              General Website Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Business / Entity Name</label>
                <input
                  type="text"
                  value={settingsForm.company_name || 'Luthra Travels'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#C9A227]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Website Public Title</label>
                <input
                  type="text"
                  value={settingsForm.website_title || 'Luthra Travels | Luxury Chauffeur & Taxi Mobility'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, website_title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#C9A227]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-zinc-300 font-medium">Company Tagline</label>
                <input
                  type="text"
                  value={settingsForm.company_tagline || 'Redefining Luxury Chauffeur & Enterprise Mobility'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, company_tagline: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#C9A227]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">System Timezone</label>
                <input
                  type="text"
                  value={settingsForm.timezone || 'Asia/Kolkata (IST +05:30)'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, timezone: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Primary Currency</label>
                <input
                  type="text"
                  value={settingsForm.currency || 'INR (₹)'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: BUSINESS INFORMATION */}
        {activeSubTab === 'business' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white border-b border-zinc-800 pb-2">
              Business &amp; Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C9A227]" /> Primary Phone Hotline *
                </label>
                <input
                  type="text"
                  value={settingsForm.phone_primary || '+91 99589 56593'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone_primary: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">WhatsApp Booking Hotline</label>
                <input
                  type="text"
                  value={settingsForm.whatsapp_number || '919958956593'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C9A227]" /> Reservation Email *
                </label>
                <input
                  type="email"
                  value={settingsForm.email_primary || 'luthratravel455@gmail.com'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email_primary: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">GST Identification Number</label>
                <input
                  type="text"
                  value={settingsForm.gst_number || '07AAAAA0000A1Z5'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, gst_number: e.target.value })}
                  className="w-full bg-zinc-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A227]" /> Physical Address
                </label>
                <input
                  type="text"
                  value={settingsForm.address || 'Suite 402, Signature Towers, South City 1, Gurgaon, Delhi NCR - 122001'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Business Operations Hours</label>
                <input
                  type="text"
                  value={settingsForm.business_hours || '24 Hours / 7 Days a week'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, business_hours: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Google Maps Location Link</label>
                <input
                  type="text"
                  value={settingsForm.google_maps_url || 'https://maps.google.com'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, google_maps_url: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: PRICING RULES */}
        {activeSubTab === 'pricing' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white border-b border-zinc-800 pb-2">
              Global Taxi Pricing Configuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Default Per-KM Fare Rate (₹)</label>
                <input
                  type="number"
                  value={settingsForm.default_rate_per_km || '14'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, default_rate_per_km: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-bold font-mono text-base"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Night Driver Surcharge (₹)</label>
                <input
                  type="number"
                  value={settingsForm.night_charge || '0'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, night_charge: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Driver Allowance Included</label>
                <input
                  type="text"
                  value={settingsForm.driver_allowance || 'Included in base quote'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, driver_allowance: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Over-distance Extra Rate (₹/KM)</label>
                <input
                  type="number"
                  value={settingsForm.extra_km_rate || '14'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, extra_km_rate: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: BRANDING */}
        {activeSubTab === 'branding' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white border-b border-zinc-800 pb-2">
              Branding &amp; Visual Identity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Primary Theme Color</label>
                <input
                  type="text"
                  value={settingsForm.color_primary || '#09090b'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, color_primary: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Accent Gold Color</label>
                <input
                  type="text"
                  value={settingsForm.color_accent || '#C9A227'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, color_accent: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-[#C9A227] font-bold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Favicon URL</label>
                <input
                  type="text"
                  value={settingsForm.favicon_url || '/favicon.svg'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, favicon_url: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: SOCIAL MEDIA */}
        {activeSubTab === 'social' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white border-b border-zinc-800 pb-2">
              Social Links &amp; Listings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Instagram Page URL</label>
                <input
                  type="text"
                  value={settingsForm.social_instagram || 'https://instagram.com/luthratravels'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, social_instagram: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Facebook Page URL</label>
                <input
                  type="text"
                  value={settingsForm.social_facebook || 'https://facebook.com/luthratravels'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, social_facebook: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">LinkedIn Page URL</label>
                <input
                  type="text"
                  value={settingsForm.social_linkedin || 'https://linkedin.com/company/luthratravels'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, social_linkedin: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Google Business Profile URL</label>
                <input
                  type="text"
                  value={settingsForm.social_google || 'https://g.page/luthratravels'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, social_google: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 6: NOTIFICATIONS */}
        {activeSubTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white border-b border-zinc-800 pb-2">
              Automated Alert Notifications
            </h3>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Instant Booking SMS &amp; Email Alerts</span>
                  <span className="text-zinc-400">Receive dispatch alerts on reservations.</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#C9A227]" />
              </label>

              <label className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">WhatsApp Automated Dispatch Launch</span>
                  <span className="text-zinc-400">Auto-open WhatsApp message upon submission.</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#C9A227]" />
              </label>
            </div>
          </div>
        )}

        {/* SUBTAB 7: SYSTEM INFO */}
        {activeSubTab === 'system' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white border-b border-zinc-800 pb-2">
              System Environment &amp; Health
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-400 block text-[10px] uppercase">CMS Core Version</span>
                <span className="text-white font-bold">Luthra Travels CMS v2.4.0</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-400 block text-[10px] uppercase">Supabase DB Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Connected &amp; Resilient
                </span>
              </div>
            </div>
          </div>
        )}

        <Button variant="gold" size="md" type="submit" leftIcon={<Save className="w-4 h-4" />}>
          Save Settings Hub Configurations
        </Button>
      </form>
    </div>
  );
};
