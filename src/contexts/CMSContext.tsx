import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { cmsService } from '../services/cmsService';

interface CMSContextType {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const defaultSettings: SiteSettings = {
  company_name: 'Luthra Travels',
  company_tagline: 'Redefining Luxury Chauffeur & Enterprise Mobility',
  phone_primary: '+91 98100 12345',
  phone_secondary: '+91 98100 67890',
  whatsapp_number: '919810012345',
  email_primary: 'reservations@luthratravels.com',
  address: 'Suite 402, Signature Towers, South City 1, Gurgaon, Delhi NCR - 122001',
  hero_title: 'Luxury Chauffeur Mobility, Crafted for Perfection',
  hero_subtitle: 'Experience India\'s finest fleet of luxury sedans, MPVs, and executive SUVs for Airport Transfers, Outstation Trips & Corporate Mobility.',
  currency: '₹',
  years_in_business: '14',
  trips_completed: '45,000+',
  satisfied_clients: '28,000+',
  fleet_size: '65+ Vehicles',
};

const CMSContext = createContext<CMSContextType>({
  settings: defaultSettings,
  refreshSettings: async () => {},
  loading: true,
});

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await cmsService.getSettings();
      if (data && Object.keys(data).length > 0) {
        setSettings({ ...defaultSettings, ...data });
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <CMSContext.Provider value={{ settings, refreshSettings, loading }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => useContext(CMSContext);
