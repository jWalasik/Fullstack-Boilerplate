import * as React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import {PublicRoute, PrivateRoute} from './Routes'

import Home from '../pages/Home'
import Settings from '../pages/Settings'
import SetPassword from '../pages/SetPassword'
import FourOhFour from '../pages/404'
import Signup from '../components/Signup'
import Reset from '../components/Reset'
import Login from '../components/Login'

export default  () => {
  return (
    <BrowserRouter history>
      <Switch>
      <PrivateRoute exact path="/" component={Home} />
      <PrivateRoute exact path="/settings" component={Settings} />
      
      <PublicRoute exact path='/auth/reset:token' component={SetPassword} />      
      <PublicRoute exact path='/auth/signup' component={Signup} />
      <PublicRoute exact path='/auth/reset' component={Reset} />
      <PublicRoute path='/auth/:callback?' component={Login} />   

      <Route path='*' component={FourOhFour} />
    </Switch>
  </BrowserRouter>
  )
}