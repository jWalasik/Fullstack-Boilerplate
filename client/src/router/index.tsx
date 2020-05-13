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
      <PrivateRoute exact path="/home" component={Home} />
      <PrivateRoute exact path="/settings" component={Settings} />

      <PublicRoute exact path='/reset:token' component={SetPassword} />
      
      <PublicRoute exact path='/:callback?' component={Auth}/>
      
      <Route path='*' component={FourOhFour} />
    </Switch>
  </BrowserRouter>
  )
}