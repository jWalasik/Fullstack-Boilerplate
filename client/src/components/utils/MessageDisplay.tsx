import * as React from 'react'

const MessageDisplay = ({message}) => {
  return (
    <div className={message.type === 'Error' ? 'message --error' : 'message'}>
      {message.text}
    </div>
  )
}

export default MessageDisplay