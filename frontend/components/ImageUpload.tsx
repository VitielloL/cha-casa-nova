'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { 
  optimizeImageForDatabase, 
  validateImageFile, 
  generateUniqueFilename,
  base64ToBytes 
} from '@/lib/imageUtils'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  onImageUploaded: (imageId: string, imageUrl: string) => void
  currentImageUrl?: string
  className?: string
}

export default function ImageUpload({ onImageUploaded, currentImageUrl, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    // Validar arquivo
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error!)
      return
    }

    try {
      setUploading(true)

      // Otimizar imagem
      const optimizedImage = await optimizeImageForDatabase(file, {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.8,
        maxSizeKB: 200
      })

      // Mostrar preview
      setPreview(optimizedImage.data)

      // Converter para bytes
      const imageBytes = base64ToBytes(optimizedImage.data)
      const filename = generateUniqueFilename(file.name)

      // Salvar no banco
      const { data, error } = await supabase
        .from('images')
        .insert({
          filename,
          original_name: file.name,
          mime_type: optimizedImage.mimeType,
          size_bytes: optimizedImage.size,
          width: optimizedImage.width,
          height: optimizedImage.height,
          image_data: imageBytes
        })
        .select('id')
        .single()

      if (error) throw error

      // Notificar componente pai
      console.debug('[ImageUpload] uploaded image id', data.id)
      onImageUploaded(data.id, optimizedImage.data)

    } catch (err) {
      console.error('Erro ao fazer upload:', err)
      setError('Erro ao fazer upload da imagem')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <Card className="mobile-card">
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Imagem otimizada e salva no banco
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mobile-card">
          <CardContent className="p-6">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="mobile-subtitle text-gray-900 mb-2">
                Upload de Imagem
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Clique para selecionar uma imagem
              </p>
              <Button
                type="button"
                onClick={handleClickUpload}
                disabled={uploading}
                className="mobile-button w-full"
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 mr-2" />
                )}
                {uploading ? 'Processando...' : 'Selecionar Imagem'}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Formatos: JPG, PNG, WebP • Máximo: 5MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
