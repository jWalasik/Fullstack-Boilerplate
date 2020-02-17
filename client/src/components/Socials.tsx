import * as React from 'react'

import {gql} from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'

import * as google from '../../public/images/google-icon.png'
import * as fb from '../../public/images/fb-icon.png'
import * as twitter from '../../public/images/twitter-icon.png'

const _socialAuth = gql`
  mutation socialAuth($provider: String!) {
    socialAuth(provider: $provider) {
      token
      email
    }
  }
`

const Socials = () => {
  const [useAuth, {data}] = useMutation(_socialAuth)

  const handleClick = (e) => {
    e.preventDefault()
    const provider= e.target.id
    console.log(provider)

    useAuth({variables: {provider}})
  }
  return (
    <div>
      <div id="fb-root"></div>

      <ul className="login-options">
            <li>
              <a className="login-options__link" onClick={handleClick}>
                <img className="social-link__icon" src={fb.default} id="facebook" />
              </a>
            </li>

            <li id="google" onClick={handleClick}>
              <a className="login-options__link" >
                <img className="social-link__icon" src={google.default} id="google" />
              </a>
            </li>

            <li>
              <a className="login-options__link" id="twitter" onClick={handleClick}>
                <img className="social-link__icon" src={twitter.default}  id="twitter" />
              </a>
            </li>
          </ul>
    </div>
    
  )
}

export default Socials