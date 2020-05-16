import * as React from 'react'

const Button = ({text, loading, handler}) => {
  return (
    <button 
      onClick={handler}
      className={loading ? 'button-spinner active' : 'button-spinner' }
    >
      {loading ? null : text}
    </button>
  )
}

export default Button