import React from 'react'

const Medium = (props) => {
  return (
    <strong className={`text-3xl m-3 block ${props.color !== undefined && 'text-'.concat(props.color)}  ${props.className}`}
            onClick={props.clickHandler}>
      {props.children}
    </strong>
  )
}

export default Medium