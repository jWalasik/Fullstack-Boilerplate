import * as React from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import Reset from '../components/Reset'
import {useState} from 'react'

const Map = {
  'login': Login,
  'signup': Signup,
  'reset': Reset
}

const Sign = () => {
  const [display, setDisplay] = useState('login')

  let Display = Map[display]
  return (
    <main>
      <button id='login' onClick={()=>setDisplay('login')}>Login</button>
      <button id='signup' onClick={()=>setDisplay('signup')}>Signup</button>
      <button id='reset' onClick={()=>setDisplay('reset')}>Reset</button>
      
      <Display />
    </main>
  )
}

export default Sign