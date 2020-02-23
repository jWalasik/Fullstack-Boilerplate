import * as React from "react";

const Reset = (props) => (
  <form className="login-form">
    <h1 className="login-header">Reset Password</h1>    
    
    <div className="input-field">
      <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
      <input 
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
);


export default Reset