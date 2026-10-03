const adminMiddleware = (req, res, next) => {
  // 1. Verify if user is attached to request and has the ADMIN role
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      message: 'Admin access required'
    });
  }

  // 2. User is an admin, proceed to the route handler
  next();
};

module.exports = adminMiddleware;