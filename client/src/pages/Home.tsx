import * as React from 'react'
import {useQuery} from '@apollo/react-hooks'
import {GET_USER} from '../apollo/queries'
import Loader from './Loader'

const Home = (props) => {
  //const {client, loading, data} = useQuery(GET_USER)
  return (
    <main>
      <h1>Home</h1>
      {/* {loading ? <Loader /> :<p>Welcome {data.user.name || data.user.email}</p>} */}
    </main>
  )
}

export default Home