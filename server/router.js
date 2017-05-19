const passport = require('passport');
const passportService = require('./services/passport');
const { Auth } = require('./controllers');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

module.exports = (app) => {
  app.get('/', requireAuth, (req, res) => {
    res.send({ message: 'Super secret code is ABC123' });
  });

  app.post('/signin', requireSignIn, Auth.signin);
  app.post('/signup', Auth.signup);
};