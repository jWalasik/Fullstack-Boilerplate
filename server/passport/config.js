const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const FacebookStrategy = require('passport-facebook')
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const chalk = require('chalk')

let user = {}

passport.serializeUser((user, cb)=> {
  cb(null, user)
})
passport.deserializeUser((user, cb)=> {
  cb(null, user)
})

// FACEBOOK STRATEGY
passport.use(new FacebookStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_KEY,
  //callbackUrl: "/auth/facebook/callback"
},
(accessToken, refreshToken, profile, cb)=>{
  console.log(chalk.blue(JSON.stringify(profile)))
  user = {...profile}
}))
// passport.use(new FacebookTokenStrategy({
//   clientID: process.env.FB_APP_ID,
//   clientSecret: process.env.FB_APP_KEY
// }, function (accessToken, refreshToken, profile, done) {
//   // console.log('Facebook Strategy Callback')
//   // console.log('profile: ', profile) 
//   // console.log('done: ', done)
//   console.log(arguments)
//   let user = {
//     'email': profile.emails[0].value,
//     'name': profile.name.givenName + ' ' + profile.name.familyName,
//     'id': profile.id,
//     'token': accessToken
//   };
//   // You can perform any necessary actions with your user at this point,
//   // e.g. internal verification against a users table,
//   // creating new user entries, etc.

//   done(null, user); // the user object we just made gets passed to the route's controller as `req.user`
// }));

// GOOGLE STRATEGY
passport.use(new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_KEY,
}, function(accessToken, refreshToken, profile, done) {
  console.log(arguments)
  // console.log('Google Strategy Callback')
  // console.log('profile: ', profile) 
  // console.log('done: ', done)
  //profile.provider == 'google' if needed for unified fb/google auth
  let user = {
    'email': profile.emails[0].value,
    'name': profile.displayName,
    'id': profile.id,
    'token': accessToken
  };
  // You can perform any necessary actions with your user at this point,
  // e.g. internal verification against a users table,
  // creating new user entries, etc.

  done(null, user); // the user object we just made gets passed to the route's controller as `req.user`
}));

// promisified authenticate functions
const socialAuthentication = (provider, req, res) => {
  passport.authenticate(provider, {session: false}, (err, data, info) => {
    console.log(err, data, info)
  })(req, res)
}

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

module.exports = { authenticateFacebook, authenticateGoogle, socialAuthentication };