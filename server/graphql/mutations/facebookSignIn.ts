facebookSignIn: (_, args, context) => {
  return new Promise((resolve, reject) => {
    const {code} = args
    facebook.call('oauth/access_token', {code}).then(response => {
      const {access_token} = response
      facebook.call('me', {access_token}).then(response => {
        const {name, id, email} = response
        let tokens

        User.findOne({facebook: id}).then(async user => {
          if(user){
            tokens = await user.generateJWT()
            
            context.res.cookie('token', tokens.refreshToken, {
              httpOnly: true,
              maxAge: 1000*60*60*24*31
            })
            user.accessToken = tokens.accessToken
            resolve(
              user
            )
          } else {
            facebook.call('oauth/access_token', {
              grant_type: 'fb_exchange_token',
              fb_exchange_token: access_token
            }).then(response => {
              User.create({
                facebook: id,
                email: email? email : `${name}@placeholder.fb`,
                name: name,
                isActive: true
              }).then(async user => {
                tokens = await user.generateJWT()
                context.res.cookie('token', tokens.refreshToken, {
                  httpOnly: true,
                  maxAge: 1000*60*60*24*31
                })
                user.accessToken = tokens.accessToken
                resolve(
                  user
                )
              })
            })
          }
        })            
      })
    }).catch(e=>{
      resolve({error: e.toString()})
    })
  })
}