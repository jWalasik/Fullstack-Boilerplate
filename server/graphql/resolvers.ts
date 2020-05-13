const User = require('../models/user.ts')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const FB = require('../services/facebook.ts')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const mailgun = require('mailgun-js')({ apiKey: process.env.MAILER_KEY, domain: 'sandbox773303c5f0da4b93ad2563baac3727a8.mailgun.org' });
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
      .catch(err=>err)
    },
    resetPassword: (_, args, context) => {
      console.log('reset')
      return User.findOne({email: args.email}).then(user=>{
        if(!user) return 'No account with that email found.'
        return crypto.randomBytes(32, (err, buffer) => {
          const token = buffer.toString('hex')
          if(err) throw err
          user.resetToken = token
          user.resetTokenExp = Date.now() + 3600000
          return user.update({
            resetToken: token,
            resetTokenExp: Date.now() + 3600000
          }).then(()=>{
            console.log(args.email)
            const message = {
              from: `jacekwalasik89@gmail.com`,
              to: args.email,
              subject: `Password reset request`,
              text: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:8080/reset${token}">link</a> to set a new password.</p>
              `
            }
            mailgun.messages().send(message, function (error, body) {
              console.log(body);
              if(error) throw error
            })
          })          
        })
        
      })
      .then(()=> {
        console.log('success')
        return 'Password reset email was sent, it should arrive shortly. Make sure to check spam folder.'
      })
      .catch(err=>err)
    },
    newPassword: (_, args, context) => {
      const {newPassword, resetToken} = args
      return User.findOne({resetToken: resetToken}).then(user=>{
        if(user.resetTokenExp < Date.now()) {
          return 'Reset token has expired!'
        }
        user.password = newPassword
        user.save() // save automaticly hashes password
        return 'Succesfully set up new password'
      })
    },
    login: (_, args, context) => {
      return User
      .findOne({$or:[
        {email: args.user},
        {name: args.user}, //to-do: change argument to neutral
        //$2b$12$ENPc40c6SfkGQNKh.ZETg.PZX.9r0hdEgcLRrhayRHopHTTn.WRjy
        
      ]}).then(async user => {
        console.log('user',user)
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
      const token = context.headers.authorization.split(' ')[1]
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded)=>{
        return User.findById(decoded.user.id).then(user => {
          console.log(user)
          if(!user.password){ //users created through external auth services have no password specified, this lets them add one
            const newPassHashed = bcrypt.hashSync(args.newPass, 12)
            user.password = newPassHashed
            user.save()
            return 'Password has been updated'
          }
          const match = bcrypt.compareSync(args.currentPass, user.password)
          if(match) {
            console.log('password matching')
            const newPassHashed = bcrypt.hashSync(args.newPass, 12)
            user.update({password: newPassHashed})
            return 'Password has been updated'
          }
          if(!match) {
            return 'Password not matching'
          }
        })
      })
    },
    googleSignIn: (_, args, context) => {
      return new Promise((resolve, reject)=>{
        console.log(args)
        const {code} = args
        
      })
    },
    facebookSignIn: (_, args, context) => {
      console.log('fb sign in')
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