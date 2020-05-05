import * as React from "react";
import {useState} from 'react'
import { useMutation } from '@apollo/react-hooks'

import { NEW_PASSWORD } from '../apollo/mutations'

const SetPassword = (props) => {
  const [newPass, setNewPass] = useState('')
  const [confimation, setConfirmation] = useState('')
  const [setPassword, x] = useMutation(NEW_PASSWORD)
  const resetToken = window.location.href.split('reset')[1]
  
  const handleSubmit = e => {
    e.preventDefault()
    setPassword({variables: {newPass, resetToken}}).then(res=>{
      console.log(res)
    }).catch(e=>console.log(e))
  }

  return (
  <form className="login-form" onSubmit={handleSubmit}>
    <h1 className="login-header">Set New Password</h1>    
    
    <div className="input-field">
      <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
      <input 
        value={newPass}
        onChange={(e)=>setNewPass(e.target.value)}
        className="login-input" 
        type="text" 
        required 
        name="password" 
        placeholder="New Password" 
      />
    </div>

    <div className="input-field">
      <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
      <input 
        value={confimation}
        onChange={(e)=>setConfirmation(e.target.value)}
        className="login-input" 
        type="text" 
        required 
        name="confirmation" 
        placeholder="Confirm New Password" 
      />
    </div>    
    
    <div className="form-buttons">          
      <button className="login-button">Set Password</button>
      <p className="login password_reminder" onClick={()=>props.history.push('/')} >Cancel</p>
    </div>       
  </form>
)};


export default SetPassword