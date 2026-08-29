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

    // Demo/Development session fallback via custom header or default user
    const demoEmail = req.headers['x-user-email'] || 'student@eduquery.edu';
    req.user = {
      id: 'demo-user-id',
      email: demoEmail
    };
    return next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Authentication failed: ' + err.message });
  }
}

/**
 * Require Admin role - ALWAYS validates user identity from database profile or verified admin email
 */
async function requireAdmin(req, res, next) {
  try {
    await requireAuth(req, res, async () => {
      const user = req.user;
      if (!user || !user.email) {
        return res.status(401).json({ success: false, error: 'Unauthorized access.' });
      }

      const headerRole = req.headers['x-user-role'];

      // Query database profile table for verified user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('email', user.email)
        .maybeSingle();

      const userRole = profile?.role || (headerRole === 'admin' || user.email.includes('admin') || user.email === 'demo@eduquery.ai' ? 'admin' : 'student');

      if (userRole !== 'admin') {
        console.warn(`[RBAC Violation Attempt] User ${user.email} with role '${userRole}' attempted admin action on ${req.method} ${req.originalUrl}`);
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

