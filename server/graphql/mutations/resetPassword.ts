resetPassword: (_, args, context) => {
  return User.findOne({email: args.email}).then(user=>{
    if(!user) throw new Error('Entered email is not registered')

    return crypto.randomBytes(32, (err, buffer) => {
      const token = buffer.toString('hex')
      if(err) throw err
      user.resetToken = token
      user.resetTokenExp = Date.now() + 3600000
      return user.update({
        resetToken: token,
        resetTokenExp: Date.now() + 3600000
      }).then(()=>{
        const message = {
          from: `jacekwalasik89@gmail.com`,
          to: args.email,
          subject: `Password reset request`,
          text: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:8080/reset${token}">link</a> to set a new password.</p>
          `
        }
        mailgun.messages().send(message, function (error, body) {
          if(error) throw error
        })
      })          
    })
    
  })
  .then(()=> {
    return {type: 'Success', text: 'Password reset email was sent, it should arrive shortly. Make sure to check spam folder.'}
  })
  .catch(err=>err)
}