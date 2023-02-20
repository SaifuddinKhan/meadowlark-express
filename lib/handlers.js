const randomfortune = require('./fortune');
const VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const aboutServicesObject = {
  currency: {
    name: 'United States dollars',
    abbrev: 'USD'
  },
  tours: [
    { name: 'Hood River', price: '$99.95' },
    { name: 'Oregon Coast', price: '$159.95' },
    { name: 'Illinois blast' }
  ],
  specialsUrl: '/january-specials',
  currencies: ['USD', 'GBP', 'BTC']
};

class NewsLetterSignup {
  constructor ({ name, email }) {
    this.name = name;
    this.email = email;
  }

  async save () {

  };
}

module.exports.about = (req, res) => res.render('about', { fortune: randomfortune.getfortune() });

module.exports.aboutServices = (req, res) => res.render('aboutServices', aboutServicesObject);

module.exports.weatherPage = (req, res) => res.render('weatherPage');

module.exports.custom = (req, res) => res.render('custom');

module.exports.home = (req, res) => res.render('home');

module.exports.vacationPhotoContest = (req, res) => {
  const now = new Date();
  res.render('photoUpload', { year: now.getFullYear(), month: now.getMonth() });
};
module.exports.vacationPhotoContestFetch = (req, res) => {
  const now = new Date();
  res.render('photoUploadFetch', { year: now.getFullYear(), month: now.getMonth() });
};
module.exports.newsletterSignup = (req, res) => res.render('newsletterSignup', { csrf: 'CSRF token goes here' });
module.exports.newsletterSignupFetch = (req, res) => res.render('newsletterSignupFetch', { csrf: 'CSRF token goes here' });
module.exports.newsletterSignupThankyou = (req, res) => res.render('newsletterSignupThankyou');

module.exports.headers = (req, res) => {
  const headerlist = Object.entries(req.headers).map(([key, value]) => `key:${key} value:${value}`);
  console.log(`navigated to headers, headerslist:${headerlist.join('\n')}`);
  res.render('headers', { headers: headerlist.join('\n') });
};

module.exports.notfound = (req, res) => {
  res.type('text/plain');
  res.status = 404;
  res.send('404 - Not Found');
};

module.exports.servererror = (err, req, res, next) => {
  console.error(err.message);
  res.type('text/plain');
  res.status = 500;
  res.send('500 - Internal Error');
};

module.exports.api = {};

module.exports.api.newsletterSignup = (req, res) => {
  console.log(`CSRF Token received: ${req.body._csrf}`);
  if (req.body.name) console.log(`name received: ${req.body.name}`);
  console.log(`Email Received: ${req.body.email}`);
  res.send({ result: 'success' });
};

module.exports.api.vacationPhotoContestProcess = (req, res, fields, files) => {
  console.log('got fields: ', fields);
  console.log('and files: ', files);
  res.send({ result: 'success' });
};

module.exports.newsletterSignupProcess = (req, res) => {
  const name = req.body.name || '';
  const email = req.body.email || '';

  if (!VALID_EMAIL_REGEX.test(email)) {
    req.session.flash = {
      type: 'danger',
      intro: 'Validation error!',
      message: 'Entered Email address is not valid'
    };
    return res.render(303, '/newsletter-signup');
  }
  const userinfo = new NewsLetterSignup({ name, email });
  userinfo.save()
    .then(() => {
      req.session.flash = {
        type: 'info',
        intro: 'Thank you!',
        message: 'You were successfully signed up!'
      };
      return res.redirect(303, '/');
    })
    .catch((err) => {
      req.session.flash = {
        type: 'danger',
        intro: `Database error: ${err.message}`,
        message: 'We failed to save your submission. <a href="/newsletter-signup">Please try again</a>'
      };
      return res.redirect(303, '/newsletter-signup');
    });
};

module.exports.vacationPhotoContestProcess = (req, res, fields, files) => {
  console.log('got fields: ', fields);
  console.log('and files: ', files);
  res.redirect(303, '/newsletter-signup-thankyou');
};
