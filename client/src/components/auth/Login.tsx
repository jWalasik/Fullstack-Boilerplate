import * as React from "react";

class LoginContainer extends React.Component {
  render() {
    return (
      <form className="login-form">
        <h1 className="login-header">Login to your account</h1>
        
        <ul className="login-options">
          <li><a className="login-options__link" href="/auth/facebook">
            <img 
              src={''}
            />  
          </a></li>
          <li><a className="login-options__link"  href="/auth/google">Google</a></li>
          <li><a className="login-options__link"  href="/auth/google">Twitter</a></li>
        </ul>
        
        <div className="input-field">
          <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png" />
          <input 
            className="login-input" 
            type="login" 
            required 
            name="login" 
            placeholder="Login/Email" 
          />
        </div>        
        
        <div className="input-field">
          <img className="input-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png" />
          <input 
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
}

export default LoginContainer