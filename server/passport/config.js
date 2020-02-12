const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

// FACEBOOK STRATEGY
passport.use(new FacebookTokenStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_KEY
}, function (accessToken, refreshToken, profile, done) {
    console.log('Facebook Strategy Callback')
    console.log('profile: ', profile) 
    console.log('done: ', done)  
  let user = {
    'email': profile.emails[0].value,
    'name': profile.name.givenName + ' ' + profile.name.familyName,
    'id': profile.id,
    'token': accessToken
  };
  // You can perform any necessary actions with your user at this point,
  // e.g. internal verification against a users table,
  // creating new user entries, etc.

  done(null, user); // the user object we just made gets passed to the route's controller as `req.user`
}));

// GOOGLE STRATEGY
passport.use(new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_KEY,
}, function(accessToken, refreshToken, profile, done) {
  let user = {
    'email': profile
  }

  return done(null, user)
}));

// promisified authenticate functions
const authenticateFacebook = (req, res) => new Promise((resolve, reject) => {
    //calling facebook strategy
    passport.authenticate('facebook-token', { session: false }, (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
    })(req, res);
});

const authenticateGoogle = (req, res) => new Promise((resolve, reject) => {
    passport.authenticate('google-token', { session: false }, (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
    })(req, res);
});

module.exports = { authenticateFacebook, authenticateGoogle };