'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSimpleCategoryProducts } from '@/lib/hooks/useSimpleCategoryProducts'
import ImageDisplay from '@/components/ImageDisplay'
import ProductPurchaseMethods from '@/components/ProductPurchaseMethods'
import ReservationModal from '@/components/ReservationModal'
import { MessageCircle, ShoppingCart, MapPin, ExternalLink, CheckCircle, XCircle, Clock } from 'lucide-react'
import { APP_CONFIG } from '@/lib/constants'

interface CategoryModalProps {
  category: {
    id: string
    name: string
    description?: string
  } | null
  isOpen: boolean
  onClose: () => void
}

export default function CategoryModal({ category, isOpen, onClose }: CategoryModalProps) {
  const { data: products, loading } = useSimpleCategoryProducts(category?.id || '')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showReservationModal, setShowReservationModal] = useState(false)


  // Reset selected product when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProduct(null)
      setShowReservationModal(false)
    }
  }, [isOpen])

  const handleReserve = (product: any) => {
    setSelectedProduct(product)
    setShowReservationModal(true)
  }

  const handleWhatsApp = (product: any) => {
    const productName = encodeURIComponent(product.name)
    const whatsappNumber = APP_CONFIG.whatsappNumber
    const message = `Oi, eu to no produto ${productName} e queria tirar uma dúvida`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reserved':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'received':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reserved':
        return 'Reservado'
      case 'received':
        return 'Recebido'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Disponível'
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {category?.name}
            </DialogTitle>
            {category?.description && (
              <p className="text-gray-600 mt-2">{category.description}</p>
            )}
          </DialogHeader>

          <div className="mt-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando produtos...</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <Card key={product.id} className="mobile-card">
                    <CardContent className="p-0">
                      {/* Imagem do produto */}
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <ImageDisplay
                          imageId={product.image_id}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Status badge */}
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                            {getStatusIcon(product.reservation_status)}
                            <span className="font-medium">
                              {getStatusText(product.reservation_status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Conteúdo do produto */}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        {/* Métodos de compra */}
                        <ProductPurchaseMethods 
                          purchaseMethods={product.purchase_methods || []}
                          productName={product.name}
                          className="mb-4"
                        />

                        {/* Botões de ação */}
                        <div className="space-y-2">
                          {product.reservation_status === 'available' && (
                            <Button
                              onClick={() => handleReserve(product)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Reservar
                            </Button>
                          )}

                          <Button
                            onClick={() => handleWhatsApp(product)}
                            variant="outline"
                            className="w-full"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Tirar Dúvida no WhatsApp
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhum produto encontrado nesta categoria.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Reserva */}
      {selectedProduct && (
        <ReservationModal
          product={selectedProduct}
          open={showReservationModal}
          onOpenChange={setShowReservationModal}
          onSuccess={() => {
            // Recarregar produtos após reserva bem-sucedida
            window.location.reload()
          }}
        />
      )}
    </>
  )
}
