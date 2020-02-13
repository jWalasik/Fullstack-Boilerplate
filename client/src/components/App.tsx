import * as React from "react";
import { hot } from "react-hot-loader";
import {Switch, Route, PrivateRouter} from 'react-router-dom'

import Login from './auth/Login'

class App extends React.Component<{}, undefined> {
  public render() {
    return (
      <Login />
    );
  }
}

declare let module: object;

export default hot(module)(App);
