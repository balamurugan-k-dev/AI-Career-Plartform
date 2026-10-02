const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// POST /signup - Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email, and password.'
      });
    }

    // 2. Check if user already exists with the provided email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User with this email already exists.'
      });
    }

    // 3. Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create a new User instance (role defaults to 'USER' via User schema)
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // 5. Save the user to MongoDB
    await newUser.save();

    // 6. Return success response with safe user info (excluding password)
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({
      message: 'Server error during signup',
      error: error.message
    });
  }
});

// POST /login - Authenticate user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password.'
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    // 3. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    // 4. Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    // 5. Return success response with safe user details (excluding password)
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      message: 'Server error during login',
      error: error.message
    });
  }
});

module.exports = router;