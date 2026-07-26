import supabase from './_lib/db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      
      const settingsMap = {};
      if (data) {
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });
      }
      return res.status(200).json(settingsMap);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const settingsObj = req.body || {};
      const upserts = Object.keys(settingsObj).map(key => ({
        key,
        value: settingsObj[key],
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('site_settings')
        .upsert(upserts, { onConflict: 'key' })
        .select();

      if (error) throw error;
      return res.status(200).json({ success: true, count: upserts.length });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Settings API error:', err);
    res.status(500).json({ error: err.message });
  }
}