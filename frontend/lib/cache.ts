import React from 'react'

// Sistema de cache simples para dados entre rotas
interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number // Time to live em ms
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutos

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    // Verificar se expirou
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false
    
    // Verificar se expirou
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Limpar itens expirados
  cleanup(): void {
    const now = Date.now()
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    })
  }

  // Estatísticas do cache
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Instância global do cache
export const cache = new SimpleCache()

// Chaves de cache padronizadas
export const CACHE_KEYS = {
  CATEGORIES: 'categories',
  PRODUCTS: (categoryId: string) => `products_${categoryId}`,
  STORES: 'stores',
  PROGRESS: 'progress',
  DELIVERY_ADDRESS: 'delivery_address',
  PARTY_OWNERS: 'party_owners',
  SURPRISE_ITEMS: 'surprise_items',
  APP_CONFIG: 'app_config'
} as const

// Hook para usar cache com fallback
export function useCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): { data: T | null; loading: boolean; error: any; refetch: () => void } {
  const [data, setData] = React.useState<T | null>(() => cache.get<T>(key))
  const [loading, setLoading] = React.useState(!cache.has(key))
  const [error, setError] = React.useState<any>(null)

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchFn()
      cache.set(key, result, ttl)
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [key, fetchFn, ttl])

  React.useEffect(() => {
    if (!cache.has(key)) {
      fetchData()
    }
  }, [key, fetchData])

  const refetch = React.useCallback(() => {
    cache.delete(key)
    fetchData()
  }, [key, fetchData])

  return { data, loading, error, refetch }
}

// Limpeza automática do cache a cada 10 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    cache.cleanup()
  }, 10 * 60 * 1000)
}
