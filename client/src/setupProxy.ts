// const proxy = require('http-proxy-middleware')

// module.exports = function(app) {
//   app.use(
//     proxy('/auth/google', {
//       target: 'http://localhost:4000/',
//       changeOrigin: true
//     })
//   ),
//   app.use(proxy('/auth/facebook', {
//       target: 'http://localhost:4000/',
//       changeOrigin: true
//     })
//   ),
//   app.use(proxy('/auth/google', {
//       target: 'http://localhost:4000/',
//       changeOrigin: true
//     })
//   )
// }