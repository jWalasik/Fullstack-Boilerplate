import * as React from 'react'
import {Component, Fragment, useEffect} from 'react'
import {withRouter, useHistory} from 'react-router-dom'

import Auth from '../pages/Auth'
import Nav from '../components/Nav'
import {useQuery} from '@apollo/react-hooks'
import {gql} from 'apollo-boost'

import { GET_USER } from '../apollo/queries'

const CHECK_AUTH = gql`
  query checkAuth {
    isAuth @client
  }
`

const RequireAuth = (props) => {
  const {client, loading, data} = useQuery(CHECK_AUTH)

  // useEffect(()=>{
  //   console.log('load')
  //   //try refresh token

  // },[])

  return (true) ? (
    <Auth />
  ) : (
    <Fragment>
      <Nav />
      {props.children}
    </Fragment>
  )
}


export default withRouter(RequireAuth)