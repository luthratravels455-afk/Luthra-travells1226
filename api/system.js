import supabase from './_lib/db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const [
      bookingsRes,
      fleetRes,
      routesRes,
      blogsRes
    ] = await Promise.all([
      supabase.from('bookings').select('id, status, estimated_amount, created_at'),
      supabase.from('fleet').select('id, is_active'),
      supabase.from('routes').select('id'),
      supabase.from('blogs').select('id')
    ]);

    const bookings = bookingsRes.data || [];
    const fleet = fleetRes.data || [];
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.estimated_amount) || 0), 0);

    return res.status(200).json({
      status: 'HEALTHY',
      uptime: process.uptime ? Math.floor(process.uptime()) : 86400,
      timestamp: new Date().toISOString(),
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalRevenue,
      totalFleet: fleet.length,
      activeFleet: fleet.filter(f => f.is_active !== false).length,
      totalRoutes: (routesRes.data || []).length,
      totalBlogs: (blogsRes.data || []).length
    });
  } catch (err) {
    console.error('System/Stats API error:', err);
    res.status(500).json({ error: err.message });
  }
}
