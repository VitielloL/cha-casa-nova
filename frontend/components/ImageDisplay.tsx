'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { bytesToBase64 } from '@/lib/imageUtils'
import { imageCache } from '@/lib/imageCache'
import { ImageIcon, Loader2 } from 'lucide-react'

interface ImageDisplayProps {
  imageId: string
  alt?: string
  className?: string
  fallbackClassName?: string
}

export default function ImageDisplay({ 
  imageId, 
  alt = 'Imagem', 
  className = 'w-full h-48 object-cover rounded-lg',
  fallbackClassName = 'w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center'
}: ImageDisplayProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!imageId) {
      setLoading(false)
      return
    }

    const fetchImage = async () => {
      try {
        console.log('[ImageDisplay] 🔍 INICIANDO busca de imagem', { imageId })
        const imageUrl = await imageCache.getImage(imageId, async () => {
          console.log('[ImageDisplay] 📡 Fazendo query no Supabase', { imageId })
          const { data, error } = await supabase
            .from('images')
            .select('image_data, mime_type')
            .eq('id', imageId)
            .single()

          if (error) {
            console.error('[ImageDisplay] ❌ Erro no Supabase', error)
            throw error
          }

          const imageData = (data as any)?.image_data
          console.log('[ImageDisplay] ✅ Dados recebidos do Supabase', {
            hasData: !!data,
            hasImage: !!imageData,
            mime: data?.mime_type,
            imageType: imageData ? typeof imageData : null,
            isUint8Array: imageData instanceof Uint8Array,
            isArray: Array.isArray(imageData),
            isString: typeof imageData === 'string',
            isObject: typeof imageData === 'object' && imageData !== null,
            constructor: imageData?.constructor?.name,
            stringPreview: typeof imageData === 'string' ? imageData.substring(0, 200) : null,
            objectKeys: typeof imageData === 'object' && imageData !== null ? Object.keys(imageData).slice(0, 10) : null,
            stringStartsWith: typeof imageData === 'string' ? {
              startsWithData: imageData.startsWith('data:'),
              startsWithBrace: imageData.startsWith('{'),
              startsWithQuote: imageData.startsWith('"'),
              startsWithHex: imageData.startsWith('\\x'),
            } : null,
          })

          if (imageData) {
            console.log('[ImageDisplay] 🔄 Chamando bytesToBase64...', { 
              imageDataType: typeof imageData,
              mimeType: data.mime_type 
            })
            const url = bytesToBase64(imageData, data.mime_type)
            console.log('[ImageDisplay] ✅ Data URL criada', { 
              length: url?.length,
              startsWith: url?.substring(0, 50)
            })
            return url
          }
          throw new Error('Imagem não encontrada')
        })

        console.log('[ImageDisplay] ✅ Imagem carregada com sucesso', { imageUrl: imageUrl?.substring(0, 50) })
        setImageUrl(imageUrl)
      } catch (err) {
        console.error('[ImageDisplay] ❌ Erro ao carregar imagem:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [imageId])

  if (loading) {
    return (
      <div className={fallbackClassName}>
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    )
  }

  if (error || !imageUrl) {
    return (
      <div className={fallbackClassName}>
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      loading="lazy"
    />
  )
}
