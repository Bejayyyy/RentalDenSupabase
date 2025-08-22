import 'react-native-url-polyfill/auto'; // MUST be first
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://oxqmrdqeczcwgjfplzjv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cW1yZHFlY3pjd2dqZnBsemp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MDQwODUsImV4cCI6MjA3MDQ4MDA4NX0.KdUmdVzh6MdnYpxIr2lQBZCbqWi3BBLv1lfAarEQlAA';

// Minimal CORS configuration that preserves your original setup
const supabaseOptions = {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // Only add custom fetch for web to handle CORS better
  ...(Platform.OS === 'web' && {
    global: {
      fetch: async (url, options = {}) => {
        return fetch(url, {
          ...options,
          mode: 'cors',
          credentials: 'omit',
        });
      }
    }
  })
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('vehicles').select('*').limit(1);
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};