'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import type { DeliveryAddress } from '@/lib/supabase'
import { MapPin, Phone, User, Copy, Check } from 'lucide-react'

export default function DeliveryAddress() {
  const [address, setAddress] = useState<DeliveryAddress | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchDeliveryAddress()
  }, [])

  const fetchDeliveryAddress = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_address')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setAddress(data)
    } catch (error) {
      console.error('Erro ao carregar endereço:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  const openMaps = () => {
    if (address) {
      const encodedAddress = encodeURIComponent(address.address)
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
    }
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

  if (!address) {
    return null
  }

  return (
    <Card className="mobile-card mb-6 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="mobile-subtitle flex items-center text-green-800">
          <MapPin className="w-5 h-5 mr-2" />
          {address.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Endereço principal */}
        <div className="p-4 bg-white rounded-lg border border-green-200">
          <p className="text-sm text-gray-800 leading-relaxed">
            {address.address}
          </p>
          {address.instructions && (
            <p className="text-xs text-gray-600 mt-2 italic">
              {address.instructions}
            </p>
          )}
        </div>

        {/* Informações de contato */}
        {(address.contact_name || address.contact_phone) && (
          <div className="space-y-2">
            {address.contact_name && (
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="w-4 h-4 text-green-600" />
                <span>{address.contact_name}</span>
              </div>
            )}
            {address.contact_phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-green-600" />
                <span>{address.contact_phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex space-x-2">
          <Button
            onClick={() => copyToClipboard(address.address)}
            variant="outline"
            size="sm"
            className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copiar Endereço
              </>
            )}
          </Button>
          
          <Button
            onClick={openMaps}
            size="sm"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            <MapPin className="w-4 h-4 mr-1" />
            Ver no Maps
          </Button>
        </div>

        {/* Dica */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>Dica:</strong> Copie o endereço e cole no app de entrega para facilitar a localização!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
