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

const Auth = () => {
  const [display, setDisplay] = useState('login')
  let Display = Map[display]
  const changeDisplay = (e) => {
    console.log(e)
    setDisplay(e)
  }

  return (
    <main>    
      <Display handler={changeDisplay}/>
    </main>
  )
}

export default Auth