logout: (_, args, context) => {
  context.user = {}
  //if you want to prevent login with refresh token you need to implement token blacklisting logic
  context.logout()
}