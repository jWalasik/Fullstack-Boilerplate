googleSignIn: (_, args, context) => {
  return new Promise((resolve, reject)=>{
    const {code} = args
    google.call(code).then(response => {
      const {email, name} = response
      let tokens
      User.findOne({email: email}).then(async user => {
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
            User.create({
              email: email,
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
        }
      }) 
    })
  })
}