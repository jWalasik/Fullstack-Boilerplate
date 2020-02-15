import * as React from 'react';
import {useState} from 'react'
import {gql} from 'apollo-boost'
import {useMutation} from '@apollo/react-hooks'

const _login = gql`
mutation login($login: String!, $password: String!) {
  login(email: $login, password: $password) {
    email
    _id
    isActive
    token
  }
}
`

const Login = () => {
  const [password, setPassword] = useState()
  const [login, setLogin] = useState() 

  const [submitLogin, {data}] = useMutation(_login)

  const handleSubmit = e => {
    e.preventDefault()
    submitLogin({variables: {login, password}})
      .then(res=> {
        console.log(res)
        //use token & redirect
      })
      .catch(err=>console.log)
  }
  return (
    <form className="login-form"
      onSubmit={handleSubmit}
    >
      <h1 className="login-header">Login to your account</h1>
      
      <ul className="login-options">
        <li><a className="login-options__link" href="/auth/facebook">
          Facebook 
        </a></li>
        <li><a className="login-options__link"  href="/auth/google">Google</a></li>
        <li><a className="login-options__link"  href="/auth/google">Twitter</a></li>
      </ul>
      
      <div className="input-field">
        <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
        <input
          value={login}
          onChange={(e)=> setLogin(e.target.value)}
          className="login-input" 
          type="email" 
          required 
          name="login" 
          placeholder="Login/Email" 
        />
      </div>        
      
      <div className="input-field">
        <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png" />
        <input
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="login-input" 
          type="password" 
          required 
          name="password" 
          placeholder="Password" 
        />
      </div>
      
      <div className="form-buttons">          
        <button className="login-button">LOG IN</button>
        <p className="login password_reminder">Forgot Password?</p>
      </div>         
    </form>
  );
}

  

export default Login