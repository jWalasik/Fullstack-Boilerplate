const https = require('https')
const request = require('request')

module.exports = class GoogleAuth {
  constructor() {
    this.credentials = {
      appId: process.env.GOOGLE_APP_ID,
      secret: process.env.GOOGLE_APP_KEY
    }
    this.redirect = process.env.GOOGLE_REDIRECT || 'http://localhost:8080/google-callback'
  }
  call(code = {}) {
    return new Promise((resolve, reject) => {
      let url = `https://www.googleapis.com/oauth2/v4/token?code=${code}&client_id=${this.credentials.appId}&client_secret=${encodeURIComponent(this.credentials.secret)}&grant_type=authorization_code&redirect_uri=${this.redirect}`
      const uri = `code=${code}
        &redirect_uri=${this.redirect}
        &client_id=${this.credentials.appId}
        &client_secret=${this.credentials.secret}
        &scope=
        &grant_type=authorization_code`

      const options = {
        host: 'www.googleapis.com',
        path: '/oauth2/v4/token',
        method: 'POST',
        headers: {
          'Content-Length': uri.length,
          'Content-type': 'application/x-www-form-urlencoded'
        }
      }
      let postReq = https.request(options, (res)=>{
        console.log('status code:', res.statusCode)
      })
      // https.get(url, (res)=>{
      //   let data = ''
      //   res.on('data', (d)=>{
      //     console.log('response data')
      //     data +=d
      //   })
      //   res.on('end', ()=>{
      //     console.log('res ended:',data)
      //     data = JSON.parse(data)
      //     console.log('res:', res)
      //     console.log('data:',data)
      //     if(res.statusCode !== 200) {
      //       reject(data)
      //     } else {
      //       resolve(data)
      //     }
      //   })
      // }).on('error', (e)=>console.log(e))
    })
  }
}
