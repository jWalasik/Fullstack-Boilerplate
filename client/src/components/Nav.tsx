import * as React from "react";
import { Link } from "react-router-dom";
import { LOGOUT } from "../apollo/mutations";
import { useQuery,useMutation, useApolloClient } from "@apollo/react-hooks";

const Header = (props) => {
  const [logout, {data}] = useMutation(LOGOUT)
  const client = useApolloClient()
  const handleLogout = (e) => {
    localStorage.removeItem('token')
    logout().then(res=> client.resetStore())
  }
  return (
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
            <button onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;