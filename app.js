const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var methodOverride = require('method-override');

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose
  .connect(
    'mongodb://localhost/vidjot-dev',
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
// sessio middleware
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  })
);
app.use(flash());

// global variables

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
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
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//edit  Idea Form
// app.get('/ideas/edit/:id', (req, res) => {
//   Idea.findOne({
//     _id: req.param.id
//   }).then(idea => {
//     res.render('ideas/edit', {
//       idea: idea
//     });
//   });
// });

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  });
});

// Process Form
app.post('/ideas', (req, res) => {
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
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser).save().then(idea => {
      res.redirect('/ideas');
    });
  }
});

//update form frocess

app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      res.redirect('/ideas');
    });
  });
});

//delete ideas

app.delete('/ideas/:id', (req, res) => {
  Idea.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect('/ideas');
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
