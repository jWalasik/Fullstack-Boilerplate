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
    getUsers: [User]
    getUser(id: ID!): User
    currentUser: User
  }

  type User {
    _id: ID!
    name: String
    email: String!
    password: String!
    isActive: Boolean!
    role: String
    token: String
  }

  type Mutation {
    login(email: String, password: String): User
    signup(email: String, password: String): User!
    authFacebook(input: AuthInput!): AuthResponse
    authGoogle(input: AuthInput!): AuthResponse
    socialAuth(provider: String!): AuthResponse
  }
`
//export default typeDefs
module.exports = typeDefs;