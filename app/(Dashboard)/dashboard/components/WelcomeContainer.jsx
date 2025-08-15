"use client"

import { useUser } from '@/app/Provider'
import Image from 'next/image'
import React from 'react'

const WelcomeContainer = () => {

    const {user} = useUser()

  return (
    <div className='p-5 bg-white rounded-2xl mt-4  flex justify-between ' >
      <div className="mt-2" >
        <h2 className="text-xl text-sprimary font-bold" >Welcome , {user?.name || "N/A"}</h2>
        <h2 className='text-gray-400 text-sm' >AI-Driven Interviews, Hassle Free Hiring Process</h2>
      </div>
   {user&& <Image 
      
      width={40}
      height={40}
      alt='Avatar'
      src={user?.picture}
      className='rounded-full w-15 h-15'
      />
   }
    </div>
  )
}

export default WelcomeContainer