import React from 'react'

const HomePageIconVersionControl = ({width, height, strokeWidth}) => {
  return (
    <svg
    width={width || "32px"}
    height={height || "32px"}
    viewBox="0 0 24 24"
    fill="white"
  >
    <path
      d="M6.5 8C7.88071 8 9 6.88071 9 5.5C9 4.11929 7.88071 3 6.5 3C5.11929 3 4 4.11929 4 5.5C4 6.88071 5.11929 8 6.5 8ZM6.5 8V16M6.5 16C5.11929 16 4 17.1193 4 18.5C4 19.8807 5.11929 21 6.5 21C7.88071 21 9 19.8807 9 18.5C9 17.1193 7.88071 16 6.5 16ZM17.5 16V12M17.5 16C18.8807 16 20 17.1193 20 18.5C20 19.8807 18.8807 21 17.5 21C16.1193 21 15 19.8807 15 18.5C15 17.1193 16.1193 16 17.5 16ZM20 3L15 8M15 3L20 8"
      stroke="#ffffff"
      strokeWidth={strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  )
}

export default HomePageIconVersionControl