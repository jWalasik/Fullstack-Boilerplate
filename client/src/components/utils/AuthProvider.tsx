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
  console.log(state,action)
  switch (action.type) {
    case 'LOGIN':
      console.log('xxx')
      return {...state, isAuthenticated: true}
    case 'LOGOUT':
      console.log('logout', action.payload)
      return {...state, isAuthenticated: false}
    default: return state
  }
}

const AuthProvider = (props) => {
  const [state, dispatch] = React.useReducer(AuthReducer, initialState)
  const [refreshToken, {data,client,loading}] = useMutation(REFRESH_TOKEN, {
    onCompleted: ({refreshToken})=>{
      login(refreshToken)
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

  const login = (userData) => {
    console.log('AuthProvider login')
    const {name, email, accessToken} = userData
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
    console.log('dispatch')
    dispatch({type: 'LOGIN'})
    nextRefreshIn(840000)
  }

  const logout = () => {
    console.log('logout')
    client.resetStore()
    dispatch({type: 'LOGOUT'})
    //logout needs to blacklist token to prevent user authentication between reloads, WIP
  }

  return <AuthContext.Provider value={{isAuthenticated: state.isAuthenticated, login, logout}} {...props} />
}

const useAuth = () => React.useContext(AuthContext)

export {AuthProvider, useAuth}