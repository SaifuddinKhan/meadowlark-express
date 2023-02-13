const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const port = process.env.PORT || 3000;

const handler = require('./lib/handlers');
const weathermiddle = require('./lib/weather.js');

const app = express();

app.disable('x-powered-by');

app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
}));

app.set('view engine', 'handlebars');

app.set('view cache', true);

app.use(express.static(path.join(__dirname, '/public')));

app.use(weathermiddle);

app.get('/', handler.home);

app.get('/about', handler.about);

app.get('/about/services', handler.about_services);

app.get('/headers', handler.headers);

app.get('/weather', handler.weatherPage);

app.use(handler.notfound);

app.use(handler.servererror);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`listening at ${port}`);
  });
} else {
  module.exports = app;
}
