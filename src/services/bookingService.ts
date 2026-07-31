import { Booking } from '../types';
import { apiFetch } from './apiClient';
import supabase from '../lib/supabase';

export const bookingService = {
  async getAllBookings(status?: string, search?: string): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    return apiFetch<Booking[]>(
      `/api/bookings?${params.toString()}`,
      { method: 'GET' },
      async () => {
        let q = supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (status && status !== 'ALL') {
          q = q.eq('status', status);
        }
        const { data, error } = await q;
        if (error) throw error;

        let filtered = (data || []) as Booking[];
        if (search) {
          const queryStr = search.toLowerCase();
          filtered = filtered.filter(
            (b) =>
              (b.customer_name && b.customer_name.toLowerCase().includes(queryStr)) ||
              (b.customer_phone && b.customer_phone.includes(queryStr)) ||
              (b.pickup && b.pickup.toLowerCase().includes(queryStr)) ||
              (b.booking_ref && b.booking_ref.toLowerCase().includes(queryStr))
          );
        }
        return filtered;
      }
    );
  },

  async createBooking(data: Partial<Booking>): Promise<Booking> {
    const booking_ref = 'LT-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking = {
      booking_ref,
      trip_type: data.trip_type || 'OUTSTATION',
      pickup: data.pickup,
      drop_location: data.drop_location || data.drop_location || 'Local Area',
      travel_date: data.travel_date,
      pickup_time: data.pickup_time,
      vehicle: data.vehicle,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email || '',
      passengers: data.passengers || 1,
      message: data.message || '',
      status: 'PENDING' as const,
      estimated_amount: data.estimated_amount || 0,
      created_at: new Date().toISOString(),
    };

    return apiFetch<Booking>(
      '/api/bookings',
      {
        method: 'POST',
        body: JSON.stringify(newBooking),
      },
      async () => {
        const { data: resData, error } = await supabase
          .from('bookings')
          .insert([newBooking])
          .select()
          .single();
        if (error) throw error;
        return resData as Booking;
      }
    );
  },

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking> {
    return apiFetch<Booking>(
      '/api/bookings',
      {
        method: 'PUT',
        body: JSON.stringify({ id, ...updates }),
      },
      async () => {
        const { data, error } = await supabase
          .from('bookings')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data as Booking;
      }
    );
  },

  async deleteBooking(id: number): Promise<void> {
    return apiFetch<void>(
      `/api/bookings?id=${id}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      },
      async () => {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
      }
    );
  },
};
