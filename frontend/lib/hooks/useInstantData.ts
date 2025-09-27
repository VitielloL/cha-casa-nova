import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'


// Cache global simples
const dataCache = new Map<string, { data: any; timestamp: number }>()

// Função para limpar cache
export function clearCache(key?: string) {
  if (key) {
    dataCache.delete(key)
  } else {
    dataCache.clear()
  }
}

// Hook que renderiza imediatamente e atualiza em background
export function useInstantData<T>(
  key: string,
  queryFn: () => Promise<{ data: T | null; error: any }>,
  mockData: T | null = null
) {
  const [data, setData] = useState<T | null>(() => {
    // Sempre começar com dados mock
    return mockData
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsUpdating(true)
        
        const result = await queryFn()
        
        if (!isMountedRef.current) return
        
        if (result.error) {
          console.error('Erro na consulta:', result.error)
          return // Manter dados mock em caso de erro
        }
        
        // Salvar no cache
        dataCache.set(key, {
          data: result.data,
          timestamp: Date.now()
        })
        
        // Atualizar dados se a consulta foi bem-sucedida
        if (result.data) {
          setData(result.data)
        }
      } catch (err) {
        console.error('Erro na consulta:', err)
      } finally {
        if (isMountedRef.current) {
          setIsUpdating(false)
        }
      }
    }

    // Pequeno delay para permitir renderização inicial
    const timer = setTimeout(fetchData, 100)

    return () => {
      clearTimeout(timer)
      isMountedRef.current = false
    }
  }, [key, queryFn])

  return { data, isUpdating }
}

// Hook específico para categorias instantâneas
export function useInstantCategories() {
  return useInstantData(
    'categories',
    () => supabase.from('categories').select('*').order('name'),
    [] // Sem dados mock
  )
}

// Hook específico para progresso instantâneo
export function useInstantProgress() {
  return useInstantData(
    'progress',
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
          }
        }
      } catch (error) {
        throw error
      }
    },
    { principal: { total: 0, reserved: 0, percentage: 0 }, adicional: { total: 0, reserved: 0, percentage: 0 } }, // Sem dados mock
    { delayMs: 100 }
  )
}

// Hook específico para endereço instantâneo
export function useInstantDeliveryAddress() {
  return useInstantData(
    'delivery_address',
    () => supabase
      .from('delivery_address')
      .select('*')
      .order('created_at'),
    [] // Sem dados mock
  )
}