import * as React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import {PublicRoute, PrivateRoute} from './Routes'

import Auth from '../pages/Auth'
import Home from '../pages/Home'
import Settings from '../pages/Settings'
import SetPassword from '../pages/SetPassword'
import FourOhFour from '../pages/404'

export default () => {
  return (
    <BrowserRouter history>
      <Switch>
      <PublicRoute exact path='/' component={Auth}/>
      <PublicRoute path='/reset:token' component={SetPassword} />

      <PrivateRoute exact path="/home" component={Home} />
      <PrivateRoute exact path="/settings" component={Settings} />

      <Route component={FourOhFour} />
    </Switch>
  </BrowserRouter>
)}