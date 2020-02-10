const LocalStrategy = require('passport-local').Strategy,
      TwitterStrategy = require('passport-twitter').Strategy,
      GoogleStrategy = require('passport-google').Strategy,
      FacebookStratey = require('passport-facebook').Strategy;


passport.use(new passportLocalStrategy(
  function(username, password, done) {
    let validator = {}

    if(username.indexOf('@') === -1){
      validator.username = username
    }
    else {
      validator.email = username
    }

    app.db.models.User.findOne(validator, (err, user)=>{
      if(err) return done(err)

      if(!user) return done(null, false, {message: 'Invalid Credentials'})

      const encryptedPassword = app.db.models.User.hashPassword(password)

      if(user.password != encryptedPassword){
        return done(null, false, {message: 'Invalid Password'})
      }

      return done(null, user)
    })
  }
))