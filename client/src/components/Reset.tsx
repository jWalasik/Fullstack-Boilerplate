import * as React from "react";
import {withRouter} from 'react-router-dom'
import {useState} from 'react'
import { useMutation } from '@apollo/react-hooks'
import Button from './utils/Button'
import { RESET_PASSWORD } from '../apollo/mutations'
import MessageDisplay from "./utils/MessageDisplay";

const Reset = (props) => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState({
    type: undefined,
    text: undefined
  })
  const [resetPassword, {data, loading}] = useMutation(RESET_PASSWORD, {
    onCompleted: ({resetPassword})=> setMessage(resetPassword),
    onError: (err)=>{
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
    resetPassword({variables: {email}})
  }

  return (
  <form className="login-form" onSubmit={handleSubmit}>
    <h1 className="login-header">Reset Password</h1>    
    
    <div className="input-field">
      <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
      <input 
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="login-input" 
        type="email" 
        required 
        name="email" 
        placeholder="Email" 
      />
    </div>        
    
    <MessageDisplay message={message} />
    
    <div className="form-buttons">
      <Button text={'Reset Password'} loading={loading} handler={null} />
      <p className="login password_reminder" onClick={()=>props.history.push('/auth/login')} >Cancel</p>
    </div>       
  </form>
)};


export default withRouter(Reset)