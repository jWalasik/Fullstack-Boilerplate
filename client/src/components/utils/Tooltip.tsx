import * as React from 'react'

const Tooltip = ({text}) => {
  const [visibility, setVisibility] = React.useState('hidden')

  return (
    <div className="tooltip">
      i
      <span className="tooltip__box">{text}</span>
    </div>
)}

export default Tooltip