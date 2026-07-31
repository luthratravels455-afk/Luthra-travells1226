export interface SEORecord {
  id?: string;
  page_path: string;
  title?: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: string;
  canonical_url?: string;
  robots_meta?: string;
  schema_type?: string;
  custom_json_ld?: string;
  structured_data?: any;
  updated_at?: string;
}

export type PageSEORecord = SEORecord;

export interface LandingPageItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  h1_title?: string;
  meta_description: string;
  content: string;
  features?: string[];
}

export interface LocationItem {
  id: string;
  slug: string;
  city?: string;
  city_name?: string;
  title: string;
  description: string;
  meta_description?: string;
  content: string;
  popular_areas?: string[];
}

export const seoService = {
  async getPageSEO(path: string): Promise<SEORecord | null> {
    try {
      const res = await fetch(`/api/integration?type=seo&path=${encodeURIComponent(path)}`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  async getAllSEO(): Promise<SEORecord[]> {
    try {
      const res = await fetch('/api/integration?type=seo');
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

  async getAllPageSEO(): Promise<SEORecord[]> {
    return this.getAllSEO();
  },

  async updateSEO(record: SEORecord): Promise<SEORecord> {
    const res = await fetch('/api/integration?type=seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error('Failed to update SEO');
    return res.json();
  },

  async savePageSEO(record: SEORecord): Promise<SEORecord> {
    return this.updateSEO(record);
  },

  async getSitemap(): Promise<string> {
    const res = await fetch('/api/integration?type=sitemap');
    return res.text();
  },

  async generateSitemapXml(): Promise<string> {
    return this.getSitemap();
  },

  async getRobots(): Promise<string> {
    const res = await fetch('/api/integration?type=robots');
    return res.text();
  },

  async generateRobotsTxt(): Promise<string> {
    return this.getRobots();
  },

  async getLandingPageBySlug(slug: string): Promise<LandingPageItem | null> {
    try {
      const res = await fetch(`/api/content?type=services&slug=${encodeURIComponent(slug)}`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  async getLocationBySlug(slug: string): Promise<LocationItem | null> {
    try {
      const res = await fetch(`/api/content?type=routes&slug=${encodeURIComponent(slug)}`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }
};
