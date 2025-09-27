'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase, FeaturedPurchaseMethod } from '@/lib/supabase'
import { ExternalLink, Star, Gift } from 'lucide-react'

export default function FeaturedPurchaseMethods() {
  const [methods, setMethods] = useState<FeaturedPurchaseMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedMethods()
  }, [])

  const fetchFeaturedMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_purchase_methods')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      setMethods(data || [])
    } catch (error) {
      console.error('Erro ao carregar meios de compra:', error)
    } finally {
      setLoading(false)
    }
  }

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500 hover:bg-blue-600 text-white',
      purple: 'bg-purple-500 hover:bg-purple-600 text-white',
      red: 'bg-red-500 hover:bg-red-600 text-white',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      green: 'bg-green-500 hover:bg-green-600 text-white',
      pink: 'bg-pink-500 hover:bg-pink-600 text-white',
      gray: 'bg-gray-500 hover:bg-gray-600 text-white'
    }
    return colorMap[color] || colorMap.blue
  }

  if (loading) {
    return (
      <Card className="mobile-card mb-6">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (methods.length === 0) {
    return null
  }

  return (
    <Card className="mobile-card mb-6 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="mobile-subtitle flex items-center text-orange-800">
          <Star className="w-5 h-5 mr-2" />
          Meios de Compra em Destaque
        </CardTitle>
        <p className="text-sm text-orange-700">
          Compre pelos links abaixo e ganhe benefícios extras! 🎁
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className="p-4 bg-white rounded-lg border border-orange-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {method.icon || '🛒'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {method.name}
                  </h3>
                  {method.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {method.description}
                    </p>
                  )}
                </div>
              </div>
              
              {method.is_affiliate && method.affiliate_commission && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  <Gift className="w-3 h-3" />
                  <span>{method.affiliate_commission}</span>
                </div>
              )}
            </div>

            <Button
              onClick={() => window.open(method.link, '_blank')}
              className={`w-full ${getColorClasses(method.color)}`}
              size="sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Comprar em {method.name}
            </Button>
          </div>
        ))}

        {/* Dica sobre afiliados */}
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800">
            💰 <strong>Dica:</strong> Use os links em destaque para ganhar benefícios extras como pontos, cashback e mais!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
