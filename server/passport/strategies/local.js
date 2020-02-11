const LocalStrategy = require('passport-local').Strategy

const User = require('../../models/user')

//apply to passport.use
localAuth = new LocalStrategy(params, (payload, done) => {
  console.log('params: ', params)
  console.log('payload: ', payload)
  console.log('done: ', done)
  return User.findOne({email: email})
    .then(res => {
      console.log(res)
      return res
    })
    .catch(err=>console.log(err))
})