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
        const imageUrl = await imageCache.getImage(imageId, async () => {
          const { data, error } = await supabase
            .from('images')
            .select('image_data, mime_type')
            .eq('id', imageId)
            .single()

          if (error) throw error

          if (data?.image_data) {
            return bytesToBase64(data.image_data, data.mime_type)
          }
          throw new Error('Imagem não encontrada')
        })

        setImageUrl(imageUrl)
      } catch (err) {
        console.error('Erro ao carregar imagem:', err)
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
