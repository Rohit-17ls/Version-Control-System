import React from 'react'

const Mute = (props) => {
  return (
    <div className = {`text-muted ${props.block === undefined && 'inline'}`}>{props.children}</div>
  )
}

export default Mute