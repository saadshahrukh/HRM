import React from 'react'
import WelcomeContainer from './components/WelcomeContainer'
import CreateOptions from './components/CreateOptions'
import LatestInterviewsList from './components/LatestInterviewsList'

const Dashboard = () => {
  return (
    <div >
   
    <h2 className='text-xl font-semibold py-5 ' >Dashboard</h2>
    <CreateOptions />
    <LatestInterviewsList />
    </div>
    
  )
}

export default Dashboard