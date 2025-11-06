'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase, SurpriseItem } from '@/lib/supabase'
import { ArrowLeft, Gift, Eye, EyeOff, Package, Sparkles } from 'lucide-react'

export default function ItensSurpresaPage() {
  const [items, setItems] = useState<SurpriseItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('surprise_items')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Erro ao carregar itens surpresa:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'received': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível'
      case 'reserved': return 'Reservado'
      case 'received': return 'Recebido'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const getItemTypeColor = (type: string) => {
    return type === 'principal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando itens surpresa...</p>
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
          <h1 className="mobile-title text-gray-900 flex items-center">
            <Gift className="w-6 h-6 mr-2 text-blue-600" />
            Itens Surpresa
          </h1>
          <p className="text-sm text-gray-500">
            Presentes especiais enviados pelos convidados para os anfitriões
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {items.filter(item => item.item_type === 'principal').length}
            </div>
            <div className="text-sm text-gray-600">Principais</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {items.filter(item => item.item_type === 'adicional').length}
            </div>
            <div className="text-sm text-gray-600">Adicionais</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Itens */}
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="mobile-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {item.is_anonymous ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Gift className="w-5 h-5 text-blue-500" />
                    )}
                    <h3 className="font-semibold text-gray-900">
                      {item.is_anonymous ? 'Item Misterioso' : item.name}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getItemTypeColor(item.item_type)}`}>
                      {item.item_type === 'principal' ? 'Principal' : 'Adicional'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.reservation_status)}`}>
                      {getStatusText(item.reservation_status)}
                    </span>
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {item.description}
                  </p>
                )}

                {item.category && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Categoria sugerida: {item.category}
                    </span>
                  </div>
                )}

                {item.is_anonymous && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        <strong>Mistério total!</strong> Este item foi enviado anonimamente.
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-400">
                  Enviado em {new Date(item.created_at).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mobile-card">
          <CardContent className="text-center py-8">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Nenhum item surpresa ainda
            </h3>
            <p className="text-gray-600 mb-4">
              Seja o primeiro a enviar um presente especial!
            </p>
            <Link href="/item-surpresa">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Gift className="w-4 h-4 mr-2" />
                Enviar Item Surpresa
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="mobile-card mt-6">
        <CardContent className="text-center py-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Quer contribuir com a festa?
          </h3>
          <p className="text-gray-600 mb-4">
            Envie um item surpresa especial para os anfitriões!
          </p>
          <Link href="/item-surpresa">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Gift className="w-4 h-4 mr-2" />
              Enviar Meu Item Surpresa
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
