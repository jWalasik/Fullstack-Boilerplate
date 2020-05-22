import * as React from 'react'
import { useEffect } from 'react'
import {useMutation} from '@apollo/react-hooks'
import { REFRESH_TOKEN } from '../apollo/mutations'

let tried = false
const RefreshHandler = () => {
  const [refreshToken, {client, data, loading, called}] = useMutation(REFRESH_TOKEN, {
    onCompleted: ({refreshToken})=> {
      console.log(refreshToken)
    }})

  useEffect(()=>{
    console.log('refresher', tried)
    refreshToken()
    tried = true
  },[])
  return loading ? (<p>checking user session</p>) : (<p>user not logged in</p>)
}

export default RefreshHandler