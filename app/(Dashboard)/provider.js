import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import AppSidebar from './dashboard/components/AppSidebar'
import WelcomeContainer from './dashboard/components/WelcomeContainer'

function Dashboardprovider({children}) {
  return (
    <div className='bg-accent' >
    <SidebarProvider >
        <AppSidebar />
        {/* <SidebarTrigger /> */}
        
     <div className='w-full p-5 ' >  
       <WelcomeContainer />  
        {children}
        </div>
    </SidebarProvider>  
    </div>
  )
}

export default Dashboardprovider