const express = require('express');
const { supabase } = require('../services/supabaseService');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Profiles are created exclusively by the database auth.users trigger.
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, avatar_url, created_at, updated_at')
      .eq('id', req.user.id)
      .single();
    if (error) throw error;
    res.json({ success: true, profile });
  } catch (err) {
    res.status(404).json({ success: false, error: 'Profile not found for authenticated user.' });
  }
});

module.exports = router;
