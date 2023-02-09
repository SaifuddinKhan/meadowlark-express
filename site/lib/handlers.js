const randomfortune = require('./fortune');

module.exports.about = (req, res) => res.render('about', { fortune: randomfortune.getfortune() });
module.exports.home = (req, res) => res.render('home');
module.exports.about_services = (req, res) => res.render('about-services');
module.exports.about_generic = (req, res) => res.render('about-generic');
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
