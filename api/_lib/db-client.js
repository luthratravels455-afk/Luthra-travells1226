import { createClient } from '@supabase/supabase-js';
import { triggerRestore } from './db-wake.js';

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://fcfdmayqfywyxlyweypm.supabase.co';

const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_secret_exLXnODj58Ovz_LObvRlRQ_KNtt8mAn';

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
  global: {
    fetch: async (reqUrl, options) => {
      const res = await fetch(reqUrl, options);
      if (!res.ok && res.status >= 500) {
        try { triggerRestore(); } catch (e) {}
      }
      return res;
    },
  },
});

export default supabase;
