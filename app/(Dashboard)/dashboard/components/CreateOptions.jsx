import { Camera, Phone, Video } from 'lucide-react'
import React from 'react'

const CreateOptions = () => {
  return (
    <div className='grid grid-cols-2 gap-5 ' > 
      <div className='bg-white border border-gray-200 rounded-lg p-5 ' >
    <Video className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12' /> 
     <h2 className='py-3 text-xl font-bold' >Create New Interview</h2>
      </div>
      <div className='bg-white border border-gray-200 rounded-lg p-5 '>
     < Phone className='p-3 text-primary bg-blue-50 rounded-lg h-10 w-10' />
     <h2 className='py-3 text-xl font-bold' >Phone Screening</h2>
      </div>
    </div>
  )
}

export default CreateOptions