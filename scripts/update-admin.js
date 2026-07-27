import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
let envVars = {};
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      envVars[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
} catch (e) {}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing env vars:', { supabaseUrl: !!supabaseUrl, serviceKey: !!serviceKey });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
  console.log('Listing users...');
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('List error:', error);
    process.exit(1);
  }

  const admin = users.find(u => u.email === 'admin@luthratravels.com');
  if (admin) {
    console.log('Found admin user ID:', admin.id);
    const { data, error: updateErr } = await supabase.auth.admin.updateUserById(admin.id, {
      password: 'Luthra@2026!',
      email_confirm: true
    });
    if (updateErr) {
      console.error('Update error:', updateErr);
      process.exit(1);
    }
    console.log('Successfully updated password for admin@luthratravels.com to Luthra@2026!');
  } else {
    console.log('Creating new admin user...');
    const { data, error: createErr } = await supabase.auth.admin.createUser({
      email: 'admin@luthratravels.com',
      password: 'Luthra@2026!',
      email_confirm: true
    });
    if (createErr) {
      console.error('Create error:', createErr);
      process.exit(1);
    }
    console.log('Successfully created admin@luthratravels.com with password Luthra@2026!');
  }
}

run();
