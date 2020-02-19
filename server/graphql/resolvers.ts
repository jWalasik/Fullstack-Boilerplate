const User = require('../models/user.ts')
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
  }
}

//export default resolvers
module.exports = resolvers