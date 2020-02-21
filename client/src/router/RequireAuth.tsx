import * as React from 'react'
import {Component, Fragment} from 'react'
import {withRouter} from 'react-router-dom'
import Login from '../components/Login'
import Nav from '../components/Nav'
import {useQuery} from '@apollo/react-hooks'
import {gql} from 'apollo-boost'

//import {GET_USER} from '../apollo/queries'

const CHECK_AUTH = gql`
  query checkAuth {
    isAuth @client
  }
`

const GET_USER = gql`
  query currentUser {
    currentUser {
      name
    }
  }
`

const RequireAuth = (props) => {
  const {client, loading, data} = useQuery(GET_USER)
  console.log(data)
  return (data && !data.currentUser) ? (
    <Login />
  ) : (
    <Fragment>
      <Nav />
      {props.children}
    </Fragment>
  )
}


export default withRouter(RequireAuth)