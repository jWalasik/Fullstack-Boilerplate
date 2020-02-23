import * as React from 'react'
import {Component, Fragment, useEffect} from 'react'
import {withRouter, useHistory} from 'react-router-dom'

import Auth from '../pages/Auth'
import Nav from '../components/Nav'
import {useQuery} from '@apollo/react-hooks'
import {gql} from 'apollo-boost'

import {GET_USER} from '../apollo/queries'

const CHECK_AUTH = gql`
  query checkAuth {
    isAuth @client
  }
`

const RequireAuth = (props) => { 
  let isAuth = false
  const {client, loading, data} = useQuery(GET_USER)
  const auth = useQuery(CHECK_AUTH)
  
  if(!loading) isAuth = (!!data.currentUser || !!localStorage.getItem('token'))
  console.log(isAuth)
  return (!isAuth) ? (
    <Auth />
  ) : (
    <Fragment>
      <Nav />
      {props.children}
    </Fragment>
  )
}


export default withRouter(RequireAuth)