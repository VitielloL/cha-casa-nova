'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase, Image } from '@/lib/supabase'
import ImageDisplay from '@/components/ImageDisplay'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ArrowLeft, Trash2, Image as ImageIcon, Calendar, HardDrive } from 'lucide-react'

function AdminImagesContent() {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Erro ao carregar imagens:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return

    try {
      const { error } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId)

      if (error) throw error

      // Recarregar lista
      fetchImages()
    } catch (error) {
      console.error('Erro ao excluir imagem:', error)
      alert('Erro ao excluir imagem. Tente novamente.')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="mobile-title text-gray-900">Gerenciar Imagens</h1>
          <p className="text-sm text-gray-500">
            {images.length} imagem{images.length !== 1 ? 's' : ''} cadastrada{images.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <ImageIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{images.length}</div>
            <div className="text-sm text-gray-600">Total de Imagens</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <HardDrive className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {formatFileSize(images.reduce((total, img) => total + img.size_bytes, 0))}
            </div>
            <div className="text-sm text-gray-600">Espaço Usado</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Imagens */}
      <div className="space-y-4">
        {images.map((image) => (
          <Card key={image.id} className="mobile-card">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <ImageDisplay
                    imageId={image.id}
                    alt={image.original_name}
                    className="w-20 h-20 object-cover rounded-lg"
                    fallbackClassName="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center"
                  />
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {image.original_name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {image.filename}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <HardDrive className="w-3 h-3" />
                      <span>{formatFileSize(image.size_bytes)}</span>
                    </div>
                    {image.width && image.height && (
                      <span>{image.width} × {image.height}</span>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(image.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex-shrink-0">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteImage(image.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <Card className="mobile-card">
          <CardContent className="p-8 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="mobile-subtitle text-gray-900 mb-2">
              Nenhuma imagem cadastrada
            </h2>
            <p className="text-gray-600 mb-6">
              As imagens aparecerão aqui quando você cadastrar produtos.
            </p>
            <Link href="/cadastro">
              <Button>
                Cadastrar Produto com Imagem
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AdminImagesPage() {
  return (
    <ProtectedRoute>
      <AdminImagesContent />
    </ProtectedRoute>
  )
}
