'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Componente para prefetching agressivo de rotas
export default function RoutePrefetcher() {
  const router = useRouter()

  useEffect(() => {
    // Prefetch das rotas mais comuns
    const routesToPrefetch = [
      '/lojas',
      '/sobre-nos',
      '/item-surpresa',
      '/itens-surpresa',
      '/login',
      '/admin',
      '/cadastro'
    ]

    // Prefetch com delay para não sobrecarregar
    const prefetchRoutes = () => {
      routesToPrefetch.forEach((route, index) => {
        setTimeout(() => {
          router.prefetch(route)
        }, index * 100) // 100ms entre cada prefetch
      })
    }

    // Prefetch após 1 segundo
    const timer = setTimeout(prefetchRoutes, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return null // Componente invisível
}
