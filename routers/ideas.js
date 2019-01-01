const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//authentication accessmodifires
const { ensureAuthenticated } = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({
    //only user who create his vido idea can see his ideas
    user: req.user.id
  })
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

//edit  Idea Form
// router.get('/ideas/edit/:id', (req, res) => {
//   Idea.findOne({
//     _id: req.param.id
//   }).then(idea => {
//     res.render('ideas/edit', {
//       idea: idea
//     });
//   });
// });

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea: idea
      });
    }
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: 'Please add a title'
    });
  }
  if (!req.body.details) {
    errors.push({
      text: 'Please add some details'
    });
  }

  if (errors.length > 0) {
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    //create new idea to db
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      //logged in user
      user: req.user.id
    };
    new Idea(newUser).save().then(idea => {
      req.flash('success_msg', 'Content Added Successfully ');
      res.redirect('/ideas');
    });
  }
});

//update form frocess

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      req.flash('success_msg', 'Content Update Successfully ');
      res.redirect('/ideas');
    });
  });
});

//delete ideas

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Content Delete Successfully ');
    res.redirect('/ideas');
  });
});

module.exports = router;
