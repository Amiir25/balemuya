import Header from '@/components/header/Header'
import React, { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div>
        <Header/>
        {children}
    </div>
  )
}
