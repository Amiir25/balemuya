import Header from '@/components/header/Header'
import React, { ReactNode, Suspense } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div>
        <Suspense>
          <Header/>
        </Suspense>
        {children}
    </div>
  )
}
