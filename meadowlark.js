const path = require('path');
const fs = require('fs');
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const expressSession = require('express-session');
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;

const handler = require('./lib/handlers');
const weathermiddle = require('./lib/weather.js');
const flashmiddle = require('./lib/flash.js');
const credentials = require('./.credentials.development.json');
require('./db-mongo.js');
require('./db-postgres.js');

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

const redisClient = createClient({
  url: credentials.redis.url
});
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect()
  .then(() => { console.log('Connected to Redis Labs'); })
  .catch(console.error);

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
  secret: credentials.cookieSecret,
  store: new RedisStore({
    client: redisClient,
    url: credentials.redis.url,
    logErrors: true
  })
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
app.get('/vacations', handler.listVacations);
app.get('/notify-vacation-season', handler.notifyVacationSeason);
app.get('/set-currency/:currency', handler.setCurrency);

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
