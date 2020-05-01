import * as React from "react";
import {useState} from 'react'
import { useMutation } from '@apollo/react-hooks'

import { RESET_PASSWORD } from '../apollo/mutations'

const Reset = (props) => {
  const [email, setEmail] = useState('')
  const [resetPassword, x] = useMutation(RESET_PASSWORD)

  const handleSubmit = e => {
    e.preventDefault()
    resetPassword({variables: {email}}).then(res=>{
      console.log(res)
    }).catch(e=>console.log(e))
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
    
    
    <div className="form-buttons">          
      <button className="login-button">Reset Password</button>
      <p className="login password_reminder" onClick={()=>props.handler('login')} >Cancel</p>
    </div>       
  </form>
)};


export default Reset