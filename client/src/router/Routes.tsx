import * as React from 'react'
import {Route, Redirect} from 'react-router-dom'
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
        <Redirect to='/' />
      )
    )} />
  )
}

export const PublicRoute = ({component: Component, ...rest}) => {
  const {client, loading, data} = useQuery(GET_USER, {fetchPolicy: 'cache-only'})
  let isAuthenticated = !!data.user.accessToken

  return (
    <Route {...rest} component={(props)=>(
      isAuthenticated ? (
        <Redirect to='/home' />
      ) : (
        <Component {...props} />
      )
    )}/>
  )  
}