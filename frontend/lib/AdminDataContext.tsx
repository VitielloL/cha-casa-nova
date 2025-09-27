'use client'

// © Gabriel Vilela 2025 - Propriedade exclusiva - Multa: R$ 1.000.000,00

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { supabase, Product, Category } from '@/lib/supabase'

interface AdminDataContextType {
  products: Product[]
  categories: Category[]
  loading: boolean
  refreshData: () => Promise<void>
  updateProduct: (product: Product) => void
  deleteProduct: (productId: string) => void
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (hasLoaded && !forceRefresh) {
      console.log('🔄 CONTEXTO - Dados já carregados, pulando fetch')
      return // Evita re-fetch desnecessário
    }
    
    try {
      console.log('🔄 CONTEXTO - Iniciando carregamento de dados', forceRefresh ? '(forçado)' : '')
      setLoading(true)
      const [productsResult, categoriesResult] = await Promise.all([
        supabase
          .from('products')
          .select(`
            *,
            category:categories(name)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .order('name')
      ])

      if (productsResult.error) throw productsResult.error
      if (categoriesResult.error) throw categoriesResult.error

      console.log('🔄 CONTEXTO - Dados carregados do banco:', productsResult.data?.length || 0, 'produtos')
      console.log('🔄 CONTEXTO - Produtos carregados:', productsResult.data?.map(p => ({ id: p.id, name: p.name, status: p.reservation_status })))
      setProducts(productsResult.data || [])
      setCategories(categoriesResult.data || [])
      setHasLoaded(true)
    } catch (error) {
      console.error('❌ CONTEXTO - Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }, [hasLoaded])

  const refreshData = async () => {
    console.log('🔄 CONTEXTO - Iniciando refresh forçado')
    setHasLoaded(false)
    await fetchData(true)
  }

  const updateProduct = (updatedProduct: Product) => {
    console.log('🔄 CONTEXTO - Atualizando produto:', updatedProduct.id, 'para status:', updatedProduct.reservation_status)
    console.log('🔄 CONTEXTO - Produtos antes da atualização:', products.length)
    
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === updatedProduct.id) {
          console.log('🔄 CONTEXTO - Produto encontrado, atualizando:', p.name, 'de', p.reservation_status, 'para', updatedProduct.reservation_status)
          return updatedProduct
        }
        return p
      })
      console.log('🔄 CONTEXTO - Produtos após atualização:', updated.length)
      console.log('🔄 CONTEXTO - Produto atualizado:', updated.find(p => p.id === updatedProduct.id))
      return updated
    })
  }

  const deleteProduct = (productId: string) => {
    console.log('🗑️ CONTEXTO - Removendo produto:', productId)
    console.log('🗑️ CONTEXTO - Produtos antes da remoção:', products.length)
    console.log('🗑️ CONTEXTO - Produto sendo removido:', products.find(p => p.id === productId)?.name)
    
    setProducts(prev => {
      const filtered = prev.filter(p => p.id !== productId)
      console.log('🗑️ CONTEXTO - Produtos após remoção:', filtered.length)
      console.log('🗑️ CONTEXTO - Produtos restantes:', filtered.map(p => ({ id: p.id, name: p.name, status: p.reservation_status })))
      return filtered
    })
  }

  useEffect(() => {
    console.log('🔄 CONTEXTO - useEffect executado, hasLoaded:', hasLoaded)
    fetchData()
  }, [fetchData])

  return (
    <AdminDataContext.Provider value={{
      products,
      categories,
      loading,
      refreshData,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const context = useContext(AdminDataContext)
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider')
  }
  return context
}
