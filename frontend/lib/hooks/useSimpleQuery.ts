import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, Category } from '@/lib/supabase'

export function useSimpleQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const isMountedRef = useRef(true)
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      if (hasFetchedRef.current || !isMounted) return
      
      try {
        setLoading(true)
        setError(null)
        
        const result = await queryFn()
        
        if (!isMounted) return
        
        if (result.error) {
          throw result.error
        }
        
        setData(result.data)
        hasFetchedRef.current = true
      } catch (err) {
        if (!isMounted) return
        console.error('Erro na consulta:', err)
        setError(err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
      isMountedRef.current = false
    }
  }, []) // Empty dependency array to run only once

  return { data, loading, error }
}

// Hook específico para categorias
export function useCategoriesSimple() {
  return useSimpleQuery<Category[]>(
    async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      return { data, error }
    }
  )
}
