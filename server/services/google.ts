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
    return new Promise((resolve, reject)) => {
      request('https://www.googleapis.com/oauth2/v1/certs', (err, res, body) => {
        if(err) {
            console.log(err, res.statusCode)
            reject(err)
          }
          const json = JSON.parse(body)
          resolve(json)
      })
    }
  }
  
  call(code = {}) {
    return new Promise((resolve,reject) => {    
      //TO-DO: implement certificate check, google rotates them regulary so values will expire at some point
      const certificates = {
        "74bd86fc61e4c6cb450126ff4e38b069b8f8f35c": "-----BEGIN CERTIFICATE-----\nMIIDJjCCAg6gAwIBAgIIDtGgfhZmzmswDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE\nAxMrZmVkZXJhdGVkLXNpZ25vbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe\nFw0yMDA0MzAwNDI5MzFaFw0yMDA1MTYxNjQ0MzFaMDYxNDAyBgNVBAMTK2ZlZGVy\nYXRlZC1zaWdub24uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wggEiMA0GCSqG\nSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCr1ZDz+5zDmwsIoxmlaPVaFldbULzcbpoT\ns1JPUPdxQ2cog3dGEjTgQ60mtt8XnAnCZ0y6urAgm6FcELjinKEGRrEnT6XKu+As\ndWFCHEfor1v5RXTCETR6qI46XWycqT43QFF9Pl2YKCGvuvFwdQmpIW4OlmjZknMy\nK4XYOZ5AdpO26wudT7vGc/gHh4cb+HieKwrXPHz6X6sFjJoYdF/pmp6VOlEMcNVA\nwa66dsapVdGBzU6PA9yLpkPN1IVEZJPeAJkWKtF86hcyoXbjvhMPcqNg92bB8ROI\n8B85UID0jaZWPgiFsQsNNVVh2HQMGzeaSzWPZMEhSeJSIOzlz7+jAgMBAAGjODA2\nMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1UdJQEB/wQMMAoGCCsG\nAQUFBwMCMA0GCSqGSIb3DQEBBQUAA4IBAQCge2kMMNrIcyuZlgrcPHusMvtG7JY1\n8m/3cCNlZDfUJMQx7Ce9fsNm3atON5yyIsh1OIAWUifXWYZ1U48xvw6TveJw7F65\nEar7bGvUXOOpQ8PnShxs+satLg0NAl0QfolKCjG0KUfvWPUb/AezZ2rJcKyxE3Wt\nfxQnsFWqOM07Oo1lD4ykmvlY00RRiKF/C/eFzyEwXJ9wugwENBlFqa9L1BX7svSS\nEYCJ4uwrE5K0iMOMTgt9KOj2oUWfSd/dfIsQ9mDfLfM1iS/vCGSCJ0iBoaIadIFi\nM8+X85SaaVn2kAkPg3Rfhqz7xwzy032drTNi0uMhdVGO1yWHO+CDNvwk\n-----END CERTIFICATE-----\n",
        "c1771814ba6a70693fb9412da3c6e90c2bf5b927": "-----BEGIN CERTIFICATE-----\nMIIDJjCCAg6gAwIBAgIINA9D6ntD6UwwDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE\nAxMrZmVkZXJhdGVkLXNpZ25vbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe\nFw0yMDA1MDgwNDI5MzJaFw0yMDA1MjQxNjQ0MzJaMDYxNDAyBgNVBAMTK2ZlZGVy\nYXRlZC1zaWdub24uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wggEiMA0GCSqG\nSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDEcofKwYd9lvL3ay0DILheSnu3YhvpMSFr\nUbXVTAaCau/umCmMoEmQ7Ve2+9PYvekTKWFwqEuA7x/HlH6spx57Nn9ilPK5PW8c\nexZgnF6hxXmbRXvT82+B/KyXqVL+B299Prx0w2TUQvxsiT26IIwii1WlyrgUh4gP\nvkN6d2r+hO5c5lV4KLWvyrSp4xY3ucVkQkKfHNrI05MTv54LwVExGK757e062Su6\nBrcLPraeSSsa1DIBpC1Se2sNNDGMTZM2EG9YFYNU5+8b64J7YmSF8MLsJmUTq2kG\nj5WTIgYZmNHmoGVhMrHpkmNZ5ALXeWnB3tYHW8q0FIoYfa8q4FutAgMBAAGjODA2\nMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1UdJQEB/wQMMAoGCCsG\nAQUFBwMCMA0GCSqGSIb3DQEBBQUAA4IBAQCDmHmX0May2yvcY/YEKMZIleBzIJrZ\nIs2COueb5KwUy13aORB2vCsIA6xZh9onhOlDaf7Hd5ZziMQsn4+mo1ta3nxKInXC\nYvf3YnNOThTEgZY3ZOfI5wDs4sGVEkiF+VHdMOj4AFrB2Fapyh2NwyiSiXR+yFcW\nishQj9Lh9h1dBdz2C3ZcVzP0f9Fjfqj27N6h5PA7ooBSgXmXR2zCbT5n9+LykT3G\nyMGS0j7XL+EmO8LiLAbxW6Zxyvjd6NFD3VA2+FtgT+rVzOIIiDTDttStC3PqhbwT\n87QGg8tCjnYVAuXPrBWfoxPBNUAAWSgVdh1gsJ7sehDEofBiKJ5oU9cH\n-----END CERTIFICATE-----\n"
        }
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
