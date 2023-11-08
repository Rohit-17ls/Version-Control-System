import React from 'react'

const Small = (props) => {
  return (
    <span className={`text-md m-2 font-semibold block ${props.color !== undefined && 'text-'.concat(props.color)} ${props.className}`}
          onClick={props.onClick}>
        {props.children}
      </span>
  )
}

export default Small