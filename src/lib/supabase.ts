import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with proper error checking
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if URL and key are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your .env.local file.');
}

// Make sure we have a valid URL by adding an explicit protocol if missing
const formattedUrl = supabaseUrl?.startsWith('http') 
  ? supabaseUrl 
  : `https://${supabaseUrl}`;

export const supabase = createClient(formattedUrl || '', supabaseAnonKey || ''); 