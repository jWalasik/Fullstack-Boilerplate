const User = require('../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const util = require('util')

const {authenticateFacebook} = require('../passport/config')

const resolvers = {
  Query: {
    getUsers: async () => await User.find({}).exec()
  },

  Mutation: {
    signup: (_, args) => User.create(args)
      .then(user => {
        return user
      })
      .catch(err=>err),

    login: (_, args) => {
      return User.findOne({email: args.email}).then(user => {
        const match = bcrypt.compareSync(args.password, user.password)
        if(!match){
          return new Error('Passwords not matching!')
        }
        //return JWT
        user.token = user.generateJWT()
        console.log(user.token)
        return user
      })
    },

    authFacebook: async (_, { input: { accessToken } }, { req, res }) => {
      req.body = {
        ...req.body,
        access_token: accessToken,
      };

      try {
        // data contains the name, email, token and fb-id from passport
        const { data, info } = await authenticateFacebook(req, res);
        
        if (data) {
          return User.facebookAuth(data).then(user => {
            return ({
              name: user.name,
              token: user.generateJWT(),
            })
          })
        }

        if (info) {
          switch (info.code) {
            case 'ETIMEDOUT':
              return (new Error('Failed to reach Facebook: Try Again'));
            default:
              return (new Error('something went wrong'));
          }
        }
      } catch (error) {
        return error;
      }
    },

    authGoogle: (_, args) => {

    }
  }
}

module.exports = resolvers;