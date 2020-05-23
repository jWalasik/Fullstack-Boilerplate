import * as React from 'react'

const Auth = (props) => {
  console.log(props)
  return (
    <main>
      {props.children}
    </main>
  )
}

export default Auth