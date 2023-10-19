import React from 'react'

const Label = (props) => {
  return (
    <span className={`${props.block && 'block'} font-semibold m-3`}>{props.children}</span>
  )
}

export default Label