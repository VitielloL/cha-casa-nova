'use client'


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
      return // Evita re-fetch desnecessário
    }
    
    try {
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
    setHasLoaded(false)
    await fetchData(true)
  }

  const updateProduct = (updatedProduct: Product) => {
    
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === updatedProduct.id) {
          return updatedProduct
        }
        return p
      })
      return updated
    })
  }

  const deleteProduct = (productId: string) => {
    setProducts(prev => {
      const filtered = prev.filter(p => p.id !== productId)
      return filtered
    })
  }

  useEffect(() => {
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
