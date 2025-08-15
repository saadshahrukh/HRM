import React, { useState } from 'react'
import InterviewHeader from './components/InterviewHeader'
import { Toaster } from 'sonner'
import { InterviewDataContext } from '@/context/InterviewDataContext'

const InterviewLayout = ({children}) => {
    const [interviewInfo , setInterviewInfo] = useState() 
  return (
    <InterviewDataContext.Provider  value={{interviewInfo , setInterviewInfo}} >
    <div className='bg-secondary ' >
        <InterviewHeader />
        {children}
        <Toaster position="bottom-right" richColors />
    </div>
    </InterviewDataContext.Provider>
  )
}

export default InterviewLayout