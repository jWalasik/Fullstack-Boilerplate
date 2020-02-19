require('dotenv').config()

//server
const express = require('express') //needed for social authentication callbacks
const {ApolloServer} = require('apollo-server-express') //express variant to apply middleware
const cors = require('cors') //needed for provider authentication, i.e. facebook will block redirects
const passport = require('passport')
const mongoose = require('mongoose') //mongoose 
//graphql 
const typeDefs = require('./graphql/schema.ts')
const resolvers = require('./graphql/resolvers.ts')

//utils
const chalk = require('chalk') //coloring console logs
const util = require('util') //inspect objects in console

const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI)
  .then(res=>console.log(chalk.green('Successfully connected to MongoDB')))
  .catch(err=>console.log(chalk.red(err)))

const app = express()

app.use(
  cors({
    origin: ['http://localhost:8080'],
    credentials: true
  })
)
require('./services/passport.ts')(passport)
app.use(passport.initialize())

//3rd party related routes
app.use('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}))
app.use('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  res.redirect(process.env.CLIENT_URL || '')
})
app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}))
app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect(process.env.CLIENT_URL || '')
})
app.get('/auth/twitter', passport.authenticate('twitter', {scope: ['profile']}))
app.get('/auth/twitter/callback', passport.authenticate('twitter'), (req, res) => {
  res.redirect(process.env.CLIENT_URL || '')
})

app.get('/logut', (req, res) => req.logout())

const server = new ApolloServer({
  typeDefs, 
  resolvers,
  context: ({req, res}) => {
    console.log(chalk.blue(util.inspect(req)))
    return {
      user: req.user,
      logout: () => req.logout()
    }
  }
})

server.applyMiddleware({app, path: '/', cors: false}) //disable apollo server default cors settings

const PORT = process.env.PORT
app.listen(PORT, ()=>{
  console.log(`Server is listening at port ${PORT}`)
})

// server.listen()
//   .then(({url}) => {
//     console.log(chalk.green(`Server running at ${url}`))
//   })
//   .catch(err=>console.log(chalk.red(err)))