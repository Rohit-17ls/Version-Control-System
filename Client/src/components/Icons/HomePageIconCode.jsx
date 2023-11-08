import React from 'react'

const HomePageIconCode = ({width, height, strokeWidth}) => {
  return (
    <svg
    width={width || "800px"}
    height={height || "800px"}
    viewBox='0 0 24 24'
    className='fill-none'
    >
    <path
      d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20"
      stroke="#ffffff"
      className='bg-none'
      strokeWidth={strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  )
}

export default HomePageIconCode