'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface RouteTransitionProps {
  children: React.ReactNode
}

export default function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsTransitioning(true)
      
      // Simular transição rápida
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentPath(pathname)
      }, 150) // Transição muito rápida

      return () => clearTimeout(timer)
    }
  }, [pathname, currentPath])

  if (isTransitioning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Hook para detectar mudanças de rota
export function useRouteTransition() {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 100)
    return () => clearTimeout(timer)
  }, [pathname])

  return isTransitioning
}
