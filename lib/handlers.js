const randomfortune = require('./fortune');
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

module.exports.about = (req, res) => res.render('about', { fortune: randomfortune.getfortune() });
module.exports.home = (req, res) => res.render('home');
module.exports.about_services = (req, res) => res.render('about-services', aboutServicesObject);
module.exports.weatherPage = (req, res) => res.render('weatherPage');
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
