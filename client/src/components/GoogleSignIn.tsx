import * as React from 'react'
import querystring from 'querystring'
import {useMutation, useApolloClient} from '@apollo/react-hooks'
import * as google from '../../public/images/google-icon.png'
import {withRouter} from 'react-router-dom'
import Button from './utils/Button'

import {GOOGLE_SIGN_IN} from '../apollo/mutations'

interface State {
  loading
}

interface GoogleSignIn {
  appId: number,
  redirectUrl: string,
  code: any,
  state: State
}

const FaceookSignIn: any = (props) => {
  const clientId = '595630687793-7psec6hg5iva4vfn1n9no84i5n2op3ok.apps.googleusercontent.com'
  const redirectUrl = `${document.location.protocol}//${document.location.host}/google-callback`;
  const code = (document.location.pathname === '/google-callback') ? querystring.parse(document.location.search)['?code'] : null
  const [callGoogle, {client, data, loading, error, called}] = useMutation(GOOGLE_SIGN_IN, {onCompleted: (data)=>{
    const {name, email, accessToken} = data.googleSignIn
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
  }})

  if(code && !called) {
    callGoogle({variables: {code: code}})
  }

  const handleClick = e => {
    e.preventDefault()
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${encodeURIComponent(redirectUrl)}&prompt=consent&response_type=code&client_id=${clientId}&scope=email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&access_type=offline`;
  }

  return (
    <a className="login-options__link" href='/google-login' onClick={handleClick}>
      {loading ? <Button loading={loading} /> : <img className="social-link__icon" src={google.default} id="google" /> }
    </a>
  )
}

export default withRouter(FaceookSignIn)
