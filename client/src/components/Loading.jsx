import React from 'react'
import loading from "../assets/images/loading.svg"

const Loading = () => {
  return (
    <div className='flex justify-center items-center w-full h-96 mr-20'>
        <img src={loading} alt="loading" className='w-24 h-24' />
    </div>
  )
}

export default Loading;