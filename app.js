const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

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

const port = 4000;

app.listen();

app.listen(port, () => {
  console.log(`hello world poer ${port}`);
});
