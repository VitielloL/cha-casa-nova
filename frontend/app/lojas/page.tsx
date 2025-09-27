'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase, Store } from '@/lib/supabase'
import { ArrowLeft, MapPin, ExternalLink, Store as StoreIcon } from 'lucide-react'

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('name')

      if (error) throw error
      setStores(data || [])
    } catch (error) {
      console.error('Erro ao carregar lojas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="mobile-title text-gray-900">Lojas Parceiras</h1>
          <p className="text-sm text-gray-500">
            {stores.length} loja{stores.length !== 1 ? 's' : ''} disponível{stores.length !== 1 ? 'is' : ''}
          </p>
        </div>
      </div>

      {/* Lojas */}
      <div className="space-y-4">
        {stores.map((store) => (
          <Card key={store.id} className="mobile-card">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <StoreIcon className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="mobile-subtitle text-gray-900 mb-2">
                    {store.name}
                  </h3>
                  
                  {store.address && (
                    <div className="flex items-start space-x-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        {store.address}
                      </p>
                    </div>
                  )}

                  {store.link && (
                    <a
                      href={store.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Visitar loja online
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-8">
          <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Nenhuma loja cadastrada ainda.</p>
          <Link href="/cadastro">
            <Button className="mt-4">
              Cadastrar primeira loja
            </Button>
          </Link>
        </div>
      )}

      {/* Botão para cadastrar nova loja */}
      <div className="mt-8">
        <Link href="/cadastro">
          <Button variant="outline" className="mobile-button w-full">
            Cadastrar Nova Loja
          </Button>
        </Link>
      </div>
    </div>
  )
}
