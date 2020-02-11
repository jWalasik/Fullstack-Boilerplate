const User = require('../models/user')
const bcrypt = require('bcrypt')

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
      .catch(err=>console.log(err)),

    login: (_, args) => {
      return User.findOne({email: args.email}).then(res => {
        const match = bcrypt.compareSync(args.password, res.password)
        if(!match){
          console.log('Passwords not matching')
          return
        }
        //return JWT
        console.log('Passwords matching')
        return res
      })
    },

    authFacebook: async (_, { input: { accessToken } }, { req, res }) => {
      req.body = {
        ...req.body,
        access_token: accessToken,
      };

      try {
        // data contains the accessToken, refreshToken and profile from passport
        const { data, info } = await authenticateFacebook(req, res);

        if (data) {
          const user = await User.upsertFbUser(data);
  
          if (user) {
            return ({
              name: user.name,
              token: user.generateJWT(),
            });
          }
        }

        if (info) {
          console.log(info);
          switch (info.code) {
            case 'ETIMEDOUT':
              return (new Error('Failed to reach Facebook: Try Again'));
            default:
              return (new Error('something went wrong'));
          }
        }
        return (Error('server error'));
      } catch (error) {
        return error;
      }
    },
  }
}

module.exports = resolvers;