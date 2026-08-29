const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://kwocboobfocgrkhndtun.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3b2Nib29iZm9jZ3JraG5kdHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5ODIxMTQsImV4cCI6MjEwMzU1ODExNH0.v_sNOfTiJRNodiNEv888y-R_8w9DFz0ZxVJP0mhKw5c';

// Direct Real Supabase Client connected to project kwocboobfocgrkhndtun
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase, supabaseClient: supabase };
