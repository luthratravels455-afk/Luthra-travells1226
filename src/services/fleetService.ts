import { FleetVehicle } from '../types';
import { apiFetch } from './apiClient';
import supabase from '../lib/supabase';

export const fleetService = {
  async getAllFleet(category?: string): Promise<FleetVehicle[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);

    return apiFetch<FleetVehicle[]>(
      `/api/fleet?${params.toString()}`,
      { method: 'GET' },
      async () => {
        let q = supabase.from('fleet').select('*').order('sorting_order', { ascending: true });
        if (category && category !== 'ALL') {
          q = q.eq('category', category);
        }
        const { data, error } = await q;
        if (error) throw error;
        return (data || []) as FleetVehicle[];
      }
    );
  },

  async getVehicleById(id: number): Promise<FleetVehicle> {
    return apiFetch<FleetVehicle>(
      `/api/fleet?id=${id}`,
      { method: 'GET' },
      async () => {
        const { data, error } = await supabase
          .from('fleet')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data as FleetVehicle;
      }
    );
  },

  async createVehicle(vehicle: Partial<FleetVehicle>): Promise<FleetVehicle> {
    return apiFetch<FleetVehicle>(
      '/api/fleet',
      {
        method: 'POST',
        body: JSON.stringify(vehicle),
      },
      async () => {
        const { data, error } = await supabase
          .from('fleet')
          .insert([vehicle])
          .select()
          .single();
        if (error) throw error;
        return data as FleetVehicle;
      }
    );
  },

  async updateVehicle(id: number, updates: Partial<FleetVehicle>): Promise<FleetVehicle> {
    return apiFetch<FleetVehicle>(
      '/api/fleet',
      {
        method: 'PUT',
        body: JSON.stringify({ id, ...updates }),
      },
      async () => {
        const { data, error } = await supabase
          .from('fleet')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data as FleetVehicle;
      }
    );
  },

  async deleteVehicle(id: number): Promise<void> {
    return apiFetch<void>(
      `/api/fleet?id=${id}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      },
      async () => {
        const { error } = await supabase.from('fleet').delete().eq('id', id);
        if (error) throw error;
      }
    );
  },

  async getDefaultRatePerKm(): Promise<number> {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'default_rate_per_km')
        .single();
      if (data && data.value) {
        return parseFloat(data.value) || 14;
      }
    } catch {
      // Fallback
    }
    return 14;
  },
};
