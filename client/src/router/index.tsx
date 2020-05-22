import * as React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import {PublicRoute, PrivateRoute} from './Routes'

import Auth from '../pages/Auth'
import Home from '../pages/Home'
import Settings from '../pages/Settings'
import SetPassword from '../pages/SetPassword'
import FourOhFour from '../pages/404'
import Signup from '../components/Signup'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { REFRESH_TOKEN } from '../apollo/mutations'
import { IS_AUTH } from '../apollo/queries'
import Reset from '../components/Reset'
import Login from '../components/Login'

export default () => {
  const {loading, data, error} = useQuery(IS_AUTH)
  React.useEffect(()=>{
    console.log('router')
  },[])
  console.log(data)
  return (
    <BrowserRouter history>
      <Switch>
      <PrivateRoute exact path="/" component={Home} />
      <PrivateRoute exact path="/settings" component={Settings} />

      <PublicRoute exact path='/auth/reset:token' component={SetPassword} />
      <PublicRoute exact path='/auth/login:callback?' component={Login} />
      <PublicRoute exact path='/auth/signup' component={Signup} />
      <PublicRoute exact path='/auth/reset' component={Reset} />
      
      <Route path='*' component={FourOhFour} />
    </Switch>
  </BrowserRouter>
  )
}