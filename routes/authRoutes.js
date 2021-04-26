const passport = require('passport');
const { checkNotAuth, checkAuth } = require('../middleware/auth');

const User = require('../models/User');

module.exports = (app) => {
  // create new user and login if successful
  app.post('/auth/users', async (req, res, next) => {
    try {
      const user = new User(req.body);
      await user.save();
      await req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    } catch (err) {
      // create user not successful
      if (err.code === 11000) {
        return res
          .status(400)
          .send({ message: 'User with this email already exists' });
      }
      return res.status(400).send(err);
    }
  });

  // login
  app.post('/auth/login', checkNotAuth, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send(info);
      }
      req.logIn(user, (error) => {
        if (error) {
          return next(error);
        }
        return res.redirect('/');
      });
    })(req, res, next);
  });

  // logout
  app.post('/auth/logout', checkAuth, async (req, res) => {
    req.logOut();
    return res.redirect('/login');
  });

  // get own profile
  app.get('/auth/users/me', async (req, res) => {
    res.send(req.user);
  });

  // update email address
  app.patch('/auth/users/me/email', checkAuth, async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          email,
        },
        { new: true }
      );
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .send({ message: 'User with this email already exists' });
      }
      next(error);
    }
  });

  // update password
  app.patch('/auth/users/me/password', checkAuth, (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send(info);
      }
      try {
        const newUser = user;
        newUser.password = req.body.newPassword;
        await newUser.save();
        return res.status(200).send(newUser);
      } catch (error) {
        res.status(400).send(error);
      }
    })(req, res, next);
  });

  // turn on or off email notifiaction settings
  app.patch(
    '/auth/users/me/email/notifications',
    checkAuth,
    async (req, res, next) => {
      try {
        const { toggle } = req.body;
        let user;
        if (toggle === false) {
          user = await User.findByIdAndUpdate(
            req.user.id,
            {
              emailNotifications: false,
            },
            { new: true }
          );
        } else {
          user = await User.findByIdAndUpdate(
            req.user.id,
            {
              emailNotifications: true,
            },
            { new: true }
          );
        }
        if (!user) {
          return res.status(400).send({ message: 'User not found' });
        }
        return res.status(200).send(user);
      } catch (error) {
        next(error);
      }
    }
  );
};
