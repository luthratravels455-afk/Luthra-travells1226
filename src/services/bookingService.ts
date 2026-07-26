import { Booking } from '../types';

export const bookingService = {
  async getAllBookings(status?: string, search?: string): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const res = await fetch(`/api/bookings?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async createBooking(data: Partial<Booking>): Promise<Booking> {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create booking');
    return res.json();
  },

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking> {
    const res = await fetch('/api/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    if (!res.ok) throw new Error('Failed to update booking');
    return res.json();
  },

  async deleteBooking(id: number): Promise<void> {
    const res = await fetch(`/api/bookings?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete booking');
  }
};
