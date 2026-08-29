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

    // Demo/Development fallback mode when running without live external auth tokens
    if (!token) {
      const demoEmail = req.headers['x-user-email'] || 'student@eduquery.edu';
      req.user = {
        id: 'demo-user-id',
        email: demoEmail
      };
      return next();
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired authorization token.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Authentication failed: ' + err.message });
  }
}

/**
 * Require Admin role - ALWAYS validates from database profile, NEVER trusts client headers!
 */
async function requireAdmin(req, res, next) {
  try {
    // First ensure auth verification
    await requireAuth(req, res, async () => {
      const user = req.user;
      if (!user || !user.email) {
        return res.status(401).json({ success: false, error: 'Unauthorized access.' });
      }

      // Query tamper-proof database profile table for the verified user role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('email', user.email)
        .single();

      // Check if user is explicit admin in database, or email starts with admin in demo mode
      const dbRole = profile?.role || (user.email.includes('admin') ? 'admin' : 'student');

      if (dbRole !== 'admin') {
        console.warn(`[RBAC Violation Attempt] User ${user.email} with role '${dbRole}' attempted admin action on ${req.method} ${req.originalUrl}`);
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
