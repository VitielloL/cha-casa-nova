import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Hook robusto que trata erros e fallbacks
export function useRobustQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  mockData: T | null = null,
  options: {
    enabled?: boolean
    retryOnError?: boolean
    maxRetries?: number
  } = {}
) {
  const [data, setData] = useState<T | null>(mockData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const isMountedRef = useRef(true)
  const retryCountRef = useRef(0)
  
  const { enabled = true, retryOnError = true, maxRetries = 2 } = options

  const fetchData = async (isRetry = false) => {
    if (!enabled || !isMountedRef.current) return
    
    try {
      if (!isRetry) {
        setLoading(true)
        setError(null)
      }
      
      const result = await queryFn()
      
      if (!isMountedRef.current) return
      
      if (result.error) {
        throw result.error
      }
      
      setData(result.data)
      retryCountRef.current = 0 // Reset retry count on success
    } catch (err) {
      if (!isMountedRef.current) return
      
      console.error('Erro na consulta:', err)
      setError(err)
      
      // Retry logic
      if (retryOnError && retryCountRef.current < maxRetries) {
        retryCountRef.current++
        setTimeout(() => {
          if (isMountedRef.current) {
            fetchData(true)
          }
        }, 1000 * retryCountRef.current) // Exponential backoff
      } else {
        setLoading(false)
      }
    } finally {
      if (!isRetry) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    // Pequeno delay para permitir renderização inicial
    const timer = setTimeout(() => {
      fetchData()
    }, 50)

    return () => {
      clearTimeout(timer)
      isMountedRef.current = false
    }
  }, [])

  const refetch = () => {
    retryCountRef.current = 0
    fetchData()
  }

  return { data, loading, error, refetch }
}

// Hook específico para categorias com fallback robusto
export function useRobustCategories() {
  return useRobustQuery(
    async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      return { data, error }
    },
    [], // Sem dados mock
    { retryOnError: true, maxRetries: 3 }
  )
}

// Hook específico para endereços de entrega
export function useRobustDeliveryAddress() {
  return useRobustQuery(
    async () => {
      const { data, error } = await supabase
        .from('delivery_address')
        .select('*')
        .order('created_at')
      return { data, error }
    },
    [], // Sem dados mock
    { retryOnError: true, maxRetries: 2 }
  )
}

// Hook específico para produtos de uma categoria
export function useRobustCategoryProducts(categoryId: string) {
  return useRobustQuery(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          purchase_methods:product_purchase_methods(*)
        `)
        .eq('category_id', categoryId)
        .order('name')
      return { data, error }
    },
    [], // Sem dados mock
    { 
      enabled: !!categoryId,
      retryOnError: true, 
      maxRetries: 2 
    }
  )
}

// Hook específico para progresso
export function useRobustProgress() {
  return useRobustQuery(
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
    { retryOnError: true, maxRetries: 2 }
  )
}
