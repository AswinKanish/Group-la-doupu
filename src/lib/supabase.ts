import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default / stored Supabase settings in localStorage or environment variables
const SUPABASE_URL_KEY = 'doopu_supabase_url';
const SUPABASE_ANON_KEY = 'doopu_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

let activeSupabaseClient: SupabaseClient | null = null;

export function getStoredSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = localStorage.getItem(SUPABASE_URL_KEY) || envUrl;
  const storedKey = localStorage.getItem(SUPABASE_ANON_KEY) || envKey;

  return {
    url: storedUrl,
    anonKey: storedKey,
    isConnected: !!(storedUrl && storedKey && activeSupabaseClient),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  localStorage.setItem(SUPABASE_ANON_KEY, anonKey.trim());
  initSupabaseClient(url.trim(), anonKey.trim());
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem(SUPABASE_URL_KEY);
  localStorage.removeItem(SUPABASE_ANON_KEY);
  activeSupabaseClient = null;
}

export function initSupabaseClient(url?: string, anonKey?: string): SupabaseClient | null {
  const confUrl = url || localStorage.getItem(SUPABASE_URL_KEY) || (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const confKey = anonKey || localStorage.getItem(SUPABASE_ANON_KEY) || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  if (!confUrl || !confKey) {
    activeSupabaseClient = null;
    return null;
  }

  try {
    activeSupabaseClient = createClient(confUrl, confKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return activeSupabaseClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    activeSupabaseClient = null;
    return null;
  }
}

// Check connection to Supabase instance
export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const client = createClient(url, anonKey);
    // Simple ping query: auth session or public table check
    const { error } = await client.auth.getSession();
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected successfully to Supabase!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection failed' };
  }
}

// Attempt auto-init on load if credentials exist
initSupabaseClient();
