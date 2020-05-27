import * as React from 'react'
import Loader from '../../pages/Loader'
import {useMutation} from '@apollo/react-hooks'
import { REFRESH_TOKEN } from '../../apollo/mutations'
  
const initialState = {
  resolved: false,
  isAuthenticated: false,
  redirected: false,
}

const AuthContext = React.createContext({
  isAuthenticated: null,
  login: (userData) => {},
  logout: ()=>{}
})

const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      console.log('login', action.payload)
      return {...state, user: action.payload}
    case 'LOGOUT':
      console.log('logout', action.payload)
      return {...state, user: null}
    default: return state
  }
}

const AuthProvider = (props) => {
  const [state, dispatch] = React.useReducer(AuthReducer, initialState)
  const [refreshToken, {data,client,loading}] = useMutation(REFRESH_TOKEN, {
    onCompleted: ({refreshToken})=>{
      saveUser(refreshToken)
    },
    onError: (err)=>{
      console.log('refresh failed')
    }
  })
  //accessToken expires in 15min, to keep session continuous call refreshToken mutation every 14 min
  const nextRefreshIn = (ms) => {
    setTimeout(()=>{
      refreshToken()
    }, ms)
  }
  React.useEffect(()=>{
    console.log('AuthProvider mounted')
    refreshToken()
    return ()=>console.log('AuthProvider unmounted')
  }, [])

  const saveUser = (user) => {
    const {name, email, accessToken} = user
    client.writeData({
      data: {
        user: {
          name: name,
          email: email,
          accessToken: accessToken,
          __typename: 'User'
        }
      }
    })

    nextRefreshIn(840000)
  }
  const login = (userData) => {
    console.log("login")
    dispatch({action: 'LOGIN'})
  }

  const logout = () => {
    console.log('logout')
    client.resetStore()
    dispatch({action: 'LOGOUT'})
    //logout needs to blacklist token to prevent user authentication between reloads, WIP
  }

  return <AuthContext.Provider value={{state, login, logout}} {...props} />
}

const useAuth = () => React.useContext(AuthContext)

export {AuthProvider, useAuth}