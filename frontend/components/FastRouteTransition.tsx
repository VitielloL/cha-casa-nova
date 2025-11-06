'use client'

import { ReactNode, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface FastRouteTransitionProps {
  children: ReactNode
}

export default function FastRouteTransition({ children }: FastRouteTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    
    // Transição muito rápida
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 50) // Apenas 50ms

    return () => clearTimeout(timer)
  }, [pathname])

  if (isTransitioning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
