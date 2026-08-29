const { supabase } = require('../services/supabaseService');

/**
 * Require valid authenticated user session token (Bearer token)
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'];
    }

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = user;
        return next();
      }
    }

    // Reject unauthenticated requests
    return res.status(401).json({
      success: false,
      error: 'Authentication Required: Please log in with valid credentials.'
    });
  } catch (err) {
    res.status(401).json({ success: false, error: 'Authentication failed: ' + err.message });
  }
}

/**
 * Require Admin role - STRICTLY verifies role from database public.profiles table
 */
async function requireAdmin(req, res, next) {
  try {
    await requireAuth(req, res, async () => {
      const user = req.user;
      if (!user || !user.id) {
        return res.status(401).json({ success: false, error: 'Unauthorized access.' });
      }

      // Query database profile table for verified user role by authenticated user ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', user.id)
        .maybeSingle();

      const userRole = profile?.role;

      if (userRole !== 'admin') {
        console.warn(`[RBAC Violation Attempt] User ${user.email} (id: ${user.id}) with role '${userRole}' attempted admin action on ${req.method} ${req.originalUrl}`);
        return res.status(403).json({
          success: false,
          error: 'Access Denied: Admin privileges are required to perform this action.'
        });
      }

      req.userRole = 'admin';
      next();
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Authorization error: ' + err.message });
  }
}

module.exports = { requireAuth, requireAdmin };
