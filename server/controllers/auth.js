const jwt = require('jwt-simple');
const { User } = require('../models');
const config = require('../config');

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  // subject (sub) and issued at time (iat) jwt convention properties used
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

exports.signin = (req, res, next) => {
  // user has already had their email and password auth'd, just need a token
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = (req, res, next) => {
  const { email, password } = req.body;

  // return error: no email or password provided
  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password.' });
  }

  // tbd: return error: not a real e-mail address

  // tbd: return error: insufficient password

  // see if a user with the given email exists
  User.findOne({ email: email }, (err, existingUser) => {
    // return error: failed search
    if (err) return next(err);

    // return error: user already exists
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use.' });
    }

    // if a user with email does not exist, create and save user record
    const user = new User({ 
      email: email, 
      password: password 
    });

    user.save((err) => {
      // return error: DB error
      if (err) return next(err);

      // if no errors, respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
};