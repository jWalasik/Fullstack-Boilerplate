export let isAuthenticated

export const defaultState = {
  isAuthenticated: false,
  user: {
    name: null,
    email: null,
    accessToken: null,
    __typename: 'User'
  }
}

//resolvers
export const saveUser = (data) => {
  
}

// let refresher
// export const setAutorefresh = (func: Function, cancel?: Boolean) => {
//   console.log('set Auto Refresh')
//   if(cancel) clearTimeout(refresher)
//   refresher = setTimeout(()=>{
//     func()
//   },8600000)
// }