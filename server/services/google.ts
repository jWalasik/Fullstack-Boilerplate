const https = require('https')
const request = require('request')
const jwt = require('jsonwebtoken')

module.exports = class GoogleAuth {
  constructor() {
    this.credentials = {
      appId: process.env.GOOGLE_APP_ID,
      secret: process.env.GOOGLE_APP_KEY
    }
    this.redirect = process.env.GOOGLE_REDIRECT || 'http://localhost:8080/google-callback'
  }
  getCertificates(){
    return new Promise((resolve, reject) => {
      request('https://www.googleapis.com/oauth2/v1/certs', (err, res, body) => {
        if(err) {
            console.log(err, res.statusCode)
            reject(err)
          }
          const json = JSON.parse(body)
          console.log(json)
          resolve(json)
      })
    })
  }
  
  async call(code = {}) {
    const certificates = await this.getCertificates()
    return new Promise((resolve,reject) => {    
      request.post(
        {
          url: 'https://accounts.google.com/o/oauth2/token',
          form: {
            grant_type: 'authorization_code',
            code: code,
            client_id: this.credentials.appId,
            client_secret: this.credentials.secret,
            redirect_uri: this.redirect
          }
        },
        (err, res, body) => {
          if(err) {
            console.log(err, res.statusCode)
          }
          const json = JSON.parse(body)
          const decoded = jwt.decode(json.id_token, {complete: true})
          const cert = certificates[decoded.header.kid]

          jwt.verify(json.id_token, cert, {algoriths: ['RS256']}, (err, payload) => {
            if(err) {
              console.log('Error:', err)
              return
            }
            resolve(payload)
          })
        }
      )
    })
  }
}
