import supabase from './db-client.js';

export default async function handler(req, res) {
  try {
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const adminUser = users.find(u => u.email === 'admin@luthratravels.com');

    if (adminUser) {
      const { data, error } = await supabase.auth.admin.updateUserById(adminUser.id, {
        password: 'Luthra@2026!'
      });
      if (error) throw error;
      return res.status(200).json({ success: true, action: 'updated', userId: adminUser.id });
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'admin@luthratravels.com',
        password: 'Luthra@2026!',
        email_confirm: true
      });
      if (error) throw error;
      return res.status(200).json({ success: true, action: 'created', userId: data.user.id });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
