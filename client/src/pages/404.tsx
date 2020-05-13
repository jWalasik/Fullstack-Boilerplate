import * as React from 'react'
import {withRouter} from 'react-router-dom'

const Error404 = (props) => (
  <main>
    <h1>404</h1>
    <p>Something went wrong, page you are trying to access does not exist.</p>
    <button onClick={()=>props.history.push('/')}>Return</button>
  </main>
)

export default withRouter(Error404)