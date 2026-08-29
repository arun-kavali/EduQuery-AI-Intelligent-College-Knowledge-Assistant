import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kwocboobfocgrkhndtun.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3b2Nib29iZm9jZ3JraG5kdHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5ODIxMTQsImV4cCI6MjEwMzU1ODExNH0.v_sNOfTiJRNodiNEv888y-R_8w9DFz0ZxVJP0mhKw5c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
