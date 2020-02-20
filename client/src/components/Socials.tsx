import * as React from 'react'

import {gql} from 'apollo-boost'

import * as google from '../../public/images/google-icon.png'
import * as fb from '../../public/images/fb-icon.png'
import * as twitter from '../../public/images/twitter-icon.png'

const Socials = () => {

  return (
    <div>
      <ul className="login-options">
        <li>          
          <a className="login-options__link" href="/auth/facebook">
            <img className="social-link__icon" src={fb.default} id="facebook" />
          </a>
        </li>

        <li>
          <a className="login-options__link" href="/auth/google">
            <img className="social-link__icon" src={google.default} id="google" />
          </a>
        </li>

        <li>
          <a className="login-options__link" href="/auth/twitter">
            <img className="social-link__icon" src={twitter.default}  id="twitter" />
          </a>
        </li>
      </ul>
    </div>
    
  )
}

export default Socials