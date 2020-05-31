import * as React from 'react'
import {Route, Redirect} from 'react-router-dom'
import Auth from '../pages/Auth'
import Nav from '../components/Nav'
import Loader from '../pages/Loader'
import {useQuery} from '@apollo/react-hooks'
import {GET_USER} from '../apollo/queries'
import {useAuth} from '../components/utils/AuthProvider'

export const PrivateRoute = ({component: Component, ...rest}) => {
  const auth = useAuth()

  return (
      <Route {...rest} component={(props)=>(
        auth.isAuthenticated ? (
        <React.Fragment>
          <Nav />
          <Component {...props} />
        </React.Fragment>        
      ) : (
        <Redirect to='/auth/login' />
      )
    )} />
  )
}

export const PublicRoute = ({component: Component, ...rest}) => {
  const auth = useAuth()

  return (
    <Route {...rest} component={(props)=>(
      !auth.isAuthenticated ? (
        <Auth>
          <Component {...props} />
        </Auth>
      ) : (
        <Redirect to='/' />
      )
    )} />    
  )
}