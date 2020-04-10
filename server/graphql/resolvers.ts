const User = require('../models/user.ts')
const bcrypt = require('bcrypt')
const FB = require('../services/facebook.ts')
const session = require('express-session')

const facebook = new FB()

const resolvers = {
  Query: {
    getUsers: async () => await User.find({}).exec(),
    currentUser: (parent, args, context) => context.user
  },

  Mutation: {
    signup: (_, args) => {
      console.log('user signup: ', args)
      return User.create(args)
      .then(user => {
        return user
      })
      .catch(err=>err)},

    login: (_, args, context) => {
      console.log('login context:', context)
      return User
      .findOne({$or:[
        {email: args.user},
        {name: args.user}, //to-do: change argument to neutral
        
      ]}).then(user => {
        const match = bcrypt.compareSync(args.password, user.password)
        if(!match){
          return new Error('Passwords not matching!')
        }
        //return JWT
        user.token = user.generateJWT()
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
        
        //short-term access token
        facebook.call('oauth/access_token', {code}).then(response => {
          const {access_token} = response
          facebook.call('me', {access_token}).then(response => {
            const {name, id} = response
            
            User.findOne({facebook: id}).then(user => {
              if(user){
                console.log('user found: ', user)
                resolve({
                  name: user.name,
                  _id: user._id,
                  email: user.email,
                  facebook: user.facebook
                  
                  //use session or jwt here
                })
              } else {
                facebook.call('oauth/access_token', {
                  grant_type: 'fb_exchange_token',
                  fb_exchange_token: access_token
                }).then(response => {
                  const {access_token} = response
    
                  resolve(User.create({
                    facebook: id,
                    email: `${name}@placeholder.fb`,
                    name: name,
                    isActive: true
                  }))
                })
              }
            })
          })
        }).catch(e=>{
          console.log('resolver error:',e)
          resolve({error: e.toString()})
        })
      })
    }
  }
}

//export default resolvers
module.exports = resolvers