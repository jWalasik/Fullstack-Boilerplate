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
    }
  }
}

//export default resolvers
module.exports = resolvers