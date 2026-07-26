import { Testimonial, FAQItem, GalleryItem, ServiceItem, SiteSettings, AdminStats } from '../types';

export const cmsService = {
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch site settings');
    return res.json();
  },

  async updateSettings(settings: SiteSettings): Promise<void> {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch('/api/content?type=testimonials');
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json();
  },

  async createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch('/api/content?type=testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'testimonials', ...data })
    });
    if (!res.ok) throw new Error('Failed to create testimonial');
    return res.json();
  },

  async updateTestimonial(id: number, updates: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch('/api/content?type=testimonials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type: 'testimonials', ...updates })
    });
    if (!res.ok) throw new Error('Failed to update testimonial');
    return res.json();
  },

  async deleteTestimonial(id: number): Promise<void> {
    const res = await fetch(`/api/content?type=testimonials&id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete testimonial');
  },

  async getFaqs(): Promise<FAQItem[]> {
    const res = await fetch('/api/content?type=faqs');
    if (!res.ok) throw new Error('Failed to fetch faqs');
    return res.json();
  },

  async createFaq(data: Partial<FAQItem>): Promise<FAQItem> {
    const res = await fetch('/api/content?type=faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'faqs', ...data })
    });
    if (!res.ok) throw new Error('Failed to create FAQ');
    return res.json();
  },

  async updateFaq(id: number, updates: Partial<FAQItem>): Promise<FAQItem> {
    const res = await fetch('/api/content?type=faqs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type: 'faqs', ...updates })
    });
    if (!res.ok) throw new Error('Failed to update FAQ');
    return res.json();
  },

  async deleteFaq(id: number): Promise<void> {
    const res = await fetch(`/api/content?type=faqs&id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete FAQ');
  },

  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch('/api/content?type=gallery');
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  },

  async createGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch('/api/content?type=gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'gallery', ...data })
    });
    if (!res.ok) throw new Error('Failed to upload gallery item');
    return res.json();
  },

  async deleteGalleryItem(id: number): Promise<void> {
    const res = await fetch(`/api/content?type=gallery&id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete gallery item');
  },

  async getServices(): Promise<ServiceItem[]> {
    const res = await fetch('/api/content?type=services');
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  async getStats(): Promise<AdminStats> {
    const res = await fetch('/api/system?action=stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};
