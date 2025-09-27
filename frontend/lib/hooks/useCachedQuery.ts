import { useState, useEffect, useCallback, useRef } from 'react'
import { cache, CACHE_KEYS } from '@/lib/cache'

interface UseCachedQueryOptions {
  enabled?: boolean
  ttl?: number
  refetchOnMount?: boolean
}

export function useCachedQuery<T>(
  key: string,
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: UseCachedQueryOptions = {}
) {
  const [data, setData] = useState<T | null>(() => cache.get<T>(key))
  const [loading, setLoading] = useState(!cache.has(key))
  const [error, setError] = useState<any>(null)
  const isMountedRef = useRef(true)
  const hasFetchedRef = useRef(cache.has(key))

  const { enabled = true, ttl, refetchOnMount = true } = options

  const fetchData = useCallback(async () => {
    if (!enabled || !isMountedRef.current) return

    try {
      setLoading(true)
      setError(null)
      
      const result = await queryFn()
      
      if (!isMountedRef.current) return
      
      if (result.error) {
        throw result.error
      }
      
      // Salvar no cache
      cache.set(key, result.data, ttl)
      setData(result.data)
      hasFetchedRef.current = true
    } catch (err) {
      if (!isMountedRef.current) return
      console.error('Erro na consulta:', err)
      setError(err)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [key, queryFn, enabled, ttl])

  useEffect(() => {
    if (refetchOnMount || !hasFetchedRef.current) {
      fetchData()
    }

    return () => {
      isMountedRef.current = false
    }
  }, [fetchData, refetchOnMount])

  const refetch = useCallback(() => {
    cache.delete(key)
    hasFetchedRef.current = false
    fetchData()
  }, [key, fetchData])

  return { data, loading, error, refetch }
}

// Hooks específicos com cache
export function useCachedCategories() {
  return useCachedQuery(
    CACHE_KEYS.CATEGORIES,
    () => import('@/lib/supabase').then(({ supabase }) => 
      supabase.from('categories').select('*').order('name')
    ),
    { ttl: 10 * 60 * 1000 } // 10 minutos
  )
}

export function useCachedCategoryProducts(categoryId: string) {
  return useCachedQuery(
    CACHE_KEYS.PRODUCTS(categoryId),
    () => import('@/lib/supabase').then(({ supabase }) => 
      supabase
        .from('products')
        .select(`
          *,
          purchase_methods:product_purchase_methods(*)
        `)
        .eq('category_id', categoryId)
        .order('name')
    ),
    { 
      enabled: !!categoryId,
      ttl: 5 * 60 * 1000 // 5 minutos
    }
  )
}

export function useCachedStores() {
  return useCachedQuery(
    CACHE_KEYS.STORES,
    () => import('@/lib/supabase').then(({ supabase }) => 
      supabase.from('stores').select('*').order('name')
    ),
    { ttl: 15 * 60 * 1000 } // 15 minutos
  )
}

export function useCachedProgress() {
  return useCachedQuery(
    CACHE_KEYS.PROGRESS,
    async () => {
      const { supabase } = await import('@/lib/supabase')
      
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
        }
      }
    },
    { ttl: 2 * 60 * 1000 } // 2 minutos
  )
}
