import React from 'react'
import Small from '../Headings/Small'
import Medium from '../Headings/Medium'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <div className='w-full px-5 py-4 mt-0 mb-5 top-0 flex flex-row justify-between items-center border-muted border-b'>
        <Medium clickHandler={() => {navigate('/')}}>Version</Medium>
        <div className='w-1/2 max-w-[500px] flex flex-row justify-evenly'>
            <Small color='muted'>projects</Small>
            <Small color='muted'>teams</Small>
            <Small color='muted'>signin</Small>
        </div>
    </div>
  )
}

export default Navbar