export interface LocationItem {
  id?: number;
  name: string;
  slug: string;
  title: string;
  meta_desc: string;
  h1_heading: string;
  content: string;
  nearby_areas: string[];
  is_active: boolean;
}

export interface LandingPageItem {
  id?: number;
  title: string;
  slug: string;
  meta_desc: string;
  category: string;
  h1_heading: string;
  features: string[];
  is_active: boolean;
}

export interface RedirectItem {
  id?: number;
  source_path: string;
  target_path: string;
  status_code: number;
  is_active: boolean;
}

export const seoService = {
  // Locations API
  async getLocations(): Promise<LocationItem[]> {
    try {
      const res = await fetch('/api/settings?type=locations');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {}
    return [
      {
        id: 1,
        name: 'Chandigarh',
        slug: 'chandigarh',
        title: 'Top Taxi Service in Chandigarh | Luthra Travels',
        meta_desc: 'Book 24/7 reliable taxi service in Chandigarh with Luthra Travels. Flat per-km fares, clean cabs, and verified drivers.',
        h1_heading: 'Best Taxi Service in Chandigarh',
        content: 'Premium 24x7 chauffeur taxi services in Chandigarh. Instant airport drops, local hourly rentals, and outstation cabs to Delhi, Shimla, and Manali.',
        nearby_areas: ['Mohali', 'Panchkula', 'Zirakpur', 'Kharar'],
        is_active: true
      },
      {
        id: 2,
        name: 'Mohali',
        slug: 'mohali',
        title: 'Mohali Taxi Service | 24/7 Cab Booking Luthra Travels',
        meta_desc: 'Luthra Travels provides top-rated cab services in Mohali, Phase 1-11, and Aerocity. Flat pricing & zero night charges.',
        h1_heading: 'Mohali Taxi Service 24x7',
        content: 'Reliable taxi service in Mohali and IT City. Instant airport transfers, outstation drops, and local rentals.',
        nearby_areas: ['Chandigarh', 'Zirakpur', 'Kharar'],
        is_active: true
      },
      {
        id: 3,
        name: 'Delhi',
        slug: 'delhi',
        title: 'Delhi Airport Taxi & Chauffeur Service | Luthra Travels',
        meta_desc: 'Book IGI Airport T3 transfers and outstation cabs in Delhi with Luthra Travels. Flat transparent pricing.',
        h1_heading: 'Delhi NCR Chauffeur & Airport Taxi',
        content: 'Executive airport drops and intercity taxis in Delhi NCR, IGI Airport Terminal 3, Gurgaon & Noida.',
        nearby_areas: ['Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad'],
        is_active: true
      },
      {
        id: 4,
        name: 'Shimla',
        slug: 'shimla',
        title: 'Shimla Taxi Service | Delhi & Chandigarh to Shimla Cabs',
        meta_desc: 'Book reliable taxi from Delhi or Chandigarh to Shimla with Luthra Travels. Innova Crysta & Ertiga cabs.',
        h1_heading: 'Delhi to Shimla Taxi Service',
        content: 'Safe mountain highway taxi service from Delhi & Chandigarh to Shimla & Kufri. Experienced hill drivers.',
        nearby_areas: ['Kufri', 'Solan', 'Chail'],
        is_active: true
      }
    ];
  },

  async getLocationBySlug(slug: string): Promise<LocationItem | null> {
    const locations = await this.getLocations();
    return locations.find(l => l.slug === slug) || locations[0];
  },

  // Landing Pages API
  async getLandingPages(): Promise<LandingPageItem[]> {
    return [
      {
        id: 1,
        title: 'IGI Airport Taxi Service | Flat Fare Airport Transfers',
        slug: 'airport-taxi',
        meta_desc: 'Book 24/7 IGI Airport Terminal 1, 2, 3 taxi with Luthra Travels. Zero delay guarantee, flight radar tracking & clean cabs.',
        category: 'Airport Taxi',
        h1_heading: '24x7 IGI Airport Taxi Service',
        features: ['Flight status live radar tracking', '60 minutes free waiting allowance', 'Meet & Greet with placard at arrivals', 'Fixed flat airport fare'],
        is_active: true
      },
      {
        id: 2,
        title: 'Outstation Taxi Service | Intercity Cabs Luthra Travels',
        slug: 'outstation-taxi',
        meta_desc: 'Book outstation cabs from Delhi NCR & Chandigarh to Agra, Jaipur, Shimla & Manali. Transparent per-km rates.',
        category: 'Outstation Taxi',
        h1_heading: 'Intercity Outstation Taxi Service',
        features: ['One-Way and Round-Trip billing', 'Zero hidden state permit charges', 'Defensively trained highway drivers', 'Innova Crysta & Ertiga cabs'],
        is_active: true
      },
      {
        id: 3,
        title: 'Local City Taxi Rentals | Hourly Cab Packages',
        slug: 'local-taxi',
        meta_desc: 'Book hourly local taxi packages for city meetings, shopping & sightseeing across Delhi NCR & Chandigarh.',
        category: 'Local Taxi',
        h1_heading: 'Local Hourly City Taxi Rentals',
        features: ['Flexible packages: 4hr/40km, 8hr/80km, 12hr/120km', 'Multi-stop city itineraries', 'Chilled air conditioning & mineral water'],
        is_active: true
      },
      {
        id: 4,
        title: 'Corporate Executive Chauffeur Service | Luthra Travels',
        slug: 'corporate-travel',
        meta_desc: 'Standardized corporate mobility for Fortune 500 companies in Gurgaon, Noida & Chandigarh with Luthra Travels.',
        category: 'Corporate Travel',
        h1_heading: 'Corporate Chauffeur & Executive Fleet',
        features: ['Consolidated monthly GST invoices', 'Dedicated corporate account manager', 'Priority vehicle allocation 24/7'],
        is_active: true
      }
    ];
  },

  async getLandingPageBySlug(slug: string): Promise<LandingPageItem | null> {
    const pages = await this.getLandingPages();
    return pages.find(p => p.slug === slug) || pages[0];
  },

  // Redirects API
  async getRedirects(): Promise<RedirectItem[]> {
    return [
      { id: 1, source_path: '/cabs-in-delhi', target_path: '/location/delhi', status_code: 301, is_active: true },
      { id: 2, source_path: '/chandigarh-cabs', target_path: '/location/chandigarh', status_code: 301, is_active: true }
    ];
  },

  // XML Sitemap Generator Helper
  generateSitemapXml(origin: string = 'https://luthratravels.com'): string {
    const urls = [
      '',
      '/fleet',
      '/airport-transfers',
      '/outstation-taxi',
      '/local-taxi',
      '/corporate-travel',
      '/about',
      '/blog',
      '/gallery',
      '/faq',
      '/contact',
      '/location/chandigarh',
      '/location/mohali',
      '/location/delhi',
      '/location/shimla',
      '/service/airport-taxi',
      '/service/outstation-taxi'
    ];

    const today = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${origin}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${u === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    return xml;
  },

  // robots.txt Generator Helper
  generateRobotsTxt(origin: string = 'https://luthratravels.com'): string {
    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login

Sitemap: ${origin}/sitemap.xml`;
  }
};
