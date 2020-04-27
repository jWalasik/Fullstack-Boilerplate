import * as React from 'react'
import {useQuery} from '@apollo/react-hooks'
import {GET_USER} from '../apollo/queries'

const Home = () => {
  const {client, loading, data} = useQuery(GET_USER)
  console.log('home',loading, data)

  return (
    <main>
      <h1>Home</h1>
      <p>Welcome {data.name || data.email}</p>
    </main>
  )
}

export default Home