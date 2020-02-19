module.exports = function(passport){
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  const FacebookStrategy = require('passport-facebook').Strategy;
  const TwitterStrategy = require('passport-twitter').Strategy;

  //const chalk = require('chalk')

  let user = {}

  passport.serializeUser((user, cb)=> {
    cb(null, user)
  })
  passport.deserializeUser((user, cb)=> {
    cb(null, user)
  })

  // FACEBOOK STRATEGY
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID || '',
      clientSecret: process.env.FB_APP_KEY || '',
      callbackURL: 'http://localhost:8080/auth/facebook/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile)
        const {id, displayName} = profile
      } catch (err) {
        done(err, null)
      }
    }
  ))

  //GOOGLE STRATEGY
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_APP_ID || '',
      clientSecret: process.env.GOOGLE_APP_KEY || '',
      callbackURL: 'http://localhost:8080/'
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log
      try {
        console.log(profile)
        const {id, displayName} = profile
      } catch (err) {
        done(err, null)
      }
    }
  ))

  //TWITTER STRATEGY
  //no keys yet
  // passport.use(new TwitterStrategy(
  //   {
  //     clientID: process.env.GOOGLE_APP_ID || '',
  //     clientSecret: process.env.GOOGLE_APP_KEY || '',
  //     callbackURL: '/auth/twitter/callback'
  //   },
  //   async (accessToken, refreshToken, profile, done) => {
  //     try {
  //       console.log(profile)
  //       const {id, displayName} = profile
  //     } catch (err) {
  //       done(err, null)
  //     }
  //   }
  // ))
}
