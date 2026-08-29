const express = require('express');
const { supabase } = require('../services/supabaseService');

const router = express.Router();

/**
 * POST /api/auth/me
 * Retrieve or create profile record with role
 */
router.post('/me', async (req, res) => {
  try {
    const { email, full_name, role } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Check if profile exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) {
      return res.json({ success: true, profile: existing });
    }

    const crypto = require('crypto');
    const profileId = req.body.id || crypto.randomUUID();

    // Create profile
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: profileId,
          email,
          full_name: full_name || email.split('@')[0],
          role: role || 'student'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, profile: newProfile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
