import * as React from "react";
import {useState} from 'react'
import { SIGNUP } from '../apollo/mutations'
import { useMutation } from "@apollo/react-hooks";

const Signup = (props) => {
  const [password, setPassword] = useState()
  const [email, setEmail] = useState()
  const [name, setName] = useState()

  const [submitSingup, {data}] = useMutation(SIGNUP)

  const handleSubmit = e => {
    e.preventDefault()
    submitSingup({variables: {email,password,name}}).then(res=>{
      console.log('signup form submitted', res)
      window.location.reload()
    })
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
      </div>
      
      <p className="form-info">* - optional</p>
      <p className="form-info">** - at least 8 characters</p>
      
      <div className="form-buttons">          
        <button className="login-button">Sign Up</button>

        <p className="login password_reminder" onClick={()=>props.handler('login')} >Already have account?</p>
        
      </div>       
    </form>
  );
  
}

export default Signup