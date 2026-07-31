import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { path } = req.query || {};
      if (path) {
        const { data, error } = await supabase
          .from('seo_pages')
          .select('*')
          .eq('page_path', path)
          .single();
        if (error && error.code !== 'PGRST116') throw error;
        return res.status(200).json(data || null);
      }

      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = req.body || {};
      if (!body.page_path) {
        return res.status(400).json({ error: 'Missing page_path' });
      }

      const seoPayload = {
        page_path: body.page_path,
        meta_title: body.meta_title || '',
        meta_description: body.meta_description || '',
        canonical_url: body.canonical_url || '',
        robots_meta: body.robots_meta || 'index, follow',
        og_title: body.og_title || body.meta_title || '',
        og_description: body.og_description || body.meta_description || '',
        og_image: body.og_image || '',
        og_type: body.og_type || 'website',
        twitter_card: body.twitter_card || 'summary_large_image',
        schema_type: body.schema_type || 'LocalBusiness',
        custom_json_ld: body.custom_json_ld || '',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('seo_pages')
        .upsert([seoPayload], { onConflict: 'page_path' })
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('SEO API error:', err);
    res.status(500).json({ error: err.message });
  }
}