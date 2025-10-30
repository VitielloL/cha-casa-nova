'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase, Product } from '@/lib/supabase'
import ImageDisplay from '@/components/ImageDisplay'
import ReservationImageSimple from '@/components/ReservationImageSimple'
import DetectiveCard from '@/components/DetectiveCard'
import ProtectedRoute from '@/components/ProtectedRoute'
import { generateWhatsAppUrl, replaceMessagePlaceholders } from '@/lib/whatsappUtils'
import { ArrowLeft, CheckCircle, XCircle, Clock, Package, Gift, User, Phone, MessageCircle, UserX, ExternalLink } from 'lucide-react'

function AdminReservasContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'reserved' | 'received' | 'cancelled'>('all')
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProductStatus = async (productId: string, newStatus: 'received' | 'cancelled' | 'available') => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          reservation_status: newStatus,
          reserved: newStatus === 'available' ? false : true
        })
        .eq('id', productId)

      if (error) throw error

      // Recarregar produtos
      fetchProducts()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status. Tente novamente.')
    }
  }

  const sendThankYouMessage = async (product: Product) => {
    try {
      // Buscar configurações
      const { data: configData, error: configError } = await supabase
        .from('app_config')
        .select('key, value')
        .in('key', ['whatsapp_number', 'thank_you_message'])

      if (configError) throw configError

      const config: Record<string, string> = {}
      configData?.forEach(item => {
        config[item.key] = item.value
      })

      if (!config.whatsapp_number || !config.thank_you_message) {
        alert('Configure primeiro os números e mensagens do WhatsApp nas configurações.')
        return
      }

      // Substituir placeholders na mensagem
      const message = replaceMessagePlaceholders(config.thank_you_message, {
        PRODUCT_NAME: product.name
      })

      // Gerar URL do WhatsApp
      const whatsappUrl = generateWhatsAppUrl(config.whatsapp_number, message)
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank')
    } catch (error) {
      console.error('Erro ao enviar agradecimento:', error)
      alert('Erro ao enviar agradecimento. Tente novamente.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reserved': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'received': return <CheckCircle className="w-4 h-4 text-blue-600" />
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />
      default: return <Package className="w-4 h-4 text-green-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'received': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reserved': return 'Reservado'
      case 'received': return 'Recebido'
      case 'cancelled': return 'Cancelado'
      default: return 'Disponível'
    }
  }

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true
    return product.reservation_status === filter
  })

  const getItemTypeIcon = (type: string) => {
    return type === 'principal' ? 
      <Package className="w-4 h-4 text-blue-600" /> : 
      <Gift className="w-4 h-4 text-purple-600" />
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
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="mobile-title text-gray-900">Gerenciar Reservas</h1>
          <p className="text-sm text-gray-500">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'reserved', label: 'Reservados' },
          { key: 'received', label: 'Recebidos' },
          { key: 'cancelled', label: 'Cancelados' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista de Produtos */}
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="mobile-card">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                {/* Imagem */}
                <div className="flex-shrink-0">
                  {product.image_id ? (
                    <ImageDisplay
                      imageId={product.image_id}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      fallbackClassName="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {product.category?.name}
                      </p>
                    </div>
                    
                    {/* Status e Tipo */}
                    <div className="flex flex-col items-end space-y-1">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.reservation_status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(product.reservation_status)}
                          <span>{getStatusText(product.reservation_status)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        {getItemTypeIcon(product.item_type)}
                        <span className="capitalize">{product.item_type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dados de quem reservou ou detetive para anônimos */}
                  {product.is_anonymous ? (
                    <div className="mb-3">
                      <DetectiveCard 
                        productName={product.name}
                        onReveal={() => {
                          // Aqui você pode implementar lógica para revelar a identidade
                          console.log('Tentando revelar identidade do produto:', product.name)
                        }}
                        onInvestigate={() => {
                          // Aqui você pode implementar lógica de investigação
                          console.log('Investigando produto:', product.name)
                        }}
                      />
                    </div>
                  ) : product.reserved_by ? (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="space-y-3">
                        {/* Dados básicos */}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {product.reserved_by}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {product.reserved_contact}
                            </span>
                          </div>
                        </div>

                        {/* Mensagem Carinhosa */}
                        {product.reservation_message && (
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-start space-x-2">
                              <span className="text-lg">💝</span>
                              <div>
                                <h4 className="font-semibold text-yellow-800 text-sm mb-1">Mensagem Carinhosa:</h4>
                                <p className="text-sm text-yellow-700 italic">"{product.reservation_message}"</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Foto Fofa */}
                        {product.reservation_image_id && (
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-start space-x-2">
                              <span className="text-lg">📸</span>
                              <div>
                                <h4 className="font-semibold text-purple-800 text-sm mb-2">Foto Fofa:</h4>
                                <div className="relative group">
                                  <ReservationImageSimple
                                    imageId={product.reservation_image_id}
                                    productName={product.name}
                                    className="w-32 h-24 object-cover rounded border border-purple-200 cursor-pointer hover:opacity-90 transition-opacity"
                                    onImageLoaded={(url) => {
                                      setImageUrls(prev => ({
                                        ...prev,
                                        [product.reservation_image_id!]: url
                                      }))
                                    }}
                                  />
                                  {imageUrls[product.reservation_image_id] && (
                                    <button
                                      onClick={() => {
                                        // Abrir imagem em nova aba
                                        const newWindow = window.open('', '_blank')
                                        if (newWindow) {
                                          newWindow.document.write(`
                                            <html>
                                              <head><title>Foto Fofa - ${product.name}</title></head>
                                              <body style="margin:0;padding:20px;background:#f3f4f6;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                                                <img src="${imageUrls[product.reservation_image_id!]}" style="max-width:100%;max-height:100%;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);" />
                                              </body>
                                            </html>
                                          `)
                                        }
                                      }}
                                      className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="Abrir imagem em nova aba"
                                    >
                                      <ExternalLink className="w-3 h-3 text-gray-600" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-xs text-purple-600 mt-1">
                                  Que foto linda! 🥰
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Ações */}
                  {product.reservation_status === 'reserved' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateProductStatus(product.id, 'received')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Marcar como Recebido
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateProductStatus(product.id, 'cancelled')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  )}

                  {product.reservation_status === 'received' && (
                    <div className="space-y-2">
                      <div className="text-sm text-green-600 font-medium">
                        ✅ Produto recebido em {new Date(product.received_at!).toLocaleDateString('pt-BR')}
                      </div>
                      {!product.is_anonymous && product.reserved_contact && (
                        <Button
                          size="sm"
                          onClick={() => sendThankYouMessage(product)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Enviar Agradecimento
                        </Button>
                      )}
                      {product.is_anonymous && (
                        <div className="flex items-center space-x-2 text-sm text-purple-600">
                          <UserX className="w-4 h-4" />
                          <span>Reserva anônima - Agradecimento não disponível</span>
                        </div>
                      )}
                    </div>
                  )}

                  {product.reservation_status === 'cancelled' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateProductStatus(product.id, 'available')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Disponibilizar Novamente
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="mobile-card">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="mobile-subtitle text-gray-900 mb-2">
              Nenhum produto encontrado
            </h2>
            <p className="text-gray-600">
              Não há produtos com o status selecionado.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AdminReservasPage() {
  return (
    <ProtectedRoute>
      <AdminReservasContent />
    </ProtectedRoute>
  )
}
