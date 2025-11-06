'use client'

import { ReactNode, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface BlurLoadingProps {
  loading: boolean
  children: ReactNode
  className?: string
}

export default function BlurLoading({ loading, children, className = '' }: BlurLoadingProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Conteúdo principal */}
      <div className={`transition-all duration-300 ${loading ? 'blur-sm opacity-60' : 'blur-none opacity-100'}`}>
        {children}
      </div>
      
      {/* Overlay de loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">Carregando...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook para gerenciar loading com blur
export function useBlurLoading(initialLoading = true) {
  const [loading, setLoading] = useState(initialLoading)
  
  const setLoadingWithDelay = (isLoading: boolean, delay = 100) => {
    if (isLoading) {
      setLoading(true)
    } else {
      // Pequeno delay para suavizar a transição
      setTimeout(() => setLoading(false), delay)
    }
  }
  
  return { loading, setLoading: setLoadingWithDelay }
}
