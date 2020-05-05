// const nodemailer = require('nodemailer')
// const sendGridTransport = require('nodemailer-sendgrid-transport')

// module.exports = nodemailer.createTransport(sendGridTransport({
//   auth: {
//     api_key: process.env.MAILER_KEY
//   }
// }))

const mailgun = require('mailgun-js')

module.exports = mailgun({
  apiKey: process.env.MAILER_KEY,
  domain: 'https://api.mailgun.net/v3/sandbox773303c5f0da4b93ad2563baac3727a8.mailgun.org'
})