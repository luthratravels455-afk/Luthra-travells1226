import { FleetVehicle } from '../types';

export const fleetService = {
  async getAllFleet(category?: string): Promise<FleetVehicle[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const res = await fetch(`/api/fleet?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch fleet');
    const data: FleetVehicle[] = await res.json();
    return data;
  },

  async getVehicleById(id: number): Promise<FleetVehicle> {
    const res = await fetch(`/api/fleet?id=${id}`);
    if (!res.ok) throw new Error('Failed to fetch vehicle detail');
    return res.json();
  },

  async createVehicle(vehicle: Partial<FleetVehicle>): Promise<FleetVehicle> {
    const res = await fetch('/api/fleet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle)
    });
    if (!res.ok) throw new Error('Failed to create vehicle');
    return res.json();
  },

  async updateVehicle(id: number, updates: Partial<FleetVehicle>): Promise<FleetVehicle> {
    const res = await fetch('/api/fleet', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    if (!res.ok) throw new Error('Failed to update vehicle');
    return res.json();
  },

  async deleteVehicle(id: number): Promise<void> {
    const res = await fetch(`/api/fleet?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete vehicle');
  },

  async getDefaultRatePerKm(): Promise<number> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const settings = await res.json();
        if (settings.default_rate_per_km) {
          return parseFloat(settings.default_rate_per_km) || 14;
        }
      }
    } catch {
      // Fallback default
    }
    return 14;
  }
};
