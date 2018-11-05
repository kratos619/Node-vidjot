const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// userlogin
router.get('/login', (req, res) => {
  res.render('users/login');
});

// user Register
router.get('/register', (req, res) => {
  res.render('users/register');
});

// user post routers
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({
      text: 'password Do Not Match..'
    });
  }

  if (req.body.password.length < 4) {
    errors.push({
      text: 'Password Lenght Shuld be More than 4 '
    });
  }

  if (!req.body.password) {
    errors.push({ text: 'Password Can Not Be Blank ' });
  }
  if (!req.body.password2) {
    errors.push({ text: 'Confirm Password Can Not Be Blank ' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    res.send('passed');
  }
});

module.exports = router;
