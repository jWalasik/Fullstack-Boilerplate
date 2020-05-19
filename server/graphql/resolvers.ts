const User = require('../models/user.ts')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const FB = require('../services/facebook.ts')
const GoogleAuth = require('../services/google.ts')
const jwt = require('jsonwebtoken')
const mailgun = require('mailgun-js')({ apiKey: process.env.MAILER_KEY, domain: 'sandbox773303c5f0da4b93ad2563baac3727a8.mailgun.org' });

const facebook = new FB()
const google = new GoogleAuth()

const resolvers = {
  Query: {
    currentUser: (parent, args, context) => context.user
  },

  Mutation: {
    signup: (_, args) => {
      console.log(args)
      return User.create(args)
      .then(user => {
        return {type: 'Success', text: 'Successfuly registered new user'}
      })
      .catch(err=>{
        console.log(err)
        if(err.code === 11000) throw new Error('Entered email is already registered')
        throw err
      })
    },
    resetPassword: (_, args, context) => {
      return User.findOne({email: args.email}).then(user=>{
        if(!user) throw new Error('Entered email is not registered')

        return crypto.randomBytes(32, (err, buffer) => {
          const token = buffer.toString('hex')
          if(err) throw err
          user.resetToken = token
          user.resetTokenExp = Date.now() + 3600000
          return user.update({
            resetToken: token,
            resetTokenExp: Date.now() + 3600000
          }).then(()=>{
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
              if(error) throw error
            })
          })          
        })
        
      })
      .then(()=> {
        return {type: 'Success', text: 'Password reset email was sent, it should arrive shortly. Make sure to check spam folder.'}
      })
      .catch(err=>err)
    },
    setPassword: (_, args, context) => {
      const {newPassword, resetToken} = args
      return User.findOne({resetToken: resetToken}).then(user=>{
        if(user.resetTokenExp < Date.now()) {
          return 'Reset token has expired!'
        }
        user.password = newPassword
        user.save() // save automaticly hashes password
        return {
          type: 'Success',
          text: 'Succesfully set up new password'}
      })
    },
    login: (_, args, context) => {
      return User
      .findOne({$or:[
        {email: args.user},
        {name: args.user}        
      ]}).then(async user => {
        if(!user) throw new Error('User not found')
        const match = bcrypt.compareSync(args.password, user.password)
        if(!match) throw new Error('Invalid password')

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
        return err
      })
    },
    logout: (_, args, context) => {
      context.user = {}
      //if you want to prevent login with refresh token you need to implement token blacklisting logic
      context.logout()
    },
    changePassword: (_, args, context) => {
      const token = context.headers.authorization.split(' ')[1]
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded)=>{
        return User.findById(decoded.user.id).then(user => {
          if(!user.password){ //users created through external auth services have no password specified, this lets them add one
            const newPassHashed = bcrypt.hashSync(args.newPass, 12)
            user.password = newPassHashed
            user.save()
            return {type: 'Success', text:'Password has been updated'}
          }
          const match = bcrypt.compareSync(args.currentPass, user.password)
          if(match) {
            const newPassHashed = bcrypt.hashSync(args.newPass, 12)
            user.update({password: newPassHashed})
            return {type: 'Success', text:'Password has been updated'}
          }
          if(!match) {
            throw new Error('Invalid password')
          }
        })
      })
    },
    googleSignIn: (_, args, context) => {
      return new Promise((resolve, reject)=>{
        const {code} = args
        google.call(code).then(response => {
          const {email, name} = response
          let tokens
          User.findOne({email: email}).then(async user => {
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
                User.create({
                  email: email,
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
            }
          }) 
        })
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
          resolve({error: e.toString()})
        })
      })
    },
    refreshToken: async (_,args, context) => {
      console.log('silent refresh')
      let {cookie} = context.headers
      if(!cookie) {
        throw new Error('Refresh token invalid')}
      cookie = cookie.replace('token=', '')
      const timestamp = new Date().getTime()
      return jwt.verify(cookie, process.env.JWT_REFRESH_SECRET, (err, decoded)=>{
        if(err){
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