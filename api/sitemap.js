import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');

  try {
    const domain = 'https://luthratravels.com';
    const now = new Date().toISOString().split('T')[0];

    const [blogsRes, fleetRes] = await Promise.all([
      supabase.from('blogs').select('slug, publish_date'),
      supabase.from('fleet').select('id')
    ]);

    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/fleet', priority: '0.9', changefreq: 'weekly' },
      { path: '/airport-transfers', priority: '0.9', changefreq: 'weekly' },
      { path: '/outstation-taxi', priority: '0.9', changefreq: 'weekly' },
      { path: '/local-taxi', priority: '0.8', changefreq: 'weekly' },
      { path: '/corporate-travel', priority: '0.8', changefreq: 'monthly' },
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/blog', priority: '0.8', changefreq: 'weekly' },
      { path: '/gallery', priority: '0.7', changefreq: 'monthly' },
      { path: '/faq', priority: '0.7', changefreq: 'monthly' },
      { path: '/contact', priority: '0.8', changefreq: 'monthly' },
      { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { path: '/terms-conditions', priority: '0.3', changefreq: 'yearly' },
    ];

    let urlsXml = staticPages
      .map(
        p => `  <url>
    <loc>${domain}${p.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
      )
      .join('\n');

    if (blogsRes.data) {
      blogsRes.data.forEach(b => {
        urlsXml += `\n  <url>
    <loc>${domain}/blog/${b.slug}</loc>
    <lastmod>${b.publish_date || now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });
    }

    if (fleetRes.data) {
      fleetRes.data.forEach(f => {
        urlsXml += `\n  <url>
    <loc>${domain}/fleet/${f.id}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

    return res.status(200).send(xml);
  } catch (err) {
    console.error('Sitemap API error:', err);
    return res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Error generating sitemap</error>');
  }
}