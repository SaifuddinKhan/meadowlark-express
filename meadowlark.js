const path = require('path');
const fs = require('fs');
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const morgan = require('morgan');

const handler = require('./lib/handlers');
const weathermiddle = require('./lib/weather.js');
const flashmiddle = require('./lib/flash.js');
const { credentials } = require('./config.js');
require('./db.js');

const port = process.env.PORT || 3000;

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

switch (app.get('env')) {
  case 'development':
  {
    app.use(morgan('dev'));
    break;
  }

  case 'production':
  {
    const stream = fs.createWriteStream(path.join(__dirname, '/access.log'), { flags: 'a' });
    app.use(morgan('combined', { stream }));
    break;
  }
}
app.use(express.static(path.join(__dirname, '/public')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret
}));
app.use(weathermiddle);
app.use(flashmiddle);

app.get('/', handler.home);
app.get('/about', handler.about);
app.get('/about/services', handler.aboutServices);
app.get('/custom', handler.custom);
app.get('/headers', handler.headers);
app.get('/fail', (req, res) => {
  process.nextTick(() => {
    throw new Error('Test error');
  });
});
app.get('/newsletter-signup', handler.newsletterSignup);
app.get('/newsletter-signup-fetch', handler.newsletterSignupFetch);
app.get('/newsletter-signup-thankyou', handler.newsletterSignupThankyou);
app.get('/weather', handler.weatherPage);
app.get('/contest/vacation-photo', handler.vacationPhotoContest);
app.get('/contest/vacation-photo-fetch', handler.vacationPhotoContestFetch);
app.get('/vacations', handler.vacationList);
app.get('/notify-vacation-season', handler.notifyVacationSeason);

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
app.post('/api/vacation-photo', (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) res.status(500).send('Error occured: ' + err.message);
    console.log('got fields: ', fields);
    console.log('and files: ', files);
    handler.api.vacationPhotoContestProcess(req, res, fields, files);
  });
});
app.post('/notify-vacation-season-process', handler.api.notifyVacationSeasonProcess);

app.use(handler.notfound);
app.use(handler.servererror);

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception occurred.\n', err.stack);
  process.exit(1);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Started in environment: ${app.get('env')}, listening at ${port}`);
  });
} else {
  module.exports = app;
}
