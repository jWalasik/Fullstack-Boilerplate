const https = require('https')

module.exports = class FB {
  constructor() {
    this.version = 'v2.9'
    this.credentials = {
      appId: process.env.FB_APP_ID,
      secret: process.env.FB_APP_KEY
    }
    this.redirectUrl = process.env.FB_REDIRECT || 'http://localhost:8080/facebook-callback'
  }
  
  call(method, params = {}) {
    return new Promise((resolve,reject) => {
      let url = `https://graph.facebook.com/${this.version}/${method}?client_id=${this.credentials.appId}&redirect_uri=${this.redirectUrl}&client_secret=${encodeURIComponent(this.credentials.secret)}`

      Object.keys(params).forEach(key=>{
        url +=`&${key}=${params[key]}`
      })
      
      https.get(url, (res) => {
        let data = ''
        res.on('data', (d) => {
          data +=d
        })
        res.on('end', () => {
          data = JSON.parse(data)
          if(res.statusCode !== 200) {
            reject(data)
          } else {
            resolve(data)
          }
        })
      }).on('error', (e) => {
        console.log(e)
      })
    })
  }
}