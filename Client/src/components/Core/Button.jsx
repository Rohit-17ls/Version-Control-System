import React from 'react'

const Button = ({clickHandler, className, children}) => {
  return (
    <button className={`block w-full mx-auto my-5 px-3 py-1 outline-none font-semibold bg-button rounded-xl ${className}`}
            type="button" 
            onClick={clickHandler}>{children}</button>
  )
}

export default Button