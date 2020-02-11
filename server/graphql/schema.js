const {gql} = require('apollo-server-express')

const typeDefs = gql`
  type Query {
    getUsers: [User]
    getUser(id: ID!): User
  }

  type Mutation {
    login(email: String, password: String): User
    signup(email: String, password: String): User

  }

  type User {
    _id: ID!
    name: String
    email: String!
    password: String!
    isActive: Boolean!
    role: String
  }
`

module.exports = typeDefs;