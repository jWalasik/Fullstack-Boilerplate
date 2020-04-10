import * as React from 'react'
import {useEffect, useState} from 'react'
import querystring from 'querystring'
import {useMutation} from '@apollo/react-hooks'
import {gql} from 'apollo-boost'

import {FACEBOOK_SIGN_IN} from '../apollo/mutations'

interface State {
  loading
}

interface FaceookSignIn {
  appId: number,
  redirectUrl: string,
  code: any,
  state: State
}

const FaceookSignIn: any = () => {
  const appId = '187856148967924'
  const redirectUrl = `${document.location.protocol}//${document.location.host}/facebook-callback`;

  const code = (document.location.pathname === '/facebook-callback') ? querystring.parse(document.location.search)['?code'] : null
  const [loading, setLoading] = useState(false)
  const [callFacebook, {data}] = useMutation(FACEBOOK_SIGN_IN)

  useEffect(()=>{
    if(!code) return

    setLoading(true)

    callFacebook({variables: {code: code}})
    .then(res=>{
      console.log('res:', res)
      setLoading(false)

      const {error, user, session} = res.data.facebookSignIn
      if (error) {
        alert(`Sign in error: ${error}`);
      } else {
        alert(`sign in success, your token: ${session.token}`);
      }
    })
    .catch(e=>{
      //alert(`backend error: ${e.toString()}`);
      setLoading(false)
    })
  },[code])

  const handleClick = e => {
    e.preventDefault()
    window.location.href = `https://www.facebook.com/v2.9/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUrl)}`;
  }

  return (
    <a href='/facebook-login' onClick={handleClick}>Facebook</a>
  )
}

export default FaceookSignIn