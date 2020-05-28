import * as React from 'react'
import querystring from 'querystring'
import {useMutation, useApolloClient} from '@apollo/react-hooks'
import * as fb from '../../public/images/fb-icon.png'
import {withRouter} from 'react-router-dom'
import Button from './utils/Button'
import {useAuth} from '../components/utils/AuthProvider'
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

const FaceookSignIn = (props) => {
  const {login} = useAuth()
  const appId = '187856148967924'
  const redirectUrl = `${document.location.protocol}//${document.location.host}/auth/facebook-callback`
  const code = (document.location.pathname === '/auth/facebook-callback') ? querystring.parse(document.location.search)['?code'] : null
  const [callFacebook, {client, data, loading, error, called}] = useMutation(FACEBOOK_SIGN_IN, {
    onCompleted: ({facebookSignIn})=> login(facebookSignIn),
    onError: (err=>console.log(err))
  })
  React.useEffect(()=>{
    if(code && !called) callFacebook({variables: {code: code}})
  }, [])

  
  
  const handleClick = e => {
    e.preventDefault()
    window.location.href = `https://www.facebook.com/v2.9/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUrl)}`;
  }

  return (
    <a className="login-options__link" href='/auth/facebook-login' onClick={handleClick}>
      {loading ? <Button text='' loading={loading} handler={null} /> : <img className="social-link__icon" src={fb.default} id="facebook" /> }
    </a>
  )
}

export default FaceookSignIn
//export default withRouter(FaceookSignIn)