import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export function useSimpleCategoryProducts(categoryId: string) {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      if (!categoryId || !isMounted) return
      
      try {
        setLoading(true)
        setError(null)
        
        const result = await supabase
          .from('products')
          .select(`
            *,
            purchase_methods:product_purchase_methods(*)
          `)
          .eq('category_id', categoryId)
          .order('name')
        
        if (!isMounted) return
        
        if (result.error) {
          throw result.error
        }
        
        setData(result.data || [])
      } catch (err) {
        if (!isMounted) return
        console.error('Erro ao carregar produtos:', err)
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
  }, [categoryId]) // Dependência apenas do categoryId

  return { data, loading, error }
}
