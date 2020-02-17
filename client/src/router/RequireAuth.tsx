import * as React from 'react'
import {Component, Fragment} from 'react'
import {withRouter} from 'react-router-dom'
import Login from '../components/Login'
import Nav from '../components/Nav'
import {useQuery} from '@apollo/react-hooks'
import {gql} from 'apollo-boost'

const checkAuth = gql`
  query checkAuth {
    isAuth @client
  }
`

const RequireAuth = (props) => {
  const {data} = useQuery(checkAuth)
  console.log(data)
  return !data.isAuth ? (
    <Login />
  ) : (
    <Fragment>
      <Nav />
      {props.children}
    </Fragment>
  )
}


export default withRouter(RequireAuth)