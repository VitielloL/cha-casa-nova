'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ImageDisplay from '@/components/ImageDisplay'
import { MessageCircle, Image as ImageIcon, User, UserX } from 'lucide-react'

interface ReservationDetailsProps {
  product: {
    id: string
    name: string
    reserved_by?: string
    reserved_contact?: string
    is_anonymous: boolean
    reservation_message?: string
    reservation_image_id?: string
  }
  className?: string
}

export default function ReservationDetails({ product, className = "" }: ReservationDetailsProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product.reservation_image_id) {
      fetchImage()
    }
  }, [product.reservation_image_id])

  const fetchImage = async () => {
    if (!product.reservation_image_id) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('images')
        .select('image_data, mime_type')
        .eq('id', product.reservation_image_id)
        .single()

      if (error) throw error

      if (data?.image_data) {
        const blob = new Blob([data.image_data], { type: data.mime_type })
        const url = URL.createObjectURL(blob)
        setImageUrl(url)
      }
    } catch (error) {
      console.error('Erro ao carregar imagem:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!product.reserved_by && !product.is_anonymous) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Informações da Reserva */}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
          <span>🎁</span>
          <span>Detalhes da Reserva</span>
        </h4>
        
        <div className="space-y-2 text-sm">
          <p><strong>Produto:</strong> {product.name}</p>
          
          {product.is_anonymous ? (
            <div className="flex items-center space-x-2 text-purple-700">
              <UserX className="w-4 h-4" />
              <span>Reservado anonimamente 🕵️‍♂️</span>
            </div>
          ) : (
            <>
              <p><strong>Reservado por:</strong> {product.reserved_by}</p>
              <p><strong>Contato:</strong> {product.reserved_contact}</p>
            </>
          )}
        </div>
      </div>

      {/* Mensagem Carinhosa */}
      {product.reservation_message && (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <MessageCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Mensagem Carinhosa:</h4>
              <p className="text-sm text-yellow-700 italic">"{product.reservation_message}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Foto Fofa */}
      {product.reservation_image_id && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-start space-x-2">
            <ImageIcon className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Foto Fofa:</h4>
              {loading ? (
                <div className="w-32 h-24 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                </div>
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Foto fofa da reserva"
                  className="w-full max-w-xs h-32 object-cover rounded-lg border border-purple-200"
                />
              ) : (
                <p className="text-sm text-purple-600">Erro ao carregar imagem</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
