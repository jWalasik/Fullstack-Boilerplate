require('dotenv').config()

const {ApolloServer} = require('apollo-server')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')
const mongoose = require('mongoose')
const chalk = require('chalk')
const passport = require('passport')
const util = require('util')

const {User} = require('./models/user')

const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI)
  .then(res=>console.log(chalk.green('Successfully connected to MongoDB')))
  .catch(err=>console.log(chalk.red(err)))

const server = new ApolloServer({
  typeDefs, 
  resolvers,
  context: ({req, res}) => {
    //console.log(chalk.blue(util.inspect(req.body.access_token, false, null, true)))

    return ({req, res})
  }
});


server.listen()
  .then(({url}) => {
    console.log(chalk.green(`Server running at ${url}`))
  })
  .catch(err=>console.log(chalk.red(err)))