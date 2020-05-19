login: (_, args, context) => {
  return User
  .findOne({$or:[
    {email: args.user},
    {name: args.user}        
  ]}).then(async user => {
    if(!user) throw new Error('User not found')
    const match = bcrypt.compareSync(args.password, user.password)
    if(!match) throw new Error('Invalid password')

    //return JWT
    const tokens = await user.generateJWT()
    context.res.cookie('token', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 1000*60*60*24*31
    })
    user.accessToken = tokens.accessToken
    return user
  })
  .catch(err=> {
    return err
  })
}