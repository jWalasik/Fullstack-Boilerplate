import * as React from 'react';
import {useState} from 'react'
import { withRouter, useHistory } from "react-router-dom";
import {gql} from 'apollo-boost'
import {useMutation, useApolloClient} from '@apollo/react-hooks'
import Socials from './Socials'
import Button from './utils/Button'
import MessageDisplay from './utils/MessageDisplay'

const _login = gql`
  mutation login($login: String!, $password: String!) {
    login(user: $login, password: $password) {
      name
      email
      _id
      isActive
      accessToken
    }
  }
`

const Login = (props) => {
  const [password, setPassword] = useState('')
  const [login, setLogin] = useState('')
  const [message, setMessage] = useState({
    type: undefined,
    text: undefined
  })

  const [submitLogin, {client, data, loading}] = useMutation(_login, {
    onError: (err)=> {
      err.graphQLErrors.map(({message}, i) => {
        setMessage({
          type: 'Error',
          text: message
        })
      })
    }
  })

  const handleSubmit = e => {
    e.preventDefault()

    submitLogin({variables: {login, password}})
      .then(payload => {
        const {name, email, accessToken} = payload.data.login
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
        //history.push('/')
      })
      .catch(err=>console.log(err))
  }
  return (
    <form className="login-form"
      onSubmit={handleSubmit}
    >
      <h1 className="login-header">Login to your account</h1>
      <p className="login-header breaker">or</p>
      <p className="login-header signup" onClick={()=>props.history.push('/auth/signup')}>Register new user</p>

      <Socials />
      <div className="input-field">
        <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
        <input
          value={login}
          onChange={(e)=> setLogin(e.target.value)}
          className="login-input" 
          type="text" 
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

      <MessageDisplay message={message} />
      
      <div className="form-buttons">
        <Button text={'LOG IN'} handler={undefined} loading={loading} />
        
        <p className="login password_reminder" onClick={()=>props.history.push('/auth/reset')}>Forgot Password?</p>
      </div>         
    </form>
  );
}

  

export default withRouter(Login)