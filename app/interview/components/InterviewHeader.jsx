import Image from 'next/image'
import React from 'react'

const InterviewHeader = () => {
  return (
    <div className='p-4 shadow' >
        <Image 
        src={"/logo.png"}
        width={90}
        height={90}
        className='w-[140px]'
        alt='logo'
         />
    </div>
  )
}

export default InterviewHeader