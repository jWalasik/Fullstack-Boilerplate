const https = require('https')

module.exports = class GoogleAuth {
  constructor() {
    this.credentials = {
      appId: process.env.GOOGLE_APP_ID,
      secret: process.env.GOOGLE_APP_KEY
    }
    this.redirect = env.process.CLIENT_URL
  }

  call(method, params = {}) {
    return new Promise((resolve, reject) => {
      let url
    })
  }
}

`https://accounts.google.com/o/oauth2/v2/auth?
scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&
access_type=offline&
include_granted_scopes=true&
response_type=code&
state=state_parameter_passthrough_value&
redirect_uri=https%3A//oauth2.example.com/code&
client_id=${this.credentials.appId}`