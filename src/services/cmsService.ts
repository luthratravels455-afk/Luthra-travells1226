import { Testimonial, FAQItem, GalleryItem, ServiceItem, SiteSettings, AdminStats } from '../types';
import { apiFetch } from './apiClient';
import supabase from '../lib/supabase';

export const cmsService = {
  async getSettings(): Promise<SiteSettings> {
    return apiFetch<SiteSettings>(
      '/api/settings',
      { method: 'GET' },
      async () => {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (error) throw error;
        const settingsMap: SiteSettings = {};
        if (data) {
          data.forEach((item) => {
            settingsMap[item.key] = item.value;
          });
        }
        return settingsMap;
      }
    );
  },

  async updateSettings(settings: SiteSettings): Promise<void> {
    return apiFetch<void>(
      '/api/settings',
      {
        method: 'POST',
        body: JSON.stringify(settings),
      },
      async () => {
        const upserts = Object.keys(settings).map((key) => ({
          key,
          value: settings[key],
          updated_at: new Date().toISOString(),
        }));

        const { error } = await supabase
          .from('site_settings')
          .upsert(upserts, { onConflict: 'key' });
        if (error) throw error;
      }
    );
  },

  async getTestimonials(): Promise<Testimonial[]> {
    return apiFetch<Testimonial[]>(
      '/api/content?type=testimonials',
      { method: 'GET' },
      async () => {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('rating', { ascending: false });
        if (error) throw error;
        return (data || []) as Testimonial[];
      }
    );
  },

  async createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
    return apiFetch<Testimonial>(
      '/api/content?type=testimonials',
      {
        method: 'POST',
        body: JSON.stringify({ type: 'testimonials', ...data }),
      },
      async () => {
        const { data: resData, error } = await supabase
          .from('testimonials')
          .insert([data])
          .select()
          .single();
        if (error) throw error;
        return resData as Testimonial;
      }
    );
  },

  async updateTestimonial(id: number, updates: Partial<Testimonial>): Promise<Testimonial> {
    return apiFetch<Testimonial>(
      '/api/content?type=testimonials',
      {
        method: 'PUT',
        body: JSON.stringify({ id, type: 'testimonials', ...updates }),
      },
      async () => {
        const { data, error } = await supabase
          .from('testimonials')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data as Testimonial;
      }
    );
  },

  async deleteTestimonial(id: number): Promise<void> {
    return apiFetch<void>(
      `/api/content?type=testimonials&id=${id}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ id, type: 'testimonials' }),
      },
      async () => {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
      }
    );
  },

  async getFaqs(): Promise<FAQItem[]> {
    return apiFetch<FAQItem[]>(
      '/api/content?type=faqs',
      { method: 'GET' },
      async () => {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .order('sorting_order', { ascending: true });
        if (error) throw error;
        return (data || []) as FAQItem[];
      }
    );
  },

  async createFaq(data: Partial<FAQItem>): Promise<FAQItem> {
    return apiFetch<FAQItem>(
      '/api/content?type=faqs',
      {
        method: 'POST',
        body: JSON.stringify({ type: 'faqs', ...data }),
      },
      async () => {
        const { data: resData, error } = await supabase
          .from('faqs')
          .insert([data])
          .select()
          .single();
        if (error) throw error;
        return resData as FAQItem;
      }
    );
  },

  async updateFaq(id: number, updates: Partial<FAQItem>): Promise<FAQItem> {
    return apiFetch<FAQItem>(
      '/api/content?type=faqs',
      {
        method: 'PUT',
        body: JSON.stringify({ id, type: 'faqs', ...updates }),
      },
      async () => {
        const { data, error } = await supabase
          .from('faqs')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data as FAQItem;
      }
    );
  },

  async deleteFaq(id: number): Promise<void> {
    return apiFetch<void>(
      `/api/content?type=faqs&id=${id}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ id, type: 'faqs' }),
      },
      async () => {
        const { error } = await supabase.from('faqs').delete().eq('id', id);
        if (error) throw error;
      }
    );
  },

  async getGallery(): Promise<GalleryItem[]> {
    return apiFetch<GalleryItem[]>(
      '/api/content?type=gallery',
      { method: 'GET' },
      async () => {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []) as GalleryItem[];
      }
    );
  },

  async createGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem> {
    return apiFetch<GalleryItem>(
      '/api/content?type=gallery',
      {
        method: 'POST',
        body: JSON.stringify({ type: 'gallery', ...data }),
      },
      async () => {
        const { data: resData, error } = await supabase
          .from('gallery')
          .insert([data])
          .select()
          .single();
        if (error) throw error;
        return resData as GalleryItem;
      }
    );
  },

  async deleteGalleryItem(id: number): Promise<void> {
    return apiFetch<void>(
      `/api/content?type=gallery&id=${id}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ id, type: 'gallery' }),
      },
      async () => {
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (error) throw error;
      }
    );
  },

  async getServices(): Promise<ServiceItem[]> {
    return apiFetch<ServiceItem[]>(
      '/api/content?type=services',
      { method: 'GET' },
      async () => {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: true });
        if (error) throw error;
        return (data || []) as ServiceItem[];
      }
    );
  },

  async createService(data: Partial<ServiceItem>): Promise<ServiceItem> {
    return apiFetch<ServiceItem>(
      '/api/content?type=services',
      {
        method: 'POST',
        body: JSON.stringify({ type: 'services', ...data }),
      },
      async () => {
        const { data: resData, error } = await supabase
          .from('services')
          .insert([data])
          .select()
          .single();
        if (error) throw error;
        return resData as ServiceItem;
      }
    );
  },

  async updateService(id: number, updates: Partial<ServiceItem>): Promise<ServiceItem> {
    return apiFetch<ServiceItem>(
      '/api/content?type=services',
      {
        method: 'PUT',
        body: JSON.stringify({ id, type: 'services', ...updates }),
      },
      async () => {
        const { data, error } = await supabase
          .from('services')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data as ServiceItem;
      }
    );
  },

  async deleteService(id: number): Promise<void> {
    return apiFetch<void>(
      `/api/content?type=services&id=${id}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ id, type: 'services' }),
      },
      async () => {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) throw error;
      }
    );
  },

  async getStats(): Promise<AdminStats> {
    return apiFetch<AdminStats>(
      '/api/stats',
      { method: 'GET' },
      async () => {
        const [bookingsRes, fleetRes, routesRes, blogsRes] = await Promise.all([
          supabase.from('bookings').select('id, status, estimated_amount'),
          supabase.from('fleet').select('id, is_active'),
          supabase.from('routes').select('id'),
          supabase.from('blogs').select('id'),
        ]);

        const bookings = bookingsRes.data || [];
        const fleet = fleetRes.data || [];
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
        const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length;
        const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.estimated_amount) || 0), 0);

        return {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          totalRevenue,
          totalFleet: fleet.length,
          activeFleet: fleet.filter((f) => f.is_active !== false).length,
          totalRoutes: (routesRes.data || []).length,
          totalBlogs: (blogsRes.data || []).length,
        };
      }
    );
  },
};
