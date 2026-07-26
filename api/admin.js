import supabase from './_lib/db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const type = req.query.type || req.body?.type || 'contacts';

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from(type)
        .select('*')
        .order('id', { ascending: false });
      if (error) {
        return res.status(200).json([]);
      }
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { type: _, ...body } = req.body || {};
      const { data, error } = await supabase
        .from(type)
        .insert([body])
        .select();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, type: _, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      const { data, error } = await supabase
        .from(type)
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || req.query || {};
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      const { error } = await supabase
        .from(type)
        .delete()
        .eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true, id });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(`Admin API error [${req.query.type}]:`, err);
    res.status(500).json({ error: err.message });
  }
}