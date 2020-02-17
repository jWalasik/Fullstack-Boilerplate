const User = require('../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const util = require('util')

const {authenticateFacebook, authenticateGoogle, socialAuthentication} = require('../passport/config')

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
        return user
      })
    },

    socialAuth: (_, args, {req, res}) => {
      req.body = {
        ...req.body,
        provider: args.provider
      }
      socialAuthentication(args.provider, req, res)
    },
    authFacebook: async (_, { input: { accessToken } }, { req, res }) => {// _, intup from graphql schema, context
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
              email: user.email,
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

    authGoogle: (_, {input: {accessToken}}, {res, req}) => {
      req.body = {
        ...req.body,
        access_token: accessToken,
      };
      return authenticateGoogle(req, res)
        .then(({data, info})=>{
          if(data) {
            return User.googleAuth(data).then(user => {
              return ({
                email: user.email,
                token: user.generateJWT(),
              })
            })
          }
          else if(info){
            return new Error(info.message)
          }
        })
      .catch(err=> err)
    }
  }
}

module.exports = resolvers;