// RBAC middleware for Express

// Usage: app.use('/api/v1/some-route', requireRole('admin'))
// or:   app.use('/api/v1/some-route', requirePrivilege('manage_users'))

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const userRoles = req.user.roles.map(r => (typeof r === 'string' ? r : r.name));
    if (roles.some(role => userRoles.includes(role))) {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
  };
}

function requirePrivilege(...privileges) {
  return (req, res, next) => {
    if (!req.user || !req.user.privileges) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const userPrivileges = req.user.privileges.map(p => (typeof p === 'string' ? p : p.name));
    if (privileges.some(priv => userPrivileges.includes(priv))) {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden: insufficient privilege' });
  };
}

module.exports = { requireRole, requirePrivilege }; 