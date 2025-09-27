import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Hook que renderiza imediatamente com dados mock, depois carrega dados reais
export function useInstantQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  mockData: T | null = null
) {
  const [data, setData] = useState<T | null>(mockData)
  const [loading, setLoading] = useState(false) // Começa como false para renderizar imediatamente
  const [error, setError] = useState<any>(null)
  const isMountedRef = useRef(true)
  const hasFetchedRef = useRef(false)

  const fetchData = async () => {
    if (hasFetchedRef.current) return
    
    try {
      setLoading(true)
      setError(null)
      
      const result = await queryFn()
      
      if (!isMountedRef.current) return
      
      if (result.error) {
        throw result.error
      }
      
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

  return { data, loading, error }
}

// Hook específico para categorias com dados mock
export function useInstantCategories() {
  const mockCategories = [
    { id: '1', name: 'Cozinha', description: 'Utensílios e eletrodomésticos' },
    { id: '2', name: 'Sala de Estar', description: 'Móveis e decoração' },
    { id: '3', name: 'Quarto', description: 'Roupas de cama e acessórios' },
    { id: '4', name: 'Banheiro', description: 'Toalhas e itens de higiene' }
  ]

  return useInstantQuery(
    () => supabase.from('categories').select('*').order('name'),
    mockCategories
  )
}

// Hook específico para produtos com dados mock
export function useInstantCategoryProducts(categoryId: string) {
  const mockProducts = [
    {
      id: '1',
      name: 'Jogo de Pratos',
      description: 'Conjunto completo de pratos para 6 pessoas',
      category_id: categoryId,
      reservation_status: 'available',
      item_type: 'principal',
      is_anonymous: false
    },
    {
      id: '2', 
      name: 'Panela de Pressão',
      description: 'Panela de pressão elétrica 6L',
      category_id: categoryId,
      reservation_status: 'available',
      item_type: 'adicional',
      is_anonymous: false
    }
  ]

  return useInstantQuery(
    () => supabase
      .from('products')
      .select(`
        *,
        purchase_methods:product_purchase_methods(*)
      `)
      .eq('category_id', categoryId)
      .order('name'),
    mockProducts,
    { enabled: !!categoryId }
  )
}
