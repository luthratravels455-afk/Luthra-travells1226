export interface PageSEORecord {
  id?: number;
  page_path: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  robots_meta: string;
  og_title: string;
  og_description: string;
  og_image: string;
  og_type: string;
  twitter_card: string;
  schema_type: string;
  custom_json_ld?: string;
  updated_at?: string;
}

export interface LandingPageItem {
  id?: number;
  slug: string;
  title: string;
  meta_description: string;
  h1_title?: string;
  hero_subtitle?: string;
  content?: string;
  features?: string[];
}

export interface LocationItem {
  id?: number;
  slug: string;
  city_name: string;
  title: string;
  meta_description: string;
  popular_areas?: string[];
  content?: string;
}

export const seoService = {
  async getPageSEO(path: string): Promise<PageSEORecord | null> {
    try {
      const res = await fetch(`/api/seo?path=${encodeURIComponent(path)}`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  async getAllPageSEO(): Promise<PageSEORecord[]> {
    const res = await fetch('/api/seo');
    if (!res.ok) throw new Error('Failed to fetch SEO pages');
    return res.json();
  },

  async savePageSEO(record: Partial<PageSEORecord>): Promise<PageSEORecord> {
    const res = await fetch('/api/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error('Failed to save SEO record');
    return res.json();
  },

  async generateSitemapXml(): Promise<string> {
    const res = await fetch('/api/sitemap');
    return res.text();
  },

  async generateRobotsTxt(): Promise<string> {
    const res = await fetch('/api/robots');
    return res.text();
  },

  async getLandingPageBySlug(slug: string): Promise<LandingPageItem | null> {
    return {
      slug,
      title: `Taxi Service in ${slug.replace(/-/g, ' ')} | Luthra Travels`,
      meta_description: `Book executive chauffeur taxi service in ${slug.replace(/-/g, ' ')} with Luthra Travels. Flat rates and 24/7 service.`,
      h1_title: `Taxi Service in ${slug.replace(/-/g, ' ')}`,
      hero_subtitle: `Premium chauffeur rides, airport drops, and outstation rentals in ${slug.replace(/-/g, ' ')}.`,
      features: ['24/7 Availability', 'Sanitized Vehicles', 'GPS Tracking', 'Flat All-Inclusive Rates']
    };
  },

  async getLocationBySlug(slug: string): Promise<LocationItem | null> {
    const city = slug.replace(/-/g, ' ');
    return {
      slug,
      city_name: city,
      title: `Chauffeur Taxi Services in ${city} | Luthra Travels`,
      meta_description: `Reliable outstation and airport taxi services in ${city}. Verified drivers and sanitized vehicles.`,
      popular_areas: ['Central Area', 'Airport Terminal', 'Business Hub', 'Railway Station']
    };
  }
};
