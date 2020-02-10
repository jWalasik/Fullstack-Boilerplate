require('dotenv').config()

const {ApolloServer} = require('apollo-server')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')
const mongoose = require('mongoose')
const chalk = require('chalk')

const {User} = require('./models/user')
const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI)
  .then(res=>console.log('Successfully connected to MongoDB'))
  .catch(err=>console.log(chalk.red(err)))

const server = new ApolloServer({typeDefs, resolvers});

server.listen()
  .then(({url}) => {
    console.log(chalk.green(`Server running at ${url}`))
  })
  .catch(err=>console.log(chalk.red(err)))