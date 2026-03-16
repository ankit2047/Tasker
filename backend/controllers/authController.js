
// Handles user registration and login logic

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Creates a signed JWT token valid for 7 days
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ─── POST /api/auth/registe
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if a user with this email already exists in Atlas
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create new user — password hashing happens in the pre-save hook (User model)
    const user = await User.create({ email, password });

    // Return the new user with a JWT token
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ─── POST /api/auth/login ───
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in Atlas by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Use a generic message to prevent email enumeration attacks
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare provided password with stored bcrypt hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return user info + JWT token on successful login
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { register, login };
