const User = require('../models/user')

const resolvers = {
  Query: {
    getUsers: async () => await User.find({}).exec()
  },

  Mutation: {
    signup: async(_, args) => User.create(args)
      .then(user => {
        user.save()
        return user
      })
      .catch(err=>console.log(err))
  }
}

module.exports = resolvers;