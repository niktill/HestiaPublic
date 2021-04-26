const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

const authenticateUser = async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return done(null, user);
    }
    return done(null, false, { message: 'Incorrect email or password' });
  } catch (error) {
    return done(error);
  }
};

passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId).then((user) => {
    done(null, user);
  });
});
