changePassword: (_, args, context) => {
  const token = context.headers.authorization.split(' ')[1]
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded)=>{
    return User.findById(decoded.user.id).then(user => {
      if(!user.password){ //users created through external auth services have no password specified, this lets them add one
        const newPassHashed = bcrypt.hashSync(args.newPass, 12)
        user.password = newPassHashed
        user.save()
        return {type: 'Success', text:'Password has been updated'}
      }
      const match = bcrypt.compareSync(args.currentPass, user.password)
      if(match) {
        const newPassHashed = bcrypt.hashSync(args.newPass, 12)
        user.update({password: newPassHashed})
        return {type: 'Success', text:'Password has been updated'}
      }
      if(!match) {
        throw new Error('Invalid password')
      }
    })
  })
}