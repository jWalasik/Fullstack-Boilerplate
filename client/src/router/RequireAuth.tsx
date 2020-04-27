import * as React from 'react'
import {Component, Fragment, useEffect} from 'react'
import {withRouter, useHistory} from 'react-router-dom'

import Auth from '../pages/Auth'
import Nav from '../components/Nav'
import {useQuery, useMutation} from '@apollo/react-hooks'
import {gql} from 'apollo-boost'

import { GET_USER } from '../apollo/queries'
import { REFRESH_TOKEN } from '../apollo/mutations'

const RequireAuth = (props) => {
  const {client, loading, data} = useQuery(GET_USER)
  const [silentRefresh, refreshData] = useMutation(REFRESH_TOKEN)

  useEffect(()=>{
    silentRefresh().then(res=> {
      console.log('silent ref')
      console.log(res)})
  }, [])

  return (data && !data.isAuth) ? (
    <Auth />
  ) : (
    <Fragment>
      <Nav />
      {props.children}
    </Fragment>
  )
}


export default withRouter(RequireAuth)