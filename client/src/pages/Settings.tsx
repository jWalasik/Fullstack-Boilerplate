import * as React from 'react'
import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { GET_USER } from '../apollo/queries'
import { CHANGE_PASSWORD } from '../apollo/mutations'

const Settings = () => {
  const {client, loading, data} = useQuery(GET_USER)
  const [submitPassword, {}] = useMutation(CHANGE_PASSWORD)
  const [currentPass, setCurrPass] = useState(),
        [newPass, setNewPass] = useState();

  const handleSubmit = (e) => {
    e.preventDefault()    
    submitPassword({variables: {currentPass, newPass}})
  }

  return (
    <main>
      <h1>Settings</h1>

      <div className="user profile">
        <h2>{data && data.user.name} Profile</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={currentPass}
          onChange={(e)=> setCurrPass(e.target.value)}
          className="" 
          type="password" 
          required 
          name="currentPassword" 
          placeholder="Current Password" 
        />

        <input
          value={newPass}
          onChange={(e)=> setNewPass(e.target.value)}
          className="" 
          type="password" 
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