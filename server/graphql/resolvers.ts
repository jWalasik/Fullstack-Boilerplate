const User = require('../models/user.ts')
const bcrypt = require('bcrypt')
const FB = require('../services/facebook.ts')
const session = require('express-session')
const jwt = require('jsonwebtoken')

const facebook = new FB()

const resolvers = {
  Query: {
    currentUser: (parent, args, context) => context.user
  },

  Mutation: {
    signup: (_, args) => {
      return User.create(args)
      .then(user => {
        return user
      })
      .catch(err=>err)},

    login: (_, args, context) => {
      console.log('login context:', context.headers)
      return User
      .findOne({$or:[
        {email: args.user},
        {name: args.user}, //to-do: change argument to neutral
        
      ]}).then(async user => {
        const match = bcrypt.compareSync(args.password, user.password)
        if(!match){
          return new Error('Passwords not matching!')
        }
        //return JWT
        const tokens = await user.generateJWT()
        context.res.cookie('token', tokens.refreshToken, {
          httpOnly: true,
          maxAge: 1000*60*60*24*31
        })
        user.accessToken = tokens.accessToken
        return user
      })
      .catch(err=> {
        console.log(err)
        return err
      })
    },
    logout: (_, args, context) => {
      console.log('loggin out...')
      context.user = {}
      //if you want to prevent login with refresh token you need to blacklist it on User model
      context.logout()
    },
    changePassword: (_, args, context) => {
      console.log(args)
      return User.findOne({$or:[
        {email: args.user},
        {name: args.user}, //to-do: change argument to neutral
        
      ]}).then(user => {
        const match = bcrypt.compareSync(args.currentPass, user.password)
        if(match) {
          const newPassHashed = bcrypt.hashSync(this.password, 12)
          return user.update({password: newPassHashed})
        }
        if(!match) {
          console.log('Password not matching')
        }
      })
    },
    facebookSignIn: (_, args, context) => {
      return new Promise((resolve, reject) => {
        const {code} = args
        facebook.call('oauth/access_token', {code}).then(response => {
          const {access_token} = response
          facebook.call('me', {access_token}).then(response => {
            const {name, id, email} = response
            let tokens

            User.findOne({facebook: id}).then(async user => {
              if(user){
                tokens = await user.generateJWT()
                
                context.res.cookie('token', tokens.refreshToken, {
                  httpOnly: true,
                  maxAge: 1000*60*60*24*31
                })
                user.accessToken = tokens.accessToken
                resolve(
                  user
                )
              } else {
                facebook.call('oauth/access_token', {
                  grant_type: 'fb_exchange_token',
                  fb_exchange_token: access_token
                }).then(response => {
                  console.log('facebook response', response)
                  User.create({
                    facebook: id,
                    email: email? email : `${name}@placeholder.fb`,
                    name: name,
                    isActive: true
                  }).then(async user => {
                    tokens = await user.generateJWT()
                    context.res.cookie('token', tokens.refreshToken, {
                      httpOnly: true,
                      maxAge: 1000*60*60*24*31
                    })
                    user.accessToken = tokens.accessToken
                    resolve(
                      user
                    )
                  })
                })
              }
            })            
          })
        }).catch(e=>{
          console.log('resolver error:',e)
          resolve({error: e.toString()})
        })
      })
    },
    refreshToken: async (_,args, context) => {
      console.log('silent refresh')
      let {cookie} = context.headers
      if(!cookie) {
        console.log('no cookie for you')
        throw new Error('Refresh token invalid')}
      cookie = cookie.replace('token=', '')
      const timestamp = new Date().getTime()
      return jwt.verify(cookie, process.env.JWT_REFRESH_SECRET, (err, decoded)=>{
        if(err){
          console.log(err)
          return err
        }
        if(timestamp-decoded>=0){
          return new Error('Refresh token expired')
        }
        //get user and update tokens
        return User.findById(decoded.user.id)
          .then(async user=>{
             const tokens = await user.generateJWT()
             context.res.cookie('token', tokens.refreshToken, {
              httpOnly: true,
              maxAge: 1000*60*60*24*31
            })
             user.accessToken = tokens.accessToken
             return user
          })
          .catch(err=> err)
      })
    }
  }
}

//export default resolvers
module.exports = resolvers