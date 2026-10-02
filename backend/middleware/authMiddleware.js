const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Read the Authorization header
  const authHeader = req.headers.authorization;

  // 2. Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Access token is required'
    });
  }

  // 3. Extract token from 'Bearer <token>'
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Access token is required'
    });
  }

  // 4. Verify token using JWT_SECRET
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. Attach decoded payload to req.user
    req.user = decoded;
    
    // 6. Pass control to the next route handler
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;