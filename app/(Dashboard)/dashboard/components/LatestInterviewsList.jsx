"use client"

import { Button } from '@/components/ui/button'
import { Camera, Plus, Smile } from 'lucide-react'
import Link from 'next/link'
import { Router } from 'next/router'
import React, { useState } from 'react'

const LatestInterviewsList = () => {
  const [interviewsList , setInterviewsList] = useState([])
  
  return (
    <div className='my-5' >
    <h2 className='text-xl font-semibold py-5 ' >Previously Created Interviews</h2>

{interviewsList?.length==0 && 
  <div className='flex flex-col gap-3 items-center bg-white mt-5 p-5'  >
    <Camera className='h-10 w-10 text-primary' />
    <h2 className='flex gap-2 p-4' >You Don't created any Interview Yet  </h2>
   <Link href={'dashboard/create-interview'} ><Button > <Plus/> Create New Interview  </Button> </Link> 


  </div>
 }

    </div>
  )
}

export default LatestInterviewsList