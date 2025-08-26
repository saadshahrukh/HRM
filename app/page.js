"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

function Home() {
  redirect('/auth')
}

export default Home