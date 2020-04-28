import * as React from 'react'
import {Component, Fragment, useEffect} from 'react'
import {withRouter, useHistory} from 'react-router-dom'

import Auth from '../pages/Auth'
import Nav from '../components/Nav'
import {useQuery, useMutation} from '@apollo/react-hooks'

import { GET_USER } from '../apollo/queries'
import { REFRESH_TOKEN } from '../apollo/mutations'

const RequireAuth = (props) => {
  let isAuth = false
  const {client, loading, data} = useQuery(GET_USER)
  const [silentRefresh, refreshData] = useMutation(REFRESH_TOKEN)

  useEffect(()=>{
    console.log(data)
    if(data.accessToken) {
      isAuth = true
      return
    }
    silentRefresh().then(res=> {
      const {name, email, accessToken} = res.data.refreshToken
      client.writeData({
        data: {
          isAuth: true,
          name: name,
          email: email,
          accessToken: accessToken
        }
      })
      isAuth = true
    })
    .catch(err => {
      console.log(err)
      return err
    })
  }, [])

  return (isAuth) ? (
    <Auth />
  ) : (
    <Fragment>
      <Nav />
      {props.children}
    </Fragment>
  )
}


export default withRouter(RequireAuth)