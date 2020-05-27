import * as React from 'react'
import {Route, Redirect} from 'react-router-dom'
import Auth from '../pages/Auth'
import Nav from '../components/Nav'
import Loader from '../pages/Loader'
import {useQuery} from '@apollo/react-hooks'
import {GET_USER} from '../apollo/queries'
import {useAuth} from '../components/utils/AuthProvider'

export const PrivateRoute = ({component: Component, ...rest}) => {
  //check if user is authenticated
  const auth = useAuth()
  console.log(auth)
  //set state hook prevents calling api twice on callbacks url
  const [loader, setLoader] = React.useState(false)
  const {client, loading, data: {user: {accessToken}}, called} = useQuery(GET_USER, {
    fetchPolicy: 'cache-only', 
    onCompleted:() => setLoader(true)
  })

  if(!loader) return <Loader />

  return (
      <Route {...rest} component={(props)=>(
      accessToken ? (
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
  //set state hook prevents calling api twice on callbacks url
  const [loader, setLoader] = React.useState(false)
  const {client, loading, data: {user: {accessToken}}, called} = useQuery(GET_USER, {
    fetchPolicy: 'cache-only', 
    onCompleted:() => setLoader(true)
  })  
  
  if(!loader) return <Loader />
  
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