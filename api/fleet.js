import supabase from './_lib/db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { id, category } = req.query || {};
      if (id) {
        const { data, error } = await supabase
          .from('fleet')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      let query = supabase.from('fleet').select('*').order('sorting_order', { ascending: true });
      if (category && category !== 'ALL') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const body = req.body;
      const { data, error } = await supabase
        .from('fleet')
        .insert([body])
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing fleet ID' });

      const { data, error } = await supabase
        .from('fleet')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || req.query || {};
      if (!id) return res.status(400).json({ error: 'Missing fleet ID' });

      const { error } = await supabase
        .from('fleet')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true, id });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Fleet API error:', err);
    res.status(500).json({ error: err.message });
  }
}