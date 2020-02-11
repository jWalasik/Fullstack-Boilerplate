# MERN-boilerplate

This is a boilerplate project using the following technologies:
- [React](https://facebook.github.io/react/) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Express](http://expressjs.com/) and [Mongoose](http://mongoosejs.com/) for the backend
- [Webpack](https://webpack.github.io/) for compilation
- [GraphQL]() for communication between client and server
- [MongoDB]() noSQL database for storage
- [Typescript]() for 


## Requirements

- [Node.js](https://nodejs.org/en/) 6+
-Make sure to add a `.env` file in the root folder. See the .envsample there for more details.

## Scripts

### Developement

$npm install

$npm run start-server - runs backend server
$npm run start-client - runs client in developement mode

$npm run start-dev - uses concurently to run both server and client from single terminal

$npm run test
$npm run lint

### Production

$npm run build - creates optimized bundle for production
$npm run prod - 