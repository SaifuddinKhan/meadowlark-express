const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
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
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(weathermiddle);

app.get('/', handler.home);
app.get('/about', handler.about);
app.get('/about/services', handler.aboutServices);
app.get('/custom', handler.custom);
app.get('/headers', handler.headers);
app.get('/newsletter-signup', handler.newsletterSignup);
app.get('/newsletter-signup-fetch', handler.newsletterSignupFetch);
app.get('/newsletter-signup-thankyou', handler.newsletterSignupThankyou);
app.get('/weather', handler.weatherPage);
app.get('/contest/vacation-photo', handler.vacationPhotoContest);

app.post('/newsletter-signup/process', handler.newsletterSignupProcess);
app.post('/api/newsletter-signup', handler.api.newsletterSignup);
app.post('/contest/vacation-photo/:year/:month', (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) res.status(500).send('Error occured: ' + err.message);
    console.log('got fields: ', fields);
    console.log('and files: ', files);
    handler.vacationPhotoContestProcess(req, res, fields, files);
  });
});

app.use(handler.notfound);
app.use(handler.servererror);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`listening at ${port}`);
  });
} else {
  module.exports = app;
}
