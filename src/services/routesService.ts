import { PopularRoute } from '../types';

export const routesService = {
  async getAllRoutes(params?: { active?: boolean; featured?: boolean; search?: string }): Promise<PopularRoute[]> {
    const query = new URLSearchParams({ type: 'routes' });
    if (params?.active) query.append('active', 'true');
    if (params?.featured) query.append('featured', 'true');
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`/api/content?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch routes');
    return res.json();
  },

  async createRoute(route: Partial<PopularRoute>): Promise<PopularRoute> {
    const res = await fetch('/api/content?type=routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'routes', ...route })
    });
    if (!res.ok) throw new Error('Failed to create route');
    return res.json();
  },

  async updateRoute(id: number, updates: Partial<PopularRoute>): Promise<PopularRoute> {
    const res = await fetch('/api/content?type=routes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type: 'routes', ...updates })
    });
    if (!res.ok) throw new Error('Failed to update route');
    return res.json();
  },

  async deleteRoute(id: number): Promise<void> {
    const res = await fetch(`/api/content?type=routes&id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete route');
  }
};
