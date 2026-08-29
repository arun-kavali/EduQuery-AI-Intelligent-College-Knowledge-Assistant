const express = require('express');
const { supabase } = require('../services/supabaseService');

const router = express.Router();

/**
 * POST /api/auth/me
 * Retrieve or create profile record using authenticated user ID
 */
router.post('/me', async (req, res) => {
  try {
    const { id, email, full_name, role } = req.body;
    if (!email && !id) {
      return res.status(400).json({ success: false, error: 'Email or User ID is required' });
    }

    let profile = null;

    // 1. Primary lookup by user UUID (id = auth.users.id)
    if (id) {
      const { data: byId } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      profile = byId;
    }

    // 2. Fallback lookup by email
    if (!profile && email) {
      const { data: byEmail } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      profile = byEmail;
    }

    if (profile) {
      return res.json({ success: true, profile });
    }

    // 3. Create or repair profile record
    const profileId = id || req.body.id || require('crypto').randomUUID();
    const defaultRole = (email && email.includes('admin')) ? 'admin' : (role || 'student');

    const { data: newProfile, error } = await supabase
      .from('profiles')
      .upsert([
        {
          id: profileId,
          email: email || `user_${profileId.slice(0, 8)}@university.edu`,
          full_name: full_name || (email ? email.split('@')[0] : 'User'),
          role: defaultRole
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    res.json({ success: true, profile: newProfile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
