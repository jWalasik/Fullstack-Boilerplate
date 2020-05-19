refreshToken: async (_,args, context) => {
  console.log('silent refresh')
  let {cookie} = context.headers
  if(!cookie) {
    throw new Error('Refresh token invalid')}
  cookie = cookie.replace('token=', '')
  const timestamp = new Date().getTime()
  return jwt.verify(cookie, process.env.JWT_REFRESH_SECRET, (err, decoded)=>{
    if(err){
      return err
    }
    if(timestamp-decoded>=0){
      return new Error('Refresh token expired')
    }
    //get user and update tokens
    return User.findById(decoded.user.id)
      .then(async user=>{
         const tokens = await user.generateJWT()
         context.res.cookie('token', tokens.refreshToken, {
          httpOnly: true,
          maxAge: 1000*60*60*24*31
        })
         user.accessToken = tokens.accessToken
         return user
      })
      .catch(err=> err)
  })
}