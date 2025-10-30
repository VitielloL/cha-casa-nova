import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface UseSupabaseQueryOptions {
  enabled?: boolean
  refetchOnMount?: boolean
}

export function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  dependencies: any[] = [],
  options: UseSupabaseQueryOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const isMountedRef = useRef(true)

  const { enabled = true, refetchOnMount = true } = options

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
      
      setData(result.data)
    } catch (err) {
      if (!isMountedRef.current) return
      console.error('Erro na consulta:', err)
      setError(err)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [queryFn, enabled])

  useEffect(() => {
    if (refetchOnMount || data === null) {
      fetchData()
    }
  }, [...dependencies, refetchOnMount]) // Removido fetchData das dependências

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const refetch = useCallback(() => {
    if (isMountedRef.current) {
      fetchData()
    }
  }, [fetchData])

  return { data, loading, error, refetch }
}

// Hook específico para categorias
export function useCategories() {
  return useSupabaseQuery(
    async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      return { data, error }
    },
    [],
    { enabled: true, refetchOnMount: false }
  )
}

// Hook específico para produtos de uma categoria
export function useCategoryProducts(categoryId: string) {
  return useSupabaseQuery(
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
    [categoryId],
    { enabled: !!categoryId }
  )
}

// Hook específico para itens surpresa
export function useSurpriseItems() {
  return useSupabaseQuery(
    async () => {
      const { data, error } = await supabase
        .from('surprise_items')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
      return { data, error }
    },
    []
  )
}
