import React from 'react'

const Input = ({name, value, placeholder, error, className, changeHandler, inputRef, autoComplete}) => {
  return (
    <input className={`w-full border-1 bg-transparent outline-none p-2 rounded-lg hover ${error === undefined || !error ? 'border-muted' :  'border-error'} ${className}`}
           name={name}
           spellCheck={"false"}
           value={value}
           placeholder={placeholder}
           onChange={changeHandler}
           autoComplete={autoComplete}
           ref={inputRef}
           />

  )
}

export default Input