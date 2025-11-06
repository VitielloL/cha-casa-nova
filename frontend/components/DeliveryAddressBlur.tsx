'use client'

import { Card, CardContent } from '@/components/ui/card'
import BlurLoading from '@/components/BlurLoading'
import { MapPin, Phone, Clock } from 'lucide-react'
import { useInstantDeliveryAddress } from '@/lib/hooks/useInstantData'

interface DeliveryAddress {
  id: string
  title: string
  address: string
  instructions: string
  contact: string
  delivery_hours: string
}

export default function DeliveryAddressBlur() {
  const { data: addresses, isUpdating } = useInstantDeliveryAddress()

  if (!addresses || addresses.length === 0) return null

  const address = addresses[0]

  return (
    <Card className="mobile-card mb-8">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              {address.title}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              {address.address}
            </p>
            {address.instructions && (
              <p className="text-xs text-gray-600 mb-2">
                <strong>Instruções:</strong> {address.instructions}
              </p>
            )}
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              {address.contact_phone && (
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{address.contact_phone}</span>
                </div>
              )}
              {address.contact_name && (
                <div className="flex items-center space-x-1">
                  <span>Contato: {address.contact_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
