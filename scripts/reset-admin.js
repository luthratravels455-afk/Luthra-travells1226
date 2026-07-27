import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcfdmayqfywyxlyweypm.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_exLXnODj58Ovz_LObvRlRQ_KNtt8mAn';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function resetAdmin() {
  try {
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const adminUser = users.find(u => u.email === 'admin@luthratravels.com');

    if (adminUser) {
      const { data, error } = await supabase.auth.admin.updateUserById(adminUser.id, {
        password: 'Luthra@2026!',
        email_confirm: true
      });
      if (error) throw error;
      console.log('✔ Updated existing admin password to Luthra@2026! User ID:', adminUser.id);
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'admin@luthratravels.com',
        password: 'Luthra@2026!',
        email_confirm: true
      });
      if (error) throw error;
      console.log('✔ Created new admin account admin@luthratravels.com with password Luthra@2026! User ID:', data.user.id);
    }
  } catch (err) {
    console.error('Error resetting admin credentials:', err);
  }
}

resetAdmin();
