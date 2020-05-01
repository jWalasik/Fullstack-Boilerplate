import * as React from 'react'
import {Component, Fragment, useEffect} from 'react'
import {withRouter, useHistory} from 'react-router-dom'

import Auth from '../pages/Auth'
import Nav from '../components/Nav'
import {useQuery, useMutation} from '@apollo/react-hooks'

import { GET_USER } from '../apollo/queries'
import { REFRESH_TOKEN } from '../apollo/mutations'
import { setAutoRefresh} from '../utils/auth'

const RequireAuth = (props) => {  
  const {client, loading, data} = useQuery(GET_USER,{fetchPolicy: 'cache-only'})
  const [silentRefresh, refreshData] = useMutation(REFRESH_TOKEN)

  let isAuth = !!data.user.accessToken

  //try to reach refresh token endpoint once
  useEffect(()=>{
    if(!data.accessToken) {
      silentRefresh().then(res=> {
        console.log('silent refresh')
        const {name, email, accessToken} = res.data.refreshToken
        client.writeData({
          data: {
            user: {
              name: name,
              email: email,
              accessToken: accessToken,
              __typename: 'User'
            }
          }
        })
        setAutoRefresh(client, silentRefresh)
      })
      .catch(err => {
        console.log('refresh error')
        console.log(err)
        return err
      })
    }
    
  }, [])
  
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