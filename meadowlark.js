const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const port = process.env.PORT || 3000;

console.log(`The port selected inside meadowlark.js is ${port}`);

const handler = require('./lib/handlers');
const app = express();

app.engine('handlebars', expressHandlebars.engine({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', handler.home);

app.get('/about', handler.about);

app.get('/about/services', handler.about_services);

app.get('/about/*', handler.about_generic);

app.use(handler.notfound);

app.use(handler.servererror);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`listening at ${port}`);
  });
} else {
  module.exports = app;
}
