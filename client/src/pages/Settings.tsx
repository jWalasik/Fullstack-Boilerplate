import * as React from 'react'
import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { CHANGE_PASSWORD } from '../apollo/mutations'
import Tooltip from '../components/utils/Tooltip'
import MessageDisplay from '../components/utils/MessageDisplay'
import Button from '../components/utils/Button'

const Settings = () => {
  const [message, setMessage] = useState({
    type: undefined,
    text: undefined
  })
  
  const [changePassword, {data, loading, called }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: ({changePassword})=> setMessage(changePassword),
    onError: (err)=> {
      err.graphQLErrors.map(({message}, i) => {
        setMessage({
          type: 'Error',
          text: message
        })
      })
    }
  })
  const [currentPass, setCurrPass] = useState(''),
        [newPass, setNewPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()    
    changePassword({variables: {currentPass, newPass}})
  }

  return (
    <main>
      <h1>Settings</h1>
      
      <div className="user profile">
        <h2>Profile</h2>
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
        <Tooltip text='If you logged in with social network leave this field empty' />

        <input
          value={newPass}
          onChange={(e)=> setNewPass(e.target.value)}
          className="" 
          type="password" 
          required 
          name="newPassword" 
          placeholder="New Password" 
        />

        <MessageDisplay message={message} />

        <Button text={'Change Password'} loading={loading} handler={undefined} />
      </form>
    </main>
  )
}

export default Settings