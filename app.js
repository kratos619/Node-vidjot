const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var methodOverride = require('method-override');
const passport = require('passport');
const ideas = require('./routers/ideas');
const users = require('./routers/users');

//passport config
require('./config/passport')(passport);

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
//passport middlewares

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// global variables

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
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

const port = 5000;

//use ideas routes
app.use('/ideas', ideas);
app.use('/users', users);
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
