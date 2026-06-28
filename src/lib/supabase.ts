import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabaseConfigDebug = {
  hasUrl: Boolean(supabaseUrl),
  hasAnonKey: Boolean(supabaseAnonKey),
  urlHost: supabaseUrl ? (() => {
    try {
      return new URL(supabaseUrl).host;
    } catch {
      return 'invalid-url';
    }
  })() : 'missing',
  anonKeyPrefix: supabaseAnonKey ? supabaseAnonKey.slice(0, 12) : 'missing',
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
