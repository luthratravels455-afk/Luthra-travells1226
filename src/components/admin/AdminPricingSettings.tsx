import React, { useState } from 'react';
import { Save, Tag, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminPricingSettingsProps {
  currentRatePerKm: string;
  onSaveRate: (newRate: string) => Promise<void>;
}

export const AdminPricingSettings: React.FC<AdminPricingSettingsProps> = ({
  currentRatePerKm,
  onSaveRate,
}) => {
  const [rate, setRate] = useState(currentRatePerKm || '14');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSaveRate(rate);
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Global Pricing Configuration</h2>
        <p className="text-xs text-zinc-400">
          Manage the baseline per-kilometer pricing rate. The entire website, fare estimators, and booking forms update automatically.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#C9A227]" /> Global Default Per-Kilometer Fare (₹/KM) *
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-zinc-400 font-bold">₹</span>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              required
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl pl-8 pr-4 py-3 text-lg font-mono font-bold text-[#C9A227] focus:outline-none"
            />
          </div>
          <p className="text-[11px] text-zinc-500 pt-1">
            Setting this value updates all tariff displays (e.g. "Starting from ₹{rate}/km") across all pages.
          </p>
        </div>

        <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2 font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Single Source Price Consistency
          </div>
          <p>
            No hardcoded fares. The pricing service injects this value into the Fleet Showcase, Why Choose section, and booking engine.
          </p>
        </div>

        <Button variant="gold" size="md" isLoading={saving} type="submit" leftIcon={<Save className="w-4 h-4" />}>
          Save Pricing Configuration
        </Button>
      </form>
    </div>
  );
};
