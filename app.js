const express = require('express');
const exphbs = require('express-handlebars');
// add mongoose connect to db
const mongodb = require('mongoose');

const app = express();
//map global promis - get rid of warning
mongodb.Promise = global.Promise;
// connect to mongoose
mongodb
  .connect(
    'mongodb://localhost/vidjot-dev',
    {
      useMongoClient: true
    }
  )
  .then(() => {
    console.log('mogodb_connect');
  })
  .catch(err => {
    console.log(err);
  });

// Load Idea Model
require('./models/Idea');
const idea = mongodb.model('idea');

//handleBar js middle wares
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// routes Inex
app.get('/', (request, response) => {
  let title = 'index';
  response.render('index', {
    title: title
  });
});

// about route
app.get('/about', (request, response) => {
  response.render('about');
});

//add ideas router
app.get('/idea/add', (request, response) => {
  response.render('idea/add');
});

const port = 4000;

app.listen();

app.listen(port, () => {
  console.log(`hello world poer ${port}`);
});
