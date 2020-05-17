import * as React from "react"
import {withRouter} from 'react-router-dom'
import {useState} from 'react'
import { useMutation } from '@apollo/react-hooks'

import { SET_PASSWORD } from '../apollo/mutations'
import MessageDisplay from "../components/utils/MessageDisplay"

const SetPassword = (props) => {
  const [newPassword, setNewPass] = useState('')
  const [confimation, setConfirmation] = useState('')
  const [setPassword, {data, loading}] = useMutation(SET_PASSWORD, {
    onCompleted: ({setPassword}) => setMessage(setPassword),
    onError: (err)=>{
      err.graphQLErrors.map(({message}, i) => {
        setMessage({
          type: 'Error',
          text: message
        })
      })
    }
  })

  const resetToken = window.location.href.split('reset')[1]

  const [message, setMessage] = useState({
    type: undefined,
    text: undefined
  })

  const handleSubmit = e => {
    e.preventDefault()
    if(newPassword !== confimation) {
      setMessage({
        type: 'Error',
        text: 'Passwords not matching'
      })
      return
    }
    setPassword({variables: {newPassword, resetToken}})
  }

  return (
    <main>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-header">Set New Password</h1>    
        
        <div className="input-field">
          <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
          <input 
            value={newPassword}
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

        <MessageDisplay message={message} />
        
        <div className="form-buttons">          
          <button className="login-button">Set Password</button>
          <p className="login password_reminder" onClick={()=>props.history.push('/')} >Cancel</p>
        </div>       
      </form>    
    </main>  
  )
}

export default withRouter(SetPassword)