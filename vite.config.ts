import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createClient } from '@supabase/supabase-js';

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_', 'SUPABASE_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  const supabaseUrl =
    env.VITE_SUPABASE_URL ||
    env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://fcfdmayqfywyxlyweypm.supabase.co';

  const supabaseKey =
    env.SUPABASE_SERVICE_ROLE_KEY ||
    env.VITE_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_secret_exLXnODj58Ovz_LObvRlRQ_KNtt8mAn';

  const supabase = createClient(supabaseUrl, supabaseKey);

  const apiMiddleware = () => ({
    name: 'vite-api-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/')) return next();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        try {
          const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
          const pathname = parsedUrl.pathname;
          const query = Object.fromEntries(parsedUrl.searchParams.entries());

          // Parse JSON body if POST / PUT / DELETE
          let body: any = {};
          if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
            body = await new Promise((resolve) => {
              let data = '';
              req.on('data', (chunk: any) => { data += chunk; });
              req.on('end', () => {
                try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); }
              });
            });
          }

          // Map endpoint aliases
          let type = query.type || body.type;
          if (!type) {
            if (pathname.includes('/routes')) type = 'routes';
            else if (pathname.includes('/blogs')) type = 'blogs';
            else if (pathname.includes('/gallery')) type = 'gallery';
            else if (pathname.includes('/faqs')) type = 'faqs';
            else if (pathname.includes('/services')) type = 'services';
            else if (pathname.includes('/testimonials')) type = 'testimonials';
          }

          // Handle Content API
          if (pathname.includes('/content') || type) {
            const validTables = ['blogs', 'gallery', 'faqs', 'routes', 'services', 'testimonials'];
            const targetTable = validTables.includes(type) ? type : 'routes';

            if (req.method === 'GET') {
              let q = supabase.from(targetTable).select('*');
              if (query.slug && targetTable === 'blogs') {
                const { data, error } = await supabase.from('blogs').select('*').eq('slug', query.slug).single();
                if (error) throw error;
                return res.end(JSON.stringify(data));
              }
              if (query.id) {
                const { data, error } = await supabase.from(targetTable).select('*').eq('id', query.id).single();
                if (error) throw error;
                return res.end(JSON.stringify(data));
              }

              if (targetTable === 'faqs') q = q.order('sorting_order', { ascending: true });
              else if (targetTable === 'blogs') q = q.order('publish_date', { ascending: false });
              else if (targetTable === 'routes') q = q.order('is_popular', { ascending: false });

              const { data, error } = await q;
              if (error) throw error;
              return res.end(JSON.stringify(data || []));
            }

            if (req.method === 'POST') {
              const { type: _, ...insertData } = body;
              if (targetTable === 'blogs' && !insertData.slug && insertData.title) {
                insertData.slug = insertData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              }
              const { data, error } = await supabase.from(targetTable).insert([insertData]).select().single();
              if (error) throw error;
              res.statusCode = 201;
              return res.end(JSON.stringify(data));
            }

            if (req.method === 'PUT') {
              const { id, type: _, ...updates } = body;
              const { data, error } = await supabase.from(targetTable).update(updates).eq('id', id).select().single();
              if (error) throw error;
              return res.end(JSON.stringify(data));
            }

            if (req.method === 'DELETE') {
              const targetId = body.id || query.id;
              const { error } = await supabase.from(targetTable).delete().eq('id', targetId);
              if (error) throw error;
              return res.end(JSON.stringify({ success: true, id: targetId }));
            }
          }

          // Handle Fleet API
          if (pathname.includes('/fleet')) {
            if (req.method === 'GET') {
              if (query.id) {
                const { data, error } = await supabase.from('fleet').select('*').eq('id', query.id).single();
                if (error) throw error;
                return res.end(JSON.stringify(data));
              }
              const { data, error } = await supabase.from('fleet').select('*').order('sorting_order', { ascending: true });
              if (error) throw error;
              return res.end(JSON.stringify(data || []));
            }
            if (req.method === 'POST') {
              const { data, error } = await supabase.from('fleet').insert([body]).select().single();
              if (error) throw error;
              res.statusCode = 201;
              return res.end(JSON.stringify(data));
            }
            if (req.method === 'PUT') {
              const { id, ...updates } = body;
              const { data, error } = await supabase.from('fleet').update(updates).eq('id', id).select().single();
              if (error) throw error;
              return res.end(JSON.stringify(data));
            }
            if (req.method === 'DELETE') {
              const targetId = body.id || query.id;
              const { error } = await supabase.from('fleet').delete().eq('id', targetId);
              if (error) throw error;
              return res.end(JSON.stringify({ success: true, id: targetId }));
            }
          }

          // Handle Settings API
          if (pathname.includes('/settings')) {
            if (req.method === 'GET') {
              const { data, error } = await supabase.from('site_settings').select('*');
              if (error) throw error;
              const map: Record<string, string> = {};
              data?.forEach((i) => { map[i.key] = i.value; });
              return res.end(JSON.stringify(map));
            }
            if (req.method === 'POST' || req.method === 'PUT') {
              const upserts = Object.keys(body).map((key) => ({
                key,
                value: body[key],
                updated_at: new Date().toISOString(),
              }));
              const { error } = await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' });
              if (error) throw error;
              return res.end(JSON.stringify({ success: true, count: upserts.length }));
            }
          }

          // Handle Bookings API
          if (pathname.includes('/bookings')) {
            if (req.method === 'GET') {
              let q = supabase.from('bookings').select('*').order('created_at', { ascending: false });
              if (query.status && query.status !== 'ALL') q = q.eq('status', query.status);
              const { data, error } = await q;
              if (error) throw error;
              return res.end(JSON.stringify(data || []));
            }
            if (req.method === 'POST') {
              const booking_ref = 'LT-' + Math.floor(100000 + Math.random() * 900000);
              const newB = { ...body, booking_ref, created_at: new Date().toISOString() };
              const { data, error } = await supabase.from('bookings').insert([newB]).select().single();
              if (error) throw error;
              res.statusCode = 201;
              return res.end(JSON.stringify(data));
            }
            if (req.method === 'PUT') {
              const { id, ...updates } = body;
              const { data, error } = await supabase.from('bookings').update(updates).eq('id', id).select().single();
              if (error) throw error;
              return res.end(JSON.stringify(data));
            }
            if (req.method === 'DELETE') {
              const targetId = body.id || query.id;
              const { error } = await supabase.from('bookings').delete().eq('id', targetId);
              if (error) throw error;
              return res.end(JSON.stringify({ success: true, id: targetId }));
            }
          }

          // Handle Stats API
          if (pathname.includes('/stats') || pathname.includes('/system')) {
            const [bRes, fRes, rRes, blRes] = await Promise.all([
              supabase.from('bookings').select('id, status, estimated_amount'),
              supabase.from('fleet').select('id, is_active'),
              supabase.from('routes').select('id'),
              supabase.from('blogs').select('id'),
            ]);
            const bookings = bRes.data || [];
            const fleet = fRes.data || [];
            return res.end(JSON.stringify({
              totalBookings: bookings.length,
              pendingBookings: bookings.filter((b) => b.status === 'PENDING').length,
              confirmedBookings: bookings.filter((b) => b.status === 'CONFIRMED').length,
              totalRevenue: bookings.reduce((sum, b) => sum + (Number(b.estimated_amount) || 0), 0),
              totalFleet: fleet.length,
              activeFleet: fleet.filter((f) => f.is_active !== false).length,
              totalRoutes: (rRes.data || []).length,
              totalBlogs: (blRes.data || []).length,
            }));
          }

          return next();
        } catch (err: any) {
          console.error('[vite-api-middleware] Error:', err);
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
        }
      });
    },
  });

  const plugins = [react(), tailwindcss(), apiMiddleware()];
  try {
    // @ts-ignore
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {}

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
  };
});
