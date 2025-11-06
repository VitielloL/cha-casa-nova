'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase, Product, Category } from '@/lib/supabase'
import ImageDisplay from '@/components/ImageDisplay'
import DeliveryAddress from '@/components/DeliveryAddress'
import ProductPurchaseMethods from '@/components/ProductPurchaseMethods'
import { ArrowLeft, MessageCircle, ShoppingCart, MapPin, ExternalLink, CheckCircle, XCircle, Clock } from 'lucide-react'
import { APP_CONFIG } from '@/lib/constants'
import ReservationModal from '@/components/ReservationModal'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showReservationModal, setShowReservationModal] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchCategoryAndProducts(params.id as string)
    }
  }, [params.id])

  // Sistema de eventos removido para evitar flash durante navegação

  const fetchCategoryAndProducts = async (categoryId: string) => {
    try {
      // Buscar categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single()

      if (categoryError) throw categoryError
      setCategory(categoryData)

      // Buscar produtos da categoria com meios de compra
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          purchase_methods:product_purchase_methods(*)
        `)
        .eq('category_id', categoryId)
        .order('name')

      if (productsError) throw productsError
      setProducts(productsData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReserve = (product: Product) => {
    setSelectedProduct(product)
    setShowReservationModal(true)
  }

  const handleWhatsApp = (product: Product) => {
    const message = `Oi, eu to no produto ${product.name} e queria tirar uma duvida`
    const whatsappUrl = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleReservationSuccess = () => {
    setShowReservationModal(false)
    setSelectedProduct(null)
    // Recarregar produtos para atualizar status de reserva
    if (params.id) {
      fetchCategoryAndProducts(params.id as string)
    }
  }

  const renderProductStatus = (product: Product) => {
    // Debug específico para Panela de Pressão
    const statusConfig = {
      available: { 
        icon: null, 
        text: 'Disponível', 
        color: 'bg-green-100 text-green-800',
        showReserve: true
      },
      reserved: { 
        icon: Clock, 
        text: product.is_anonymous ? 'Reservado Anonimamente' : 'Reservado', 
        color: product.is_anonymous ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800',
        showReserve: false
      },
      received: { 
        icon: CheckCircle, 
        text: 'Recebido', 
        color: 'bg-blue-100 text-blue-800',
        showReserve: false
      },
      cancelled: { 
        icon: XCircle, 
        text: 'Cancelado', 
        color: 'bg-red-100 text-red-800',
        showReserve: true
      }
    }

    const config = statusConfig[product.reservation_status]
    const IconComponent = config.icon

    return (
      <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <div className="flex items-center space-x-1">
          {IconComponent && <IconComponent className="w-3 h-3" />}
          <span>{config.text}</span>
          {product.is_anonymous && product.reservation_status === 'reserved' && (
            <span className="ml-1">🕵️‍♂️</span>
          )}
        </div>
      </div>
    )
  }

  const canReserve = (product: Product) => {
    return product.reservation_status === 'available' || product.reservation_status === 'cancelled'
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

  if (!category) {
    return (
      <div className="mobile-container">
        <div className="text-center py-8">
          <p className="text-gray-600">Categoria não encontrada</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Voltar ao início
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="mobile-title text-gray-900">{category.name}</h1>
          <p className="text-sm text-gray-500">
            {products.length} produto{products.length !== 1 ? 's' : ''} disponível{products.length !== 1 ? 'is' : ''}
          </p>
        </div>
      </div>

      {/* Endereço de Entrega */}
      <DeliveryAddress />

      {/* Produtos */}
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="mobile-card">
            <CardContent className="p-0">
              {/* Imagem do produto */}
              <div className="relative h-48 w-full">
                {product.image_id ? (
                  <ImageDisplay
                    imageId={product.image_id}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-t-xl flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Sem imagem</span>
                  </div>
                )}
                {renderProductStatus(product)}
              </div>

              <div className="p-4">
                <h3 className="mobile-subtitle text-gray-900 mb-2">
                  {product.name}
                </h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {product.description}
                  </p>
                )}

                {/* Informações da loja */}
                {(product.store_link || product.store_address) && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        {product.store_address && (
                          <p className="text-sm text-gray-600 mb-1">
                            {product.store_address}
                          </p>
                        )}
                        {product.store_link && (
                          <a
                            href={product.store_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700"
                          >
                            Ver na loja
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Meios de compra */}
                {product.purchase_methods && product.purchase_methods.length > 0 && (
                  <div className="mb-4">
                    <ProductPurchaseMethods
                      purchaseMethods={product.purchase_methods}
                      productName={product.name}
                    />
                  </div>
                )}

                {/* Botões de ação */}
                <div className="space-y-2">
                  {canReserve(product) ? (
                    <Button
                      onClick={() => handleReserve(product)}
                      className="mobile-button w-full bg-pink-500 hover:bg-pink-600"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {product.reservation_status === 'cancelled' ? 'Reservar Novamente' : 'Reservar'}
                    </Button>
                  ) : (
                    <div className="text-center py-3 px-4 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">
                        {product.reservation_status === 'reserved' && 'Produto já reservado'}
                        {product.reservation_status === 'received' && 'Produto já recebido'}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => handleWhatsApp(product)}
                    className="mobile-button w-full"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Tirar dúvida no WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}

      {/* Modal de reserva */}
      {selectedProduct && (
        <ReservationModal
          product={selectedProduct}
          open={showReservationModal}
          onOpenChange={setShowReservationModal}
          onSuccess={handleReservationSuccess}
        />
      )}
    </div>
  )
}
