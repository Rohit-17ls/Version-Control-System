import React from 'react'

const BranchIcon = ({width, height, strokeWidth}) => {
  return (
    <svg
        width={width || "22px"}
        height={height || "22px"}
        viewBox="0 0 16 16"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth || "1.5"}
        className='hover:opacity-90 inline mx-1'
    >
    <circle cx="4.5" cy="3.5" r="1.75" />
    <circle cx="11.5" cy="3.5" r="1.75" />
    <circle cx="4.5" cy="12.5" r="1.75" />
    <path d="m5.25 8.25c3 0 6 .5 6-2.5m-6.5 4.5v-4.5" />
  </svg>
  )
}

export default BranchIcon