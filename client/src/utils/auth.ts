export const setAutoRefresh = (client, mutation) => {
  client.interval = setInterval(()=>{
    console.log('start silent refresh')
    mutation().then(res=>{
      const {name, email, accessToken} = res.data.refreshToken
      client.writeData({
        data: {
          user: {
            name: res.name,
            email: email,
            accessToken: accessToken,
            __typename: 'User'
          }
        }
      })
    })
  }, 840000) //14min, access token expires in 15
}
