import React from 'react'

const Big = (props) => {
  return (
    <strong className={`text-5xl m-3 block text-fg-color ${props.className}`}>{props.children}</strong>
  )
}

export default Big