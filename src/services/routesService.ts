import { PopularRoute } from '../types';
import { apiFetch } from './apiClient';
import supabase from '../lib/supabase';

export const routesService = {
  async getAllRoutes(params?: { active?: boolean; featured?: boolean; search?: string }): Promise<PopularRoute[]> {
    const query = new URLSearchParams({ type: 'routes' });
    if (params?.active) query.append('active', 'true');
    if (params?.featured) query.append('featured', 'true');
    if (params?.search) query.append('search', params.search);

    return apiFetch<PopularRoute[]>(
      `/api/content?${query.toString()}`,
      { method: 'GET' },
      async () => {
        let q = supabase.from('routes').select('*').order('is_popular', { ascending: false });
        if (params?.active) q = q.eq('is_popular', true);
        const { data, error } = await q;
        if (error) throw error;
        return (data || []) as PopularRoute[];
      }
    );
  },

  async createRoute(route: Partial<PopularRoute>): Promise<PopularRoute> {
    return apiFetch<PopularRoute>(
      '/api/content?type=routes',
      {
        method: 'POST',
        body: JSON.stringify({ type: 'routes', ...route }),
      },
      async () => {
        const { data, error } = await supabase
          .from('routes')
          .insert([route])
          .select()
          .single();
        if (error) throw error;
        return data as PopularRoute;
      }
    );
  },

  async updateRoute(id: number, updates: Partial<PopularRoute>): Promise<PopularRoute> {
    return apiFetch<PopularRoute>(
      '/api/content?type=routes',
      {
        method: 'PUT',
        body: JSON.stringify({ id, type: 'routes', ...updates }),
      },
      async () => {
        const { data, error } = await supabase
          .from('routes')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data as PopularRoute;
      }
    );
  },

  async deleteRoute(id: number): Promise<void> {
    return apiFetch<void>(
      `/api/content?type=routes&id=${id}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ id, type: 'routes' }),
      },
      async () => {
        const { error } = await supabase.from('routes').delete().eq('id', id);
        if (error) throw error;
      }
    );
  },
};
