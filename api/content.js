import supabase from './_lib/db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const type = req.query.type || req.query.resource || req.body?.type || 'blogs';
    const validTables = ['blogs', 'gallery', 'faqs', 'routes', 'services', 'testimonials'];

    if (!validTables.includes(type)) {
      return res.status(400).json({ error: `Invalid content type: ${type}` });
    }

    if (req.method === 'GET') {
      const { slug, id } = req.query || {};

      if (slug && type === 'blogs') {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      if (id) {
        const { data, error } = await supabase
          .from(type)
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      let query = supabase.from(type).select('*');

      if (type === 'faqs') {
        query = query.order('sorting_order', { ascending: true });
      } else if (type === 'blogs') {
        query = query.order('publish_date', { ascending: false });
      } else if (type === 'gallery') {
        query = query.order('created_at', { ascending: false });
      } else if (type === 'testimonials') {
        query = query.order('rating', { ascending: false });
      } else if (type === 'routes') {
        query = query.order('is_popular', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { type: _, ...body } = req.body || {};

      if (type === 'blogs' && !body.slug && body.title) {
        body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      const { data, error } = await supabase
        .from(type)
        .insert([body])
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, type: _, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing ID for update' });

      const { data, error } = await supabase
        .from(type)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || req.query || {};
      if (!id) return res.status(400).json({ error: 'Missing ID for deletion' });

      const { error } = await supabase
        .from(type)
        .delete()
        .eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true, id });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(`Content API error [${req.query.type}]:`, err);
    res.status(500).json({ error: err.message });
  }
}