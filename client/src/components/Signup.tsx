import * as React from "react";
import {useState} from 'react'
import { SIGNUP } from '../apollo/mutations'
import { useMutation } from "@apollo/react-hooks";
import MessageDisplay from "./utils/MessageDisplay";
import Button from "./utils/Button";
import Tooltip from "./utils/Tooltip";

const Signup = (props) => {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState({
    type: undefined,
    text: undefined
  })
  const [singup, {data, loading, called }] = useMutation(SIGNUP, {
    onCompleted:({signup})=>setMessage(signup), 
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
    singup({variables: {email,password,name}})
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}> 
      <h1 className="login-header">Sign Up</h1>
      
      <div className="input-field">
        <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
        <input
          value={name}
          onChange={(e)=> setName(e.target.value)}
          className="login-input" 
          type="text"  
          name="user" 
          placeholder="Username *" 
        />
        <Tooltip text={'This field is optional'} />
      </div>  
      
      <div className="input-field">
        <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
        <input 
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          className="login-input" 
          type="email" 
          required 
          name="email" 
          placeholder="Email" 
        />
      </div>        
      
      <div className="input-field">
        <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png" />
        <input 
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          className="login-input" 
          type="password"
          pattern=".{8,}"
          required 
          name="password" 
          placeholder="Password **" 
        />
        <Tooltip text={'Has to be at least 8 characters'} />
      </div>
      
      <p className="form-info">* - optional</p>
      <p className="form-info">** - at least 8 characters</p>
      
      <MessageDisplay message={message} />

      <div className="form-buttons">          
        <Button text={'SIGNUP'} handler={undefined} loading={loading} />

        <p className="login password_reminder" onClick={()=>props.handler('login')} >Already have account?</p>
        
      </div>       
    </form>
  );
  
}

export default Signup