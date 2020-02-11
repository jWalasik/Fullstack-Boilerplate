const User = require('../models/user')
const bcrypt = require('bcrypt')

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
    }
  }
}

module.exports = resolvers;