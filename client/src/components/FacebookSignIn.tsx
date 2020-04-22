import * as React from 'react'
import {useEffect, useState} from 'react'
import {withRouter} from 'react-router-dom'
import querystring from 'querystring'
import {useMutation, useApolloClient} from '@apollo/react-hooks'
import {gql} from 'apollo-boost'

import * as fb from '../../public/images/fb-icon.png'

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

const FaceookSignIn: any = (props) => {
  const client = useApolloClient()
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
      setLoading(false)

      const {error, refreshToken, accessToken} = res.data.facebookSignIn
      if (error) {
        alert(`Sign in error: ${error}`);
      } else {
        //alert(`sign in success`);
        
        client.writeData({
          data: {
            isAuth: true,
            accessToken: accessToken,
            refreshToken: refreshToken
          }
        })
        props.history.push('./')
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

  const redirect = () => {
    console.log('redirect')
    this.props.history.push('/')
  }

  return (
    <a className="login-options__link" href='/facebook-login' onClick={handleClick}>
      {loading ? <p>loading...</p> : <img className="social-link__icon" src={fb.default} id="facebook" /> }
    </a>
  )
}

export default withRouter(FaceookSignIn)