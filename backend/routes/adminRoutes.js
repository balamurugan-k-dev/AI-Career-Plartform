const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// GET /dashboard - Protected admin dashboard route
router.get('/dashboard', authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Admin dashboard access successful',
    user: req.user
  });
});

module.exports = router;