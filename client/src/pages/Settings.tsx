import * as React from 'react'
import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {GET_USER} from '../apollo/queries'
import {CHANGE_PASSWORD} from '../apollo/mutations'

const Settings = () => {
  const {client, loading, data} = useQuery(GET_USER)
  console.log(data)
  const [submitPassword, {}] = useMutation(CHANGE_PASSWORD)
  //console.log(data.currentUser)
  const [currentPass, setCurrPass] = useState(),
        [newPass, setNewPass] = useState();

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(currentPass, newPass)
    const user = data.currentUser.name
    submitPassword({variables: {user, currentPass, newPass}})
  }
//$2b$12$iLOCo.u3Jzk/Jn50Mkq7veCr9kgTYpaePcFHXztypCMyA3U0vrJG6
//$2b$12$iLOCo.u3Jzk/Jn50Mkq7veCr9kgTYpaePcFHXztypCMyA3U0vrJG6
  return (
    <main>
      <h1>Settings</h1>

      <div className="user profile">
        <h2>{data.currentUser && data.currentUser.name} Profile</h2>
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