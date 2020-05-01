import * as React from 'react'
import {useQuery} from '@apollo/react-hooks'
import {GET_USER} from '../apollo/queries'

const Home = () => {
  const {client, loading, data} = useQuery(GET_USER)
  return (
    <main>
      <h1>Home</h1>
      {loading ? null :<p>Welcome {data.user.name || data.user.email}</p>}
    </main>
  )
}

export default Home