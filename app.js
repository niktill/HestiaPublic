const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const keys = require('./config/keys.js');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

// production config for Sentry
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn:
      'https://f1eef8dbfd6e4591b4eaf52785c2e472@o358880.ingest.sentry.io/5603803',
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
}

app.use(bodyParser.json());
app.use(
  session({
    secret: keys.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
require('./routes/authRoutes')(app);
require('./routes/athleteRoutes')(app);

// production config for Sentry and public files
if (process.env.NODE_ENV === 'production') {
  // Sentry
  // Sentry test route for production
  app.get('/test/debug-sentry', () => {
    throw new Error('Sentry test error!');
  });
  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());
  // Optional fallthrough error handler
  app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(`${res.sentry}\n`);
  });

  // serve production assets
  app.use(express.static('client/build'));
  // serve index.html if route not recognized
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = app;
