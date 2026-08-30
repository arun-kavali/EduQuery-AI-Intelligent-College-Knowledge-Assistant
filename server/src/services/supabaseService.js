const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured for the backend.');
}

// Legacy Supabase service keys are JWTs. Reject an anon key explicitly so the
// server cannot appear healthy while all privileged backend operations fail.
if (supabaseKey.split('.').length === 3) {
  try {
    const payload = JSON.parse(Buffer.from(supabaseKey.split('.')[1], 'base64url').toString('utf8'));
    if (payload.role !== 'service_role') {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not a service_role key.');
    }
  } catch (error) {
    if (error.message.includes('not a service_role')) throw error;
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is invalid.');
  }
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase, supabaseClient: supabase };
