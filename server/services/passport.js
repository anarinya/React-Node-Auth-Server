const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const { User } = require('../models');
const config = require('../config');

// setup options for local strategy
const localOptions = { usernameField: 'email' };

// create local strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) return done(err);

    // if email not found, call done with false
    if (!user) return done(null, false);

    // if email found, check for correct password
    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(`comparePassword: ${err}`);
      if (!isMatch) return done(null, false);
      return done(null, user);
    });
  });
});

// setup options for jwt strategy
const jwtOptions = {
  // when a request comes in that we want passport to handle, look for auth header
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // include encryption secret
  secretOrKey: config.secret
};

// create jwt strategy
// payload: decoded jwt token
const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
  // see if the user id in the payload exists in the db
  User.findById(payload.sub, (err, user) => {
    // if there's an error, return the error with no user object
    if (err) return done(err, false);

    // if a user was found, return it
    if (user) return done(null, user);

    // if a user wasn't found, return with no user object
    return done(null, false);
  });
});

// tell passport to use the strategy
passport.use(jwtLogin);
passport.use(localLogin);