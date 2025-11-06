'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ImageIcon, Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'

interface ReservationImageSimpleProps {
  imageId: string
  productName: string
  className?: string
  onImageLoaded?: (imageUrl: string) => void
}

export default function ReservationImageSimple({ 
  imageId, 
  productName, 
  className = "w-32 h-24 object-cover rounded border border-purple-200",
  onImageLoaded
}: ReservationImageSimpleProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!imageId) {
      setLoading(false)
      setError('Nenhum ID de imagem fornecido')
      return
    }

    const fetchImage = async () => {
      try {
        const { data, error } = await supabase
          .from('images')
          .select('image_data, mime_type, filename, size_bytes')
          .eq('id', imageId)
          .single()

        if (error) {
          console.error('❌ SIMPLE DEBUG - Erro na consulta:', error)
          throw error
        }

        if (data?.image_data) {
          // Usar o mesmo método que funciona no ReservationDetails
          const blob = new Blob([data.image_data], { type: data.mime_type })
          const url = URL.createObjectURL(blob)
          setImageUrl(url)
          onImageLoaded?.(url)
        } else {
          throw new Error('Dados da imagem não encontrados')
        }
      } catch (err) {
        console.error('❌ SIMPLE DEBUG - Erro ao carregar imagem:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [imageId, onImageLoaded])

  // Cleanup da URL quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="w-32 h-24 bg-purple-100 rounded-lg flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
        <p className="text-xs text-purple-600">Carregando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="w-32 h-24 bg-red-100 rounded-lg flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-xs text-red-600 text-center">Erro: {error}</p>
        <p className="text-xs text-gray-500 text-center">ID: {imageId}</p>
      </div>
    )
  }

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-xs text-gray-600">Imagem não encontrada</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <img
        src={imageUrl}
        alt={`Foto fofa da reserva - ${productName}`}
        className={className}
        onError={(e) => {
          console.error('❌ SIMPLE DEBUG - Erro ao carregar imagem no DOM:', e)
        }}
      />
      <div className="flex items-center space-x-1">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <p className="text-xs text-green-600">Carregada!</p>
      </div>
    </div>
  )
}
