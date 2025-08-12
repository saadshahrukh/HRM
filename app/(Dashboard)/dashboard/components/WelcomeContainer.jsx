"use client"

import { useUser } from '@/app/Provider'
import React from 'react'

const WelcomeContainer = () => {

    const {user} = useUser()

  return (
    <div>
      <div className="p-5 bg-white rounded-2xl mt-4 " >
        <h2 className="text-xl text-sprimary font-bold" >Welcome , {user?.name || "N/A"}</h2>
        <h2 className='text-gray-400 text-sm' >AI-Driven Interviews, Hassle Free Hiring Process</h2>
      </div>
    </div>
  )
}

export default WelcomeContainer