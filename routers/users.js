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

module.exports = router;
