'use client'

import { memo } from 'react'
import { Loader2 } from 'lucide-react'

interface FastLoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

const FastLoading = memo(function FastLoading({ 
  size = 'md', 
  text = 'Carregando...', 
  className = '' 
}: FastLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex flex-col items-center justify-center py-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-blue-500 animate-spin mb-2`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )
})

export default FastLoading
