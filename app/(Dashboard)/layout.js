import React from 'react'
import Dashboardprovider from './provider'
import { Toaster } from 'sonner'

function Dashboardlayout({children}) {
  return (
    <div >
        <Dashboardprovider >
        {children}
        <Toaster />
        </Dashboardprovider>
        </div>
  )
}

export default Dashboardlayout