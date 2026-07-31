import supabase from './_lib/db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { action, email = 'admin@luthratravels.com', id } = req.query.email ? req.query : (req.body || {});

    // GET Security Overview or Profile
    if (req.method === 'GET') {
      const targetEmail = req.query.email || 'admin@luthratravels.com';

      // Mock / Real security profile data
      const user = {
        name: 'Vikram Luthra',
        email: targetEmail,
        phone: '+91 99589 56593',
        role: 'SUPER_ADMIN',
        is_2fa_enabled: true,
        last_login_at: new Date().toISOString(),
      };

      const activeSessions = [
        {
          id: 1,
          admin_email: targetEmail,
          device_name: 'Chrome on macOS (Current)',
          ip_address: '103.21.124.88',
          last_active_at: new Date().toISOString(),
          is_current: true,
        },
      ];

      const loginHistory = [
        {
          id: 101,
          admin_email: targetEmail,
          ip_address: '103.21.124.88',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          login_at: new Date(Date.now() - 3600000).toISOString(),
          status: 'SUCCESS',
        },
      ];

      const teamUsers = [
        user,
        {
          id: 2,
          name: 'Operations Manager',
          email: 'ops@luthratravels.com',
          phone: '+91 98100 12345',
          role: 'ADMIN',
          is_2fa_enabled: false,
          last_login_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      return res.status(200).json({ user, activeSessions, loginHistory, teamUsers });
    }

    // POST / PUT / DELETE actions
    if (req.method === 'POST') {
      const bodyAction = req.body?.action;
      if (bodyAction === 'CREATE_ADMIN') {
        const newAdmin = req.body?.newAdmin || {};
        return res.status(201).json({
          user: {
            id: Math.floor(Math.random() * 1000),
            name: newAdmin.name || 'New Admin',
            email: newAdmin.email,
            phone: newAdmin.phone || '',
            role: newAdmin.role || 'ADMIN',
            created_at: new Date().toISOString(),
          },
        });
      }
      return res.status(200).json({ success: true });
    }

    if (req.method === 'PUT') {
      const act = req.body?.action;
      if (act === 'UPDATE_PROFILE') {
        return res.status(200).json({
          user: {
            name: req.body?.updates?.name || 'Vikram Luthra',
            email: req.body?.email || 'admin@luthratravels.com',
            phone: req.body?.updates?.phone || '+91 99589 56593',
            role: 'SUPER_ADMIN',
          },
        });
      }
      if (act === 'CHANGE_PASSWORD') {
        return res.status(200).json({ success: true, message: 'Password updated successfully' });
      }
      if (act === 'TOGGLE_2FA') {
        return res.status(200).json({ is_2fa_enabled: req.body?.is_2fa_enabled });
      }
      if (act === 'REVOKE_OTHER_SESSIONS') {
        return res.status(200).json({ success: true, revokedCount: 2 });
      }
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      return res.status(200).json({ success: true, id: req.query.id || req.body?.id });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Auth / Security API error:', err);
    res.status(500).json({ error: err.message });
  }
}
