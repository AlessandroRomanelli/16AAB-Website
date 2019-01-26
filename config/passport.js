const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = mongoose.model('User');


passport.use(new LocalStrategy(
  ((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return bcrypt.compare(password, user.password).then((validPassword) => {
        if (!validPassword) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
  }),
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
