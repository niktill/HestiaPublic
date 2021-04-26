let keys;
if (process.env.NODE_ENV === 'production') {
  // production keys
  keys = {
    mongoURI: process.env.MONGO_URI,
    sessionSecret: process.env.SESSION_SECRET,
  };
} else {
  // ci keys and loval keys
  keys = {
    mongoURI: 'mongodb://localhost:27017/Hestia',
    sessionSecret: 'devdumbsecret',
  };
}
module.exports = keys;
