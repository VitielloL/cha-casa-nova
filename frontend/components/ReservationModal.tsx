'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase, Product } from '@/lib/supabase'
import ContactInput from '@/components/ContactInput'
import { useLocalReservations } from '@/lib/hooks/useLocalReservations'
import { ShoppingCart, CheckCircle, User, UserX } from 'lucide-react'
import { 
  optimizeImageForDatabase, 
  base64ToBytes, 
  generateUniqueFilename 
} from '@/lib/imageUtils'

interface ReservationModalProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function ReservationModal({ product, open, onOpenChange, onSuccess }: ReservationModalProps) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [contactValid, setContactValid] = useState(false)
  const [formattedContact, setFormattedContact] = useState('')
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { addReservation } = useLocalReservations()

  // Limpar interval quando componente for desmontado
  useEffect(() => {
    return () => {
      // Cleanup será feito automaticamente pelo React
    }
  }, [])

  const validateForm = (): boolean => {
    // Se for anônimo, não precisa validar nome nem contato
    if (isAnonymous) {
      return true
    }

    // Se não for anônimo, validar nome e contato
    if (!name.trim()) {
      alert('Nome é obrigatório quando não for anônimo')
      return false
    }

    if (!contact.trim()) {
      alert('Contato é obrigatório quando não for anônimo')
      return false
    }

    if (!contactValid) {
      alert('Contato inválido')
      return false
    }

    return true
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.')
        return
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.')
        return
      }
      
      setImageFile(file)
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Otimizar imagem antes de salvar (igual ao ImageUpload)
      const optimizedImage = await optimizeImageForDatabase(file, {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.8,
        maxSizeKB: 200
      })
      
      // Converter para bytes usando a função correta
      const imageBytes = base64ToBytes(optimizedImage.data)
      const filename = generateUniqueFilename(file.name)
      
      // Upload para Supabase
      const { data, error } = await supabase
        .from('images')
        .insert([{
          filename,
          original_name: file.name,
          mime_type: optimizedImage.mimeType,
          size_bytes: optimizedImage.size,
          width: optimizedImage.width,
          height: optimizedImage.height,
          image_data: imageBytes
        }])
        .select('id')
        .single()
      
      if (error) throw error
      return data.id
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar formulário
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      let imageId = null
      
      // Upload da imagem se houver
      if (imageFile) {
        imageId = await uploadImage(imageFile)
        if (!imageId) {
          alert('Erro ao fazer upload da imagem. Tente novamente.')
          return
        }
      }

      const updateData: any = {
        reserved: true,
        reservation_status: 'reserved',
        is_anonymous: isAnonymous,
        reservation_message: message.trim() || null,
        reservation_image_id: imageId
      }

      // Se não for anônimo, incluir dados da pessoa
      if (!isAnonymous) {
        updateData.reserved_by = name.trim()
        updateData.reserved_contact = contact.trim()
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id)

      if (error) throw error

      // Adicionar à reserva local
      const reservationData = {
        productId: product.id,
        productName: product.name,
        categoryName: product.category?.name || 'Categoria',
        reservedBy: isAnonymous ? 'Anônimo' : name.trim(),
        reservedContact: isAnonymous ? '' : contact.trim(),
        isAnonymous,
        message: message.trim() || undefined,
        imagePreview: imagePreview || undefined
      }
      
      addReservation(reservationData)

      setSuccess(true)
    } catch (error) {
      console.error('Erro ao reservar produto:', error)
      alert('Erro ao reservar produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setContact('')
    setIsAnonymous(false)
    setSuccess(false)
    setContactValid(false)
    setFormattedContact('')
    setMessage('')
    setImageFile(null)
    setImagePreview(null)
    onOpenChange(false)
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="mobile-container max-w-md max-h-[90vh] overflow-y-auto">
          <div className="text-center py-4">
            {/* Ícone animado */}
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            {/* Título principal */}
            <h3 className="mobile-subtitle text-gray-900 mb-3">
              🎉 Produto Reservado com Sucesso!
            </h3>
            
            {/* Informações do produto */}
            <div className="p-3 bg-blue-50 rounded-lg mb-3">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Produto:</strong> {product.name}
              </p>
              {isAnonymous ? (
                <div className="flex items-center space-x-2 text-sm text-purple-700">
                  <UserX className="w-4 h-4" />
                  <span><strong>Reservado anonimamente</strong> 🕵️‍♂️</span>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Reservado por:</strong> {name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Contato:</strong> {formattedContact || contact}
                  </p>
                </>
              )}
            </div>


            {/* Mensagem Carinhosa */}
            {message && message.trim() && (
              <div className="p-3 bg-yellow-50 rounded-lg mb-3 border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <span className="text-2xl">💝</span>
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Mensagem Carinhosa:</h4>
                    <p className="text-sm text-yellow-700 italic">"{message}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Foto Fofa */}
            {imagePreview && imagePreview.trim() && (
              <div className="p-3 bg-purple-50 rounded-lg mb-3 border border-purple-200">
                <div className="flex items-start space-x-2">
                  <span className="text-2xl">📸</span>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Foto Fofa:</h4>
                    <img
                      src={imagePreview}
                      alt="Foto fofa da reserva"
                      className="w-full max-w-32 h-20 object-cover rounded border border-purple-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <p className="text-xs text-purple-600 mt-1">
                      Que foto linda! 🥰
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Instruções */}
            <div className="p-3 bg-blue-50 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                📋 Próximos Passos:
              </h4>
              <p className="text-sm text-blue-800 mb-2">
                Para finalizar a compra, acesse a loja ou vá até o endereço indicado.
              </p>
            </div>
            
            {/* Informações da loja */}
            {(product.store_link || product.store_address) && (
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  🏪 Informações da Loja:
                </h4>
                {product.store_address && (
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>📍 Endereço:</strong><br />
                    {product.store_address}
                  </p>
                )}
                {product.store_link && (
                  <a
                    href={product.store_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    🌐 Ver na Loja Online
                  </a>
                )}
              </div>
            )}
            
            {/* Botão de fechar */}
            <Button 
              onClick={() => {
                onSuccess() // Recarrega a página para atualizar os produtos
                handleClose()
              }} 
              className="mobile-button w-full bg-green-500 hover:bg-green-600"
            >
              ✅ Entendi, Fechar
            </Button>
            
            {/* Informação adicional */}
            <div className="mt-4">
              <div className="inline-flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600">
                  Reserva confirmada com sucesso! 🎉
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mobile-container max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mobile-subtitle text-center">
            Reservar Produto
          </DialogTitle>
          <DialogDescription className="text-center">
            {product.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Opção Anônima */}
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => {
                  setIsAnonymous(checked as boolean)
                  if (checked) {
                    setName('')
                    setContact('')
                    setContactValid(false)
                    setFormattedContact('')
                  }
                }}
              />
              <div className="flex-1">
                <Label htmlFor="anonymous" className="flex items-center space-x-2 cursor-pointer">
                  <UserX className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-900">Reservar anonimamente</span>
                </Label>
                <p className="text-xs text-purple-700 mt-1">
                  🕵️‍♂️ Deixe o mistério no ar! O admin vai ficar curioso...
                </p>
              </div>
            </div>
          </div>

          {/* Campos de identificação (só aparecem se não for anônimo) */}
          {!isAnonymous && (
            <>
              <div>
                <Label htmlFor="name">Seu nome *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  required
                  className="mt-1"
                />
              </div>

              <ContactInput
                value={contact}
                onChange={setContact}
                onValidationChange={(isValid, formattedValue) => {
                  setContactValid(isValid)
                  if (formattedValue) {
                    setFormattedContact(formattedValue)
                  }
                }}
                label="WhatsApp"
                placeholder="21986189443"
                required
              />
            </>
          )}

          {/* Campo de Mensagem Carinhosa */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Label htmlFor="message" className="flex items-center space-x-2 text-blue-800 font-medium text-sm">
              <span>💝</span>
              <span>Mensagem Carinhosa (opcional)</span>
            </Label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Deixe uma mensagem fofa! 💕"
              className="mt-2 w-full p-2 text-sm border border-blue-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              maxLength={500}
            />
            <p className="text-xs text-blue-600 mt-1">
              {message.length}/500
            </p>
          </div>

          {/* Campo de Imagem Fofa */}
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Label htmlFor="image" className="flex items-center space-x-2 text-purple-800 font-medium text-sm">
              <span>📸</span>
              <span>Foto Fofa (opcional)</span>
            </Label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 w-full p-2 text-sm border border-purple-200 rounded-lg file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-32 h-20 object-cover rounded border border-purple-200"
                />
                <p className="text-xs text-purple-600 mt-1">
                  Preview! 🥰
                </p>
              </div>
            )}
            <p className="text-xs text-purple-600 mt-1">
              Máx 5MB. JPG, PNG, GIF
            </p>
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              disabled={loading || (!isAnonymous && (!name.trim() || !contact.trim() || !contactValid))}
              className="mobile-button w-full bg-blue-500 hover:bg-blue-600"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <ShoppingCart className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Reservando...' : 'Confirmar Reserva'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="mobile-button w-full"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
