module.exports = function(passport){
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  const FacebookStrategy = require('passport-facebook').Strategy;
  const TwitterStrategy = require('passport-twitter').Strategy;
  const User = require('../models/user.ts')

  //USE FOR SESSION STORAGE
  passport.serializeUser((user, cb)=> {
    cb(null, user)
  })
  passport.deserializeUser((user, cb)=> {
    User.findOne({_id: user._id}).then(user=> {
      cb(null, user)
    })
  })

  // FACEBOOK STRATEGY
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID || '',
      clientSecret: process.env.FB_APP_KEY || '',
      callbackURL: 'http://localhost:8080/auth/facebook/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      processProfile(profile, done)
    }
  ))

  //GOOGLE STRATEGY
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_APP_ID || '',
      clientSecret: process.env.GOOGLE_APP_KEY || '',
      callbackURL: 'http://localhost:8080/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      processProfile(profile, done)
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
  //     processProfile(profile, done)
  //   }
  // ))

    const processProfile = async (profile, done) => {
      try {
        const { id, displayName, emails, provider} = profile
        const existingUser = await User.findOne({$or:[
          {[provider]: id},
          {email: emails[0].value}
        ]}).lean()
          
        if(existingUser) return done(null, existingUser)
        const newUser = await User.create({
          [provider]: id,
          email: emails ? emails[0].value : 'placeholder@mail.com',
          name: displayName,
          isActive: true
        })
        done(null, newUser)
      } catch (err) {
        done(err, null)
      }  
    }
}
