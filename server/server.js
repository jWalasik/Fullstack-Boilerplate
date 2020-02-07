import express from 'express';
import cors from 'cors';
import open from 'open';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';

//import SERVER from './graphql/schema';

//require('dotenv').config();

const MONGODB_URI = 'xxx' || process.env.MONGODB_URI

const APP = express();

mongoose
  .connect(MONGODB_URI,{})
  .then(()=>console.log('MongoDB successfully connected'))
  .catch(err=>console.log(err))


APP.use(cors());
APP.use(bodyParser.json())
APP.use(bodyParser.urlencoded({extended:true}))

APP.use('/graphql', passport.authenticate('jwt', {session: false}))

APP.use('./routes/users', users)
// SERVER.applyMiddleware({
//   app: APP,
// });

const PORT = 4000 || process.env.API_PORT;

APP.listen(PORT, () => {
  console.log(`The server is running! Listening on port: ${PORT}`);
  console.log(`http://localhost:${PORT}/graphql`);
});

open(`http://localhost:${PORT}/graphql`);

export default APP;