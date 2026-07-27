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
    const res = await fetch('/api/testimonials');
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json();
  },

  async createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create testimonial');
    return res.json();
  },

  async updateTestimonial(id: number, updates: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch('/api/testimonials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    if (!res.ok) throw new Error('Failed to update testimonial');
    return res.json();
  },

  async deleteTestimonial(id: number): Promise<void> {
    const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete testimonial');
  },

  async getFaqs(): Promise<FAQItem[]> {
    const res = await fetch('/api/faqs');
    if (!res.ok) throw new Error('Failed to fetch faqs');
    return res.json();
  },

  async createFaq(data: Partial<FAQItem>): Promise<FAQItem> {
    const res = await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create FAQ');
    return res.json();
  },

  async updateFaq(id: number, updates: Partial<FAQItem>): Promise<FAQItem> {
    const res = await fetch('/api/faqs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    if (!res.ok) throw new Error('Failed to update FAQ');
    return res.json();
  },

  async deleteFaq(id: number): Promise<void> {
    const res = await fetch(`/api/faqs?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete FAQ');
  },

  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch('/api/gallery');
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  },

  async createGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to upload gallery item');
    return res.json();
  },

  async deleteGalleryItem(id: number): Promise<void> {
    const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete gallery item');
  },

  async getServices(): Promise<ServiceItem[]> {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  async createService(data: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create service');
    return res.json();
  },

  async updateService(id: number, updates: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await fetch('/api/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    if (!res.ok) throw new Error('Failed to update service');
    return res.json();
  },

  async deleteService(id: number): Promise<void> {
    const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete service');
  },

  async getStats(): Promise<AdminStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};
