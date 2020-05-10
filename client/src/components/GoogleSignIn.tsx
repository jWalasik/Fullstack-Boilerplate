import * as React from 'react'
import {useEffect, useState, useRef} from 'react'
import querystring from 'querystring'
import {useMutation, useApolloClient} from '@apollo/react-hooks'
import * as google from '../../public/images/google-icon.png'
import {withRouter} from 'react-router-dom'

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
  const client = useApolloClient()
  const appId = '187856148967924'
  const redirectUrl = `${document.location.protocol}//${document.location.host}/google-callback`;

  const code = (document.location.pathname === '/google-callback') ? querystring.parse(document.location.search)['?code'] : null
  const [loading, setLoading] = useState(false)
  const [callGoogle, {data}] = useMutation(GOOGLE_SIGN_IN)

  useEffect(()=>{
    let canceled
    if(!code || canceled) return
    callGoogle({variables: {code: code}})
    .then(res=>{
      setLoading(false)
      
      const {error, name, email, accessToken} = res.data.facebookSignIn
      if (error) {
        alert(`Sign in error: ${error}`);
      } else {
        //alert(`sign in success`);
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
        //props.history.push('/')
      }
    })
    .catch(e=>{
      console.log(e)
      setLoading(false)
    })
    return ()=>canceled = true
  },[])

  const handleClick = e => {
    setLoading(true)
    e.preventDefault()
    window.location.href = `https://www.facebook.com/v2.9/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUrl)}`;
  }

  // const redirect = () => {
  //   console.log('redirect')
  //   this.props.history.push('/')
  // }

  return (
    <a className="login-options__link" href='/facebook-login' onClick={handleClick}>
      {loading ? <p>loading...</p> : <img className="social-link__icon" src={google.default} id="google" /> }
    </a>
  )
}

export default withRouter(FaceookSignIn)
