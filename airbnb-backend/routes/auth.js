const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Makes a token that holds the user's id and lasts 7 days
const makeToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Sends the token and the user details that the frontend needs
const sendAuthResponse = (res, statusCode, user) => {
  res.status(statusCode).json({
    token: makeToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// Simple check that an email looks like name@site.com
const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // All three fields must be sent
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  // The email must look real
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  // The password must be at least 6 characters
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Stop if someone already registered with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // Hash the password so the real one is never saved
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new user and log them in straight away
    const user = await User.create({ name, email, password: hashedPassword });
    sendAuthResponse(res, 201, user);
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// Log a user in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Both fields must be sent
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // The password is hidden by default, so ask for it here
    const user = await User.findOne({ email }).select('+password');

    // Same message for a wrong email or a wrong password, so nobody can guess which one was right
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compares the typed password with the saved hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    sendAuthResponse(res, 200, user);
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

module.exports = router;