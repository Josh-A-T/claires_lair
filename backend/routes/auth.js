////////////////////////////////////////////////////////////////////////////
// Endpoint routes for authorization including registering new users and logging in
// POST /register - create new users and check if the username is unique, throw error if its not
// POST /login
// GET /me - get current user details
////////////////////////////////////////////////////////////////////////////

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { username, password } = req.body;

    const usernameTaken = await User.isUsernameTaken(username);
    if (usernameTaken) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const user = await User.create(username, password);

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        is_admin: user.is_admin,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        is_admin: user.is_admin,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      user: {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin, 
        created_at: user.created_at
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});



module.exports = router;