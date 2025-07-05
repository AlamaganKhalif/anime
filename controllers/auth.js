const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Sign-up Form
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up', { error: null });
});

// Sign-in Form
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in', { error: null });
});

// Sign-out
router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Sign-up Submission
router.post('/sign-up', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;
    
    // Validation
    if (password !== confirmPassword) {
      return res.render('auth/sign-up', { 
        error: 'Password and Confirm Password must match' 
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('auth/sign-up', { 
        error: 'Username already taken' 
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 12);
    const newUser = await User.create({ 
      username, 
      password: hashedPassword 
    });

    req.session.user = {
      username: newUser.username,
      _id: newUser._id
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.render('auth/sign-up', { 
      error: 'An error occurred during registration' 
    });
  }
});

// Sign-in Submission
router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.render('auth/sign-in', { 
        error: 'Invalid username or password' 
      });
    }

    req.session.user = {
      username: user.username,
      _id: user._id
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.render('auth/sign-in', { 
      error: 'An error occurred during login' 
    });
  }
});

module.exports = router;






























