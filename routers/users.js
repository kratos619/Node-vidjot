const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load Idea Model
require('../models/Users');
const User = mongoose.model('users');

// userlogin
router.get('/login', (req, res) => {
  res.render('users/login');
});

//login

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
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
    //check for existing email addres
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        //if user is exist then flsh msg
        req.flash('error_msg', 'This Email Is Already Register');
        res.redirect('/users/register');
      } else {
        //else create new user
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            //if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
              req.flash('success_msg', 'Your Now Register Can Login');
              res.redirect('/users/login');
            });
          });
        });
      }
    });
  }
});

// logout users
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You Are Loggout');
  res.redirect('/users/login');
});

module.exports = router;
