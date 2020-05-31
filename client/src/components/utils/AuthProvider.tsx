import * as React from 'react'
import Loader from '../../pages/Loader'
import {useMutation} from '@apollo/react-hooks'
import { REFRESH_TOKEN } from '../../apollo/mutations'

//external authentication services like facebook operates by url callbacks, this preserves refresh state between page reloads


const initialState = {
  loading: false,
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
      console.log('login reducer')
      return {...state, isAuthenticated: true}
    case 'LOGOUT':
      console.log('logout', action.payload)
      return {...state, isAuthenticated: false}
    default: return state
  }
}

const AuthProvider = (props) => {
  const [state, dispatch] = React.useReducer(AuthReducer, initialState)
  const [refreshToken, {data,client,loading, called}] = useMutation(REFRESH_TOKEN, {
    onCompleted: ({refreshToken})=>{
      console.log('TRYING TO REFRESH', Date.now(), refreshToken)
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
    const session = (parseInt(sessionStorage.getItem('refreshed')) - Date.now()) > 0
    console.log(session)
    if(!session) {
      refreshToken()
      const expiration = (Date.now() + 840000).toString()
      sessionStorage.setItem('refreshed', expiration)
    }
    
    return ()=>console.log('AuthProvider unmounted')
  }, [])

  const login = (userData) => {
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
    dispatch({type: 'LOGIN'})
    nextRefreshIn(840000)
  }

  const logout = () => {
    client.resetStore()
    dispatch({type: 'LOGOUT'})
    //logout needs to blacklist token to prevent user authentication between reloads, WIP
  }
  //if(loading) return <Loader />
  return <AuthContext.Provider value={{isAuthenticated: state.isAuthenticated, loading: loading, login, logout}} {...props} />
}

const useAuth = () => React.useContext(AuthContext)

export {AuthProvider, useAuth}