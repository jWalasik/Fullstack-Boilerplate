signup: (_, args) => {
  console.log(args)
  return User.create(args)
  .then(user => {
    return {type: 'Success', text: 'Successfuly registered new user'}
  })
  .catch(err=>{
    console.log(err)
    if(err.code === 11000) throw new Error('Entered email is already registered')
    throw err
  })
}