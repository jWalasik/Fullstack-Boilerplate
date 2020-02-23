const User = require('../models/user.ts')
const bcrypt = require('bcrypt')

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

    login: (_, args) => {
      console.log(args)
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
      console.log(context.user)
      context.user = {}
      context.logout()
    }
  }
}

//export default resolvers
module.exports = resolvers