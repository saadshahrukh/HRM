import React from 'react'
import WelcomeContainer from './components/WelcomeContainer'
import CreateOptions from './components/CreateOptions'
import LatestInterviewsList from './components/LatestInterviewsList'
import PdfOcrUploader from './components/PdfOcrUploader'

const Dashboard = () => {
  return (
   
   <div >
   
    <h2 className='text-xl font-semibold py-5 ' >Dashboard</h2>
    <CreateOptions />
    <LatestInterviewsList />

    <div>
      <PdfOcrUploader   
      
      />
    </div>
    </div>
    
  )
}

export default Dashboard