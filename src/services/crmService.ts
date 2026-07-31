export interface CustomerProfile {
  id: number;
  name: string;
  phone: string;
  email?: string;
  total_trips: number;
  total_spent: number;
  favourite_vehicle?: string;
  last_booking_date?: string;
  notes?: string;
  created_at?: string;
}

export interface DriverProfile {
  id: number;
  name: string;
  phone: string;
  license_number: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY';
  assigned_vehicle_id?: number;
  rating?: number;
  notes?: string;
}

export interface GSTInvoice {
  id?: number;
  invoice_number: string;
  booking_ref: string;
  customer_name: string;
  customer_phone: string;
  customer_gst?: string;
  subtotal: number;
  gst_rate: number;
  gst_amount: number;
  total_amount: number;
  payment_status: 'Pending' | 'Paid' | 'Refunded' | 'Cancelled';
  created_at?: string;
}

export const crmService = {
  // Customer Profiles
  async getAllCustomers(search?: string): Promise<CustomerProfile[]> {
    const params = new URLSearchParams();
    params.append('resource', 'customers');
    if (search) params.append('search', search);
    const res = await fetch(`/api/bookings?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch customer profiles');
    return res.json();
  },

  async createCustomer(profile: Partial<CustomerProfile>): Promise<CustomerProfile> {
    const res = await fetch('/api/bookings?resource=customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'customers', ...profile }),
    });
    if (!res.ok) throw new Error('Failed to create customer profile');
    return res.json();
  },

  async updateCustomer(id: number, updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
    const res = await fetch('/api/bookings?resource=customers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'customers', id, ...updates }),
    });
    if (!res.ok) throw new Error('Failed to update customer profile');
    return res.json();
  },

  // Drivers Module
  async getAllDrivers(): Promise<DriverProfile[]> {
    const res = await fetch('/api/bookings?resource=drivers');
    if (!res.ok) throw new Error('Failed to fetch driver list');
    return res.json();
  },

  async createDriver(driver: Partial<DriverProfile>): Promise<DriverProfile> {
    const res = await fetch('/api/bookings?resource=drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'drivers', ...driver }),
    });
    if (!res.ok) throw new Error('Failed to add driver');
    return res.json();
  },

  async updateDriver(id: number, updates: Partial<DriverProfile>): Promise<DriverProfile> {
    const res = await fetch('/api/bookings?resource=drivers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'drivers', id, ...updates }),
    });
    if (!res.ok) throw new Error('Failed to update driver');
    return res.json();
  },

  // Invoices Module
  async getAllInvoices(): Promise<GSTInvoice[]> {
    const res = await fetch('/api/bookings?resource=invoices');
    if (!res.ok) throw new Error('Failed to fetch GST invoices');
    return res.json();
  },

  async createInvoice(invoice: Partial<GSTInvoice>): Promise<GSTInvoice> {
    const res = await fetch('/api/bookings?resource=invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'invoices', ...invoice }),
    });
    if (!res.ok) throw new Error('Failed to generate invoice');
    return res.json();
  },

  async updateInvoiceStatus(id: number, payment_status: 'Pending' | 'Paid' | 'Refunded' | 'Cancelled'): Promise<GSTInvoice> {
    const res = await fetch('/api/bookings?resource=invoices', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'invoices', id, payment_status }),
    });
    if (!res.ok) throw new Error('Failed to update invoice status');
    return res.json();
  },

  sendNotification(type: 'WHATSAPP' | 'EMAIL' | 'SMS', recipient: string, message: string) {
    console.log(`[Notification Service] Sending ${type} to ${recipient}: "${message}"`);
    return { success: true, timestamp: new Date().toISOString() };
  }
};
