const {gql} = require('apollo-server')

const typeDefs = gql`
  type AuthResponse {
    token: String
    email: String
  }

  input AuthInput {
    accessToken: String!
  }

  type Query {
    currentUser: User
  }

  type Tokens {
    accessToken: String
    refreshToken: String
  }

  type User {
    _id: ID
    name: String
    email: String
    password: String
    isActive: Boolean
    role: String
    facebook: String
    accessToken: String
  }

  type Mutation {
    login(user: String!, password: String!): User
    signup(email: String!, password: String!, name: String): User
    resetPassword(email: String!): String
    newPassword(newPassword: String!, resetToken: String!): String
    logout: Boolean
    changePassword(currentPass: String!, newPass: String!): String
    facebookSignIn(code: String!): User
    googleSignIn(code: String!): User
    refreshToken: User
  }
`
//export default typeDefs
module.exports = typeDefs;