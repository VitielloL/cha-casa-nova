import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { cache } from '@/lib/cache'

interface UseOptimizedQueryOptions {
  enabled?: boolean
  refetchOnMount?: boolean
  cacheKey?: string
  cacheTTL?: number // Time to live in milliseconds
}

// usando instância de cache compartilhada

export function useOptimizedQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  mockData: T,
  options: UseOptimizedQueryOptions = {}
) {
  const { 
    enabled = true, 
    refetchOnMount = true, 
    cacheKey = queryFn.toString(), 
    cacheTTL = 5 * 60 * 1000 // Default 5 minutes
  } = options

  const [data, setData] = useState<T | null>(() => cache.get(cacheKey) || mockData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const isMountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    if (!enabled || !isMountedRef.current) return

    setLoading(true)
    setError(null)

    try {
      const cachedData = cache.get(cacheKey)
      if (cachedData) {
        setData(cachedData as T)
        setLoading(false)
        // Fetch in background to update cache
        queryFn().then(result => {
          if (!isMountedRef.current) return
          if (!result.error && result.data) {
            cache.set(cacheKey, result.data, cacheTTL)
            setData(result.data)
          }
        })
        return
      }

      const result = await queryFn()
      
      if (!isMountedRef.current) return
      
      if (result.error) {
        throw result.error
      }
      
      setData(result.data)
      cache.set(cacheKey, result.data, cacheTTL)
    } catch (err) {
      if (!isMountedRef.current) return
      console.error('Erro na consulta otimizada:', err)
      setError(err)
      setData(mockData) // Fallback to mock data on error
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [queryFn, enabled, mockData, cacheKey, cacheTTL])

  useEffect(() => {
    if (refetchOnMount || data === mockData) {
      fetchData()
    }
    return () => {
      isMountedRef.current = false
    }
  }, [fetchData, refetchOnMount, data, mockData])

  const refetch = useCallback(() => {
    if (isMountedRef.current) {
      cache.delete(cacheKey) // Clear cache on refetch
      fetchData()
    }
  }, [fetchData, cacheKey])

  return { data, loading, error, refetch }
}

// Hook específico para categorias
export function useOptimizedCategories() {
  return useOptimizedQuery(
    async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      return { data, error }
    },
    [], // Sem dados mock
    { cacheKey: 'categories', cacheTTL: 10 * 60 * 1000 } // Cache por 10 minutos
  )
}

// Hook específico para endereço de entrega
export function useOptimizedDeliveryAddress() {
  return useOptimizedQuery(
    async () => {
      const { data, error } = await supabase
        .from('delivery_address')
        .select('*')
        .order('created_at')
      return { data, error }
    },
    [], // Sem dados mock
    { cacheKey: 'delivery_address', cacheTTL: 15 * 60 * 1000 } // Cache por 15 minutos
  )
}

// Hook específico para progresso
export function useOptimizedProgress() {
  return useOptimizedQuery(
    async () => {
      try {
        const [productsResult, surpriseItemsResult] = await Promise.all([
          supabase.from('products').select('item_type, reservation_status'),
          supabase.from('surprise_items').select('item_type, reservation_status')
        ])

        if (productsResult.error) throw productsResult.error
        if (surpriseItemsResult.error) throw surpriseItemsResult.error

        const allItems = [
          ...(productsResult.data || []),
          ...(surpriseItemsResult.data || [])
        ]

        const principalItems = allItems.filter(item => item.item_type === 'principal')
        const adicionalItems = allItems.filter(item => item.item_type === 'adicional')

        const principalReserved = principalItems.filter(item => 
          item.reservation_status === 'reserved' || item.reservation_status === 'received'
        ).length

        const adicionalReserved = adicionalItems.filter(item => 
          item.reservation_status === 'reserved' || item.reservation_status === 'received'
        ).length

        return {
          data: {
            principal: {
              total: principalItems.length,
              reserved: principalReserved,
              percentage: principalItems.length > 0 ? Math.round((principalReserved / principalItems.length) * 100) : 0
            },
            adicional: {
              total: adicionalItems.length,
              reserved: adicionalReserved,
              percentage: adicionalItems.length > 0 ? Math.round((adicionalReserved / adicionalItems.length) * 100) : 0
            }
          },
          error: null
        }
      } catch (error) {
        throw error
      }
    },
    { principal: { total: 0, reserved: 0, percentage: 0 }, adicional: { total: 0, reserved: 0, percentage: 0 } }, // Sem dados mock
    { cacheKey: 'progress_data', cacheTTL: 2 * 60 * 1000 } // Cache por 2 minutos
  )
}