import supabase from './_lib/db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const url = req.url || '';
    const type = req.query.type || (url.includes('sitemap') ? 'sitemap' : url.includes('robots') ? 'robots' : 'page');

    // Handle XML Sitemap
    if (type === 'sitemap') {
      res.setHeader('Content-Type', 'text/xml');
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://luthratravels.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://luthratravels.com/fleet</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://luthratravels.com/airport-transfers</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://luthratravels.com/outstation-taxi</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://luthratravels.com/local-taxi</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://luthratravels.com/corporate-travel</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://luthratravels.com/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://luthratravels.com/blog</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://luthratravels.com/gallery</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://luthratravels.com/faq</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://luthratravels.com/contact</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>`;
      return res.status(200).send(xml);
    }

    // Handle Robots.txt
    if (type === 'robots') {
      res.setHeader('Content-Type', 'text/plain');
      const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://luthratravels.com/api/seo?type=sitemap`;
      return res.status(200).send(robots);
    }

    // Handle Page SEO metadata CRUD
    if (req.method === 'GET') {
      const { path } = req.query || {};
      let query = supabase.from('seo_records').select('*');
      if (path) {
        query = query.eq('page_path', path).single();
      }

      const { data, error } = await query;
      if (error && error.code !== 'PGRST116') throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const record = req.body || {};
      const { data, error } = await supabase
        .from('seo_records')
        .upsert([{ ...record, updated_at: new Date().toISOString() }], { onConflict: 'page_path' })
        .select();

      if (error) throw error;
      return res.status(200).json(data?.[0] || record);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('SEO API error:', err);
    res.status(500).json({ error: err.message });
  }
}
