import supabase from './_lib/db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { status, search, limit } = req.query || {};
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
      
      if (status && status !== 'ALL') {
        query = query.eq('status', status);
      }
      if (limit) {
        query = query.limit(parseInt(limit, 10));
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      let filteredData = data || [];
      if (search) {
        const q = search.toLowerCase();
        filteredData = filteredData.filter(b => 
          (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
          (b.customer_phone && b.customer_phone.includes(q)) ||
          (b.pickup && b.pickup.toLowerCase().includes(q)) ||
          (b.drop_location && b.drop_location.toLowerCase().includes(q)) ||
          (b.booking_ref && b.booking_ref.toLowerCase().includes(q))
        );
      }
      return res.status(200).json(filteredData);
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const booking_ref = 'LT-' + Math.floor(100000 + Math.random() * 900000);
      const newBooking = {
        booking_ref,
        trip_type: body.trip_type || 'OUTSTATION',
        pickup: body.pickup,
        drop_location: body.drop_location || body.drop,
        travel_date: body.travel_date || body.travelDate,
        pickup_time: body.pickup_time || body.pickupTime,
        vehicle: body.vehicle,
        customer_name: body.customer_name || body.name,
        customer_phone: body.customer_phone || body.phone,
        customer_email: body.customer_email || body.email || '',
        passengers: parseInt(body.passengers || 1, 10),
        message: body.message || '',
        status: 'PENDING',
        estimated_amount: parseFloat(body.estimated_amount || body.price || 0),
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([newBooking])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, status, admin_notes } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing booking ID' });

      const updates = {};
      if (status) updates.status = status;
      if (admin_notes !== undefined) updates.admin_notes = admin_notes;

      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || req.query || {};
      if (!id) return res.status(400).json({ error: 'Missing booking ID' });

      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true, id });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Bookings API error:', err);
    res.status(500).json({ error: err.message });
  }
}