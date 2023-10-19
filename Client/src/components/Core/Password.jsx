import React, {useState} from 'react'
import PasswordEyeIcon from '../Icons/PasswordEyeIcon';

const Password = ({name, value, placeholder, changeHandler}) => {

    const [view, setView] = useState(false);

  return (
    <div className=''>
        <input className='w-full border-muted border-1 bg-transparent outline-none p-2 rounded-lg hover'
           name={name}
           value={value}
           type={view ? 'text' : 'password'}
           placeholder={placeholder}
           onChange={changeHandler}/>
        <span className='relative w-[50px] top-[-30px] left-[350px]'>
            <PasswordEyeIcon fill={view ? '#df1111' : 'white'} clickHandler={() => {setView(!view)}}/>
        </span>
    </div>

  )
}

export default Password