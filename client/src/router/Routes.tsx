import * as React from 'react'
import {Route, Redirect} from 'react-router-dom'
import Auth from '../pages/Auth'
import Nav from '../components/Nav'
import {useQuery} from '@apollo/react-hooks'
import {GET_USER} from '../apollo/queries'

export const PrivateRoute = ({component: Component, ...rest}) => {
  const {client, loading, data} = useQuery(GET_USER, {fetchPolicy: 'cache-only'})
  let isAuthenticated = !!data.user.accessToken

  return (
    <Route {...rest} component={(props)=>(
      isAuthenticated ? (
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
  const {client, loading, data: {user: {accessToken}}} = useQuery(GET_USER, {fetchPolicy: 'cache-only'})
  
  //return accessToken ? <Redirect to='/' /> : <Component />
  //nesting components in route th
  console.log(Component)
  return (
    <Route {...rest} component={(props)=>(
      !accessToken ? (
        <Auth>
          <Component {...props} />
        </Auth>
      ) : (
        <Redirect to='/' />
      )
    )} />
  )
}