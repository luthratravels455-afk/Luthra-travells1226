import React from 'react';
import { SiteSettings } from '../../types';
import { MapPin, Save, Globe } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminLocationsManagerProps {
  settingsForm: SiteSettings;
  setSettingsForm: React.Dispatch<React.SetStateAction<SiteSettings>>;
  onSaveSettings: (e: React.FormEvent) => Promise<void>;
}

export const AdminLocationsManager: React.FC<AdminLocationsManagerProps> = ({
  settingsForm,
  setSettingsForm,
  onSaveSettings,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Location &amp; Route Management</h2>
        <p className="text-xs text-zinc-400">
          Manage key service cities, airport hub listings, local service areas, and Google Maps embed links.
        </p>
      </div>

      <form onSubmit={onSaveSettings} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
        <div className="space-y-4 text-xs">
          {/* Airport List */}
          <div className="space-y-1">
            <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C9A227]" /> Served Airports List (Comma Separated)
            </label>
            <input
              type="text"
              value={
                settingsForm.airport_list ||
                'Delhi IGI Terminal 3, Delhi IGI Terminal 1 / 2, Chandigarh International Airport (IXC)'
              }
              onChange={(e) => setSettingsForm({ ...settingsForm, airport_list: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
            />
          </div>

          {/* Local Service Areas */}
          <div className="space-y-1">
            <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#C9A227]" /> Local Service Hubs
            </label>
            <input
              type="text"
              value={
                settingsForm.local_service_areas ||
                'Gurgaon Cyber City, Vasant Vihar New Delhi, Noida Sector 62, Faridabad, Chandigarh'
              }
              onChange={(e) => setSettingsForm({ ...settingsForm, local_service_areas: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
            />
          </div>

          {/* Map Embed URL */}
          <div className="space-y-1">
            <label className="text-zinc-300 font-semibold">Google Maps Location Embed URL</label>
            <input
              type="text"
              value={settingsForm.map_embed_url || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, map_embed_url: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono text-[11px]"
            />
          </div>
        </div>

        <Button variant="gold" size="md" type="submit" leftIcon={<Save className="w-4 h-4" />}>
          Save Location Configurations
        </Button>
      </form>
    </div>
  );
};
