'use client'

import { ReactNode, useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface PageBlurLoadingProps {
  children: ReactNode
  initialDelay?: number
}

export default function PageBlurLoading({ 
  children, 
  initialDelay = 100 
}: PageBlurLoadingProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Pequeno delay para permitir renderização inicial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, initialDelay)

    return () => clearTimeout(timer)
  }, [initialDelay])

  return (
    <div className="relative min-h-screen">
      {/* Conteúdo principal */}
      <div className={`transition-all duration-500 ${
        isLoading 
          ? 'blur-sm opacity-70 scale-[0.98]' 
          : 'blur-none opacity-100 scale-100'
      }`}>
        {children}
      </div>
      
      {/* Overlay de loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
              <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Lista de Presentes
            </h2>
            <p className="text-sm text-gray-600">
              Carregando sua experiência...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
