'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { bytesToBase64 } from '@/lib/imageUtils'
import { ImageIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface ReservationImageDebugProps {
  imageId: string
  productName: string
  className?: string
  onImageLoaded?: (imageUrl: string) => void
}

export default function ReservationImageDebug({ 
  imageId, 
  productName, 
  className = "w-32 h-24 object-cover rounded border border-purple-200",
  onImageLoaded
}: ReservationImageDebugProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

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
          .select('image_data, mime_type, filename, size_bytes, width, height')
          .eq('id', imageId)
          .single()

        if (error) {
          console.error('❌ DEBUG - Erro na consulta:', error)
          throw error
        }

        setDebugInfo({
          hasImageData: !!data?.image_data,
          mimeType: data?.mime_type,
          filename: data?.filename,
          sizeBytes: data?.size_bytes,
          width: data?.width,
          height: data?.height,
          imageDataLength: data?.image_data?.length
        })

        if (data?.image_data) {
          // Tentar método 1: bytesToBase64
          try {
            const base64Url = bytesToBase64(data.image_data, data.mime_type)
            setImageUrl(base64Url)
            onImageLoaded?.(base64Url)
          } catch (base64Error) {
            console.warn('⚠️ DEBUG - Erro com bytesToBase64, tentando método alternativo:', base64Error)
            
            // Tentar método 2: URL.createObjectURL (como no ReservationDetails)
            try {
              const blob = new Blob([data.image_data], { type: data.mime_type })
              const url = URL.createObjectURL(blob)
              setImageUrl(url)
              onImageLoaded?.(url)
            } catch (blobError) {
              console.error('❌ DEBUG - Erro com URL.createObjectURL:', blobError)
              const message = blobError instanceof Error ? blobError.message : String(blobError)
              throw new Error('Falha ao converter imagem: ' + message)
            }
          }
        } else {
          throw new Error('Dados da imagem não encontrados')
        }
      } catch (err) {
        console.error('❌ DEBUG - Erro ao carregar imagem:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [imageId])

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
        {debugInfo && (
          <div className="text-xs text-gray-500 text-center">
            <p>ID: {imageId}</p>
            <p>Produto: {productName}</p>
          </div>
        )}
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
          console.error('❌ DEBUG - Erro ao carregar imagem no DOM:', e)
        }}
      />
      <div className="flex items-center space-x-1">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <p className="text-xs text-green-600">Carregada!</p>
      </div>
      {debugInfo && (
        <div className="text-xs text-gray-500 text-center">
          <p>{debugInfo.filename}</p>
          <p>{debugInfo.width}x{debugInfo.height}</p>
          <p>{(debugInfo.sizeBytes / 1024).toFixed(1)}KB</p>
        </div>
      )}
    </div>
  )
}
