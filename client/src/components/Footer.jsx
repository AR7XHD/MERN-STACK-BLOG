import React from 'react'

const Footer = ({ className }) => {
  return (
    <footer className={`w-full bg-white p-4 text-sm text-gray-500 flex items-center justify-center ${className}`}>
      <p> {new Date().getFullYear()} MERN Blog. All rights reserved.</p>
    </footer>
  )
}

export default Footer 