module.exports = function(passport){
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  const FacebookStrategy = require('passport-facebook').Strategy;
  const TwitterStrategy = require('passport-twitter').Strategy;
  const User = require('../models/user.ts')
  //const chalk = require('chalk')

  let user = {}

  //USE FOR SESSION STORAGE
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
      console.log('user profile: ', profile)
      const user = User.findOne({id: profile.id}).then(user=>{ //TO-DO: use email on live
        if(user === null){
          //create
          return User.create({
            name: profile.displayName,
            [profile.provider]: profile.id,
            isActive: true
          }).then(user=>{
            console.log('user created: ', user)
            user.token = user.generateJWT()
            return user
          })
        }
        console.log()
        user.token = user.generateJWT()
        return user
      })
      .catch(err=>{
        console.log(err)
        return err
      })
      done(null, user)
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
      console.log('user profile: ', profile)
      
      const user = User.findOne({email: profile.emails[0].value}).then(user => {
        if(user === null) {
          console.log('user not found, creating new one')
          return User.create({
            email: profile.emails[0].value,
            name: profile.displayName,
            isActive: true,
            google: profile.id
          }).then(user => {
            console.log('user created: ', user)
            user.token = user.generateJWT()
            return user
          })
        }
      })
      .catch(err=> {
        console.log(err)
        return err
      })

      done(null, user)
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
