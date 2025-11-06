'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ProductPurchaseMethod } from '@/lib/supabase'
import { ExternalLink, MapPin, Phone, Mail, Image as ImageIcon, FileText, ChevronDown, ChevronUp } from 'lucide-react'

interface ProductPurchaseMethodsProps {
  purchaseMethods: ProductPurchaseMethod[]
  productName: string
  className?: string
}

export default function ProductPurchaseMethods({ 
  purchaseMethods, 
  productName, 
  className = "" 
}: ProductPurchaseMethodsProps) {
  const [showAll, setShowAll] = useState(false)

  if (!purchaseMethods || purchaseMethods.length === 0) return null

  // Separar meio principal dos secundários
  const primaryMethod = purchaseMethods.find(method => method.is_primary)
  const secondaryMethods = purchaseMethods.filter(method => !method.is_primary).sort((a, b) => a.order_index - b.order_index)

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500 hover:bg-blue-600 text-white',
      purple: 'bg-purple-500 hover:bg-purple-600 text-white',
      red: 'bg-red-500 hover:bg-red-600 text-white',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      green: 'bg-green-500 hover:bg-green-600 text-white',
      blue: 'bg-blue-500 hover:bg-blue-600 text-white',
      gray: 'bg-gray-500 hover:bg-gray-600 text-white'
    }
    return colorMap[color] || colorMap.blue
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'link': return <ExternalLink className="w-4 h-4" />
      case 'address': return <MapPin className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'photo': return <ImageIcon className="w-4 h-4" />
      case 'text': return <FileText className="w-4 h-4" />
      default: return <ExternalLink className="w-4 h-4" />
    }
  }

  const handleMethodClick = (method: ProductPurchaseMethod) => {
    switch (method.type) {
      case 'link':
        window.open(method.content, '_blank')
        break
      case 'phone':
        window.open(`tel:${method.content}`, '_self')
        break
      case 'email':
        window.open(`mailto:${method.content}`, '_self')
        break
      case 'address':
        const encodedAddress = encodeURIComponent(method.content)
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
        break
      case 'photo':
        window.open(method.content, '_blank')
        break
      case 'text':
        // Para texto, apenas copiar para clipboard
        navigator.clipboard.writeText(method.content)
        break
    }
  }

  const renderMethod = (method: ProductPurchaseMethod, isPrimary: boolean = false) => (
    <div key={method.id} className={`space-y-2 ${isPrimary ? 'mb-4' : ''}`}>
      {/* Badge de benefício para meio principal */}
      {isPrimary && method.description && (
        <div className="flex items-center justify-center space-x-1 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg px-3 py-2">
          <span className="text-sm font-medium text-yellow-800">
            ⭐ {method.description}
          </span>
        </div>
      )}

      {/* Botão do meio de compra */}
      <Button
        onClick={() => handleMethodClick(method)}
        className={`w-full ${getColorClasses(method.color)} ${isPrimary ? 'text-base py-3' : 'text-sm py-2'}`}
        size={isPrimary ? 'default' : 'sm'}
      >
        <span className="mr-2">{method.icon || getTypeIcon(method.type)}</span>
        {method.name}
        {method.type === 'link' && <ExternalLink className="w-3 h-3 ml-2" />}
        {method.type === 'address' && <MapPin className="w-3 h-3 ml-2" />}
        {method.type === 'phone' && <Phone className="w-3 h-3 ml-2" />}
        {method.type === 'email' && <Mail className="w-3 h-3 ml-2" />}
        {method.type === 'text' && <FileText className="w-3 h-3 ml-2" />}
      </Button>

      {/* Descrição adicional */}
      {!isPrimary && method.description && (
        <p className="text-xs text-gray-500 text-center">
          {method.description}
        </p>
      )}
    </div>
  )

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Meio principal */}
      {primaryMethod && renderMethod(primaryMethod, true)}

      {/* Meios secundários */}
      {secondaryMethods.length > 0 && (
        <div className="space-y-2">
          {/* Botão para mostrar/ocultar meios secundários */}
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            size="sm"
            className="w-full text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Ocultar outros meios ({secondaryMethods.length})
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Ver outros meios ({secondaryMethods.length})
              </>
            )}
          </Button>

          {/* Lista de meios secundários */}
          {showAll && (
            <div className="space-y-2">
              {secondaryMethods.map(method => renderMethod(method, false))}
            </div>
          )}
        </div>
      )}

      {/* Dica sobre meios de compra */}
      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800 text-center">
          💡 Escolha o meio de compra que preferir para este produto
        </p>
      </div>
    </div>
  )
}
