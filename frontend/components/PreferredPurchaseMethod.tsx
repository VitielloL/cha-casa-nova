'use client'

import { Button } from '@/components/ui/button'
import { FeaturedPurchaseMethod } from '@/lib/supabase'
import { ExternalLink, Star } from 'lucide-react'

interface PreferredPurchaseMethodProps {
  purchaseMethod?: FeaturedPurchaseMethod
  productName: string
  className?: string
}

export default function PreferredPurchaseMethod({ 
  purchaseMethod, 
  productName, 
  className = "" 
}: PreferredPurchaseMethodProps) {
  if (!purchaseMethod) return null

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500 hover:bg-blue-600 text-white',
      purple: 'bg-purple-500 hover:bg-purple-600 text-white',
      red: 'bg-red-500 hover:bg-red-600 text-white',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      green: 'bg-green-500 hover:bg-green-600 text-white',
      pink: 'bg-pink-500 hover:bg-blue-600 text-white',
      gray: 'bg-gray-500 hover:bg-gray-600 text-white'
    }
    return colorMap[color] || colorMap.blue
  }

  const handlePurchase = () => {
    window.open(purchaseMethod.link, '_blank')
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Badge sutil com benefício */}
      {purchaseMethod.is_affiliate && purchaseMethod.affiliate_commission && (
        <div className="flex items-center justify-center space-x-1 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg px-3 py-2">
          <Star className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">
            {purchaseMethod.affiliate_commission}
          </span>
        </div>
      )}

      {/* Botão de compra integrado */}
      <Button
        onClick={handlePurchase}
        className={`w-full ${getColorClasses(purchaseMethod.color)} text-sm`}
        size="sm"
      >
        <span className="mr-2">{purchaseMethod.icon || '🛒'}</span>
        Comprar em {purchaseMethod.name}
        <ExternalLink className="w-3 h-3 ml-2" />
      </Button>

      {/* Dica sutil */}
      {purchaseMethod.description && (
        <p className="text-xs text-gray-500 text-center">
          {purchaseMethod.description}
        </p>
      )}
    </div>
  )
}
