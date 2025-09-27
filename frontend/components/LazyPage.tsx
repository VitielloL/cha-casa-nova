'use client'

import { Suspense, lazy, ComponentType } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface LazyPageProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function LazyPage({ 
  children, 
  fallback = <LoadingSpinner text="Carregando página..." /> 
}: LazyPageProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}

// Função helper para lazy loading de componentes
export function withLazyLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc)
  
  return function LazyWrapper(props: any) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}
