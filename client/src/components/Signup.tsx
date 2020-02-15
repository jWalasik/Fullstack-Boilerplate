import * as React from "react";

class SignupContainer extends React.Component {
  render() {
    return (
      <form className="login-form">
        <h1 className="login-header">Sign Up</h1>
        
        <div className="input-field">
          <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
          <input 
            className="login-input" 
            type="text"  
            name="user" 
            placeholder="Username *" 
          />
        </div>  
        
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
        
        <div className="input-field">
          <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png" />
          <input 
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
          <p className="login password_reminder">Already have account?</p>
        </div>       
      </form>
    );
  }
}

export default SignupContainer