import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { email, username, password, action } = req.body || {};

      if (action === 'verify') {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          return res.status(401).json({ error: 'Invalid Username or Password' });
        }
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
          return res.status(401).json({ error: 'Invalid Username or Password' });
        }
        return res.status(200).json({ valid: true, user });
      }

      // Default Login Flow
      let authEmail = (email || username || '').trim();
      if (authEmail === 'admin') {
        authEmail = 'admin@luthratravels.com';
      }

      if (!authEmail || !password) {
        return res.status(401).json({ error: 'Invalid Username or Password' });
      }

      // Validate against Supabase Auth Backend
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: password,
      });

      if (error || !data.session || !data.user) {
        return res.status(401).json({ error: 'Invalid Username or Password' });
      }

      return res.status(200).json({
        success: true,
        session: data.session,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: 'Super Admin',
        },
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Auth API error:', err);
    res.status(401).json({ error: 'Invalid Username or Password' });
  }
}
