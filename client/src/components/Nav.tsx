import * as React from "react";
import { Link } from "react-router-dom";

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <header>
    <nav>
      <ul style={{ listStyleType: "none" }}>
        <li style={{ display: "inline", marginRight: 20 }}>
          <Link to="/">Home</Link>
        </li>
        <li style={{ display: "inline", marginRight: 20 }}>
          <Link to="/settings">Settings</Link>
        </li>
        <li style={{ display: "inline", marginRight: 20 }}>
          <Link to="/shop-list">Shopping List</Link>
        </li>
        <li style={{ display: "inline" }}>
          <button onClick={()=>localStorage.removeItem("token")}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  </header>
);

export default Header;