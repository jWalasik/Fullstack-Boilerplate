import * as React from 'react'
import { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import {GET_USER} from '../apollo/queries'
import {CHANGE_PASSWORD} from '../apollo/mutations'

const Settings = () => {
  const {client, loading, data} = useQuery(GET_USER)
  console.log(data.currentUser)
  const [currentPass, setCurrPass] = useState(),
        [newPass, setNewPass] = useState();

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(currentPass, newPass)
  }

  return (
    <main>
      <h1>Settings</h1>

      <div className="user profile">
        <h2>{data.currentUser.name} Profile</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={currentPass}
          onChange={(e)=> setCurrPass(e.target.value)}
          className="" 
          type="text" 
          required 
          name="currentPassword" 
          placeholder="Current Password" 
        />

        <input
          value={newPass}
          onChange={(e)=> setNewPass(e.target.value)}
          className="" 
          type="text" 
          required 
          name="newPassword" 
          placeholder="New Password" 
        />

        <button>Change Password</button>
      </form>
    </main>
  )
}

export default Settings