import supabase from '../lib/supabase';

/**
 * Universal safe API fetch helper that always returns parsed JSON.
 * If the API endpoint returns JavaScript source code (starting with "import")
 * or non-JSON text, it seamlessly falls back to direct Supabase client queries.
 */
export async function apiFetch<T = any>(
  url: string,
  options?: RequestInit,
  fallbackQuery?: () => Promise<T>
): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    const text = await res.text();

    // Check if the response is source code or HTML instead of JSON
    if (text.trim().startsWith('import') || text.trim().startsWith('<')) {
      console.warn(`[apiClient] API endpoint ${url} returned source/HTML text. Executing Supabase fallback...`);
      if (fallbackQuery) {
        return await fallbackQuery();
      }
      throw new Error(`API endpoint ${url} returned non-JSON text.`);
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.warn(`[apiClient] JSON parse failed for ${url}. Executing Supabase fallback...`);
      if (fallbackQuery) {
        return await fallbackQuery();
      }
      throw new Error(`Invalid JSON response from ${url}`);
    }

    if (!res.ok) {
      const errMsg = data?.error || data?.message || `HTTP ${res.status}`;
      if (fallbackQuery) {
        console.warn(`[apiClient] API ${url} status ${res.status}: ${errMsg}. Executing Supabase fallback...`);
        return await fallbackQuery();
      }
      throw new Error(errMsg);
    }

    return data as T;
  } catch (err: any) {
    console.warn(`[apiClient] Fetch error for ${url}: ${err.message}. Attempting Supabase fallback...`);
    if (fallbackQuery) {
      return await fallbackQuery();
    }
    throw err;
  }
}
