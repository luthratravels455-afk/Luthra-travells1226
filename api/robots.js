import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  try {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'robots_txt')
      .single();

    if (data && data.value) {
      return res.status(200).send(data.value);
    }

    const defaultRobots = `# Luthra Travels SEO Robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /api/

Sitemap: https://luthratravels.com/api/sitemap
`;

    return res.status(200).send(defaultRobots);
  } catch (err) {
    console.error('Robots API error:', err);
    return res.status(500).send('User-agent: *\nAllow: /');
  }
}