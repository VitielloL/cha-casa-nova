'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface StableLoadingProps {
  loading: boolean
  delay?: number
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function StableLoading({ 
  loading,
  delay = 200, 
  children, 
  fallback = (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
      <p className="text-sm text-gray-600">Carregando...</p>
    </div>
  )
}: StableLoadingProps) {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowLoading(true)
      }, delay)

      return () => clearTimeout(timer)
    } else {
      setShowLoading(false)
    }
  }, [loading, delay])

  if (!loading || !showLoading) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

// Hook para loading estável
export function useStableLoading(loading: boolean, delay: number = 200) {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowLoading(true)
      }, delay)

      return () => clearTimeout(timer)
    } else {
      setShowLoading(false)
    }
  }, [loading, delay])

  return showLoading
}
