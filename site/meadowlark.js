const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const port = process.env.PORT || 3000;

const randomfortune = require('./lib/fortune.js');
const app = express();

app.engine('handlebars', expressHandlebars.engine({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => res.render('home'));

app.get('/about', (req, res) => res.render('about', { fortune: randomfortune.getfortune }));

app.get('/about/services', (req, res) => res.render('about-services'));

app.get('/about/*', (req, res) => res.render('about-generic'));

app.use((req, res) => {
  res.type('text/plain');
  res.status = 404;
  res.send('404 - Not Found');
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.type('text/plain');
  res.status = 500;
  res.send('500 - Internal Error');
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
