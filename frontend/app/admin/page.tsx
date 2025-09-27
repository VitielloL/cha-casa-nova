'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { supabase, Product, Category } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useAdminData } from '@/lib/AdminDataContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ArrowLeft, Eye, EyeOff, ShoppingCart, User, Phone, Mail, LogOut, Image, Clock, Settings, Users, MapPin, Star, Package, Gift, CheckCircle, XCircle, Tag, Edit, Trash2 } from 'lucide-react'
import ImageDisplay from '@/components/ImageDisplay'
import ResponsiveContainer from '@/components/ResponsiveContainer'

function AdminPageContent() {
  const { admin, logout } = useAuth()
  const { products, categories, loading, updateProduct, deleteProduct } = useAdminData()
  const [revealedReservations, setRevealedReservations] = useState<Set<string>>(new Set())
  const [updating, setUpdating] = useState<Set<string>>(new Set())
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    item_type: 'principal' as 'principal' | 'adicional'
  })

  // Dados agora vêm do contexto global

  const toggleRevealReservation = (productId: string) => {
    const newRevealed = new Set(revealedReservations)
    if (newRevealed.has(productId)) {
      newRevealed.delete(productId)
    } else {
      newRevealed.add(productId)
    }
    setRevealedReservations(newRevealed)
  }

  const updateProductStatus = async (productId: string, newStatus: string) => {
    try {
      setUpdating(prev => new Set(prev).add(productId))
      
      console.log('🔄 PAINEL ADMIN - Atualizando produto:', productId, 'para status:', newStatus)
      
      // Preparar dados para atualização (usando a mesma lógica da página de produtos)
      const updateData: any = {
        reservation_status: newStatus,
        reserved_by: newStatus === 'available' ? null : undefined,
        reserved_contact: newStatus === 'available' ? null : undefined,
        received_at: newStatus === 'received' ? new Date().toISOString() : null,
        cancelled_at: newStatus === 'cancelled' ? new Date().toISOString() : null,
        reserved: newStatus !== 'available'
      }

      console.log('📝 PAINEL ADMIN - Dados para atualização:', updateData)

      // Atualizar no banco de dados
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()

      console.log('📊 PAINEL ADMIN - Resultado:', error ? 'ERRO' : 'SUCESSO')
      console.log('❌ Erro:', error)
      console.log('✅ Data:', data)

      if (error) {
        console.error('❌ PAINEL ADMIN - Erro:', error)
        alert('Erro ao atualizar produto: ' + error.message)
        return
      }

      if (!data || data.length === 0) {
        console.error('❌ PAINEL ADMIN - Nenhum produto atualizado')
        alert('Produto não encontrado')
        return
      }

      // Atualizar contexto global
      const updatedProductFromDB = data[0]
      console.log('✅ PAINEL ADMIN - Produto atualizado no banco:', updatedProductFromDB)
      console.log('✅ PAINEL ADMIN - Status do produto atualizado:', updatedProductFromDB.reservation_status)
      
      updateProduct(updatedProductFromDB)

      // Mensagem de sucesso
      const messages = {
        'available': 'Produto liberado com sucesso!',
        'received': 'Produto marcado como recebido!',
        'cancelled': 'Produto cancelado com sucesso!',
        'reserved': 'Produto voltou para reservado!'
      }

      alert(messages[newStatus as keyof typeof messages] || 'Status atualizado!')
      
    } catch (error) {
      console.error('❌ PAINEL ADMIN - Erro geral:', error)
      alert('Erro ao atualizar produto: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      category_id: product.category_id,
      item_type: product.item_type
    })
    setShowEditModal(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja APAGAR este produto? Esta ação não pode ser desfeita.')) return

    try {
      console.log('🗑️ PAINEL ADMIN - Iniciando EXCLUSÃO do produto:', productId)
      
      // Primeiro, verificar se o produto existe
      console.log('🔍 PAINEL ADMIN - Verificando se o produto existe...')
      const { data: productData, error: productCheckError } = await supabase
        .from('products')
        .select('id, name, reservation_status')
        .eq('id', productId)
        .single()

      if (productCheckError) {
        console.error('❌ PAINEL ADMIN - Erro ao verificar produto:', productCheckError)
        throw new Error('Produto não encontrado')
      }

      console.log('✅ PAINEL ADMIN - Produto encontrado:', productData)
      
      // Verificar métodos de compra relacionados
      console.log('🔍 PAINEL ADMIN - Verificando métodos de compra relacionados...')
      const { data: methodsData, error: methodsCheckError } = await supabase
        .from('product_purchase_methods')
        .select('id, name')
        .eq('product_id', productId)

      if (methodsCheckError) {
        console.warn('⚠️ PAINEL ADMIN - Erro ao verificar métodos de compra:', methodsCheckError)
      } else {
        console.log('📊 PAINEL ADMIN - Métodos de compra encontrados:', methodsData?.length || 0)
      }

      // Deletar métodos de compra relacionados (se houver)
      if (methodsData && methodsData.length > 0) {
        console.log('🗑️ PAINEL ADMIN - Deletando métodos de compra relacionados...')
        const { error: methodsError } = await supabase
          .from('product_purchase_methods')
          .delete()
          .eq('product_id', productId)

        if (methodsError) {
          console.error('❌ PAINEL ADMIN - Erro ao deletar métodos de compra:', methodsError)
          throw new Error('Erro ao deletar métodos de compra: ' + methodsError.message)
        } else {
          console.log('✅ PAINEL ADMIN - Métodos de compra deletados com sucesso')
        }
      } else {
        console.log('ℹ️ PAINEL ADMIN - Nenhum método de compra encontrado')
      }
      
      // Verificar imagens de reserva relacionadas
      console.log('🔍 PAINEL ADMIN - Verificando imagens de reserva relacionadas...')
      const { data: imagesData, error: imagesCheckError } = await supabase
        .from('reservation_images')
        .select('id, filename')
        .eq('product_id', productId)

      if (imagesCheckError) {
        console.warn('⚠️ PAINEL ADMIN - Erro ao verificar imagens de reserva:', imagesCheckError)
      } else {
        console.log('📊 PAINEL ADMIN - Imagens de reserva encontradas:', imagesData?.length || 0)
      }

      // Deletar imagens de reserva relacionadas (se houver)
      if (imagesData && imagesData.length > 0) {
        console.log('🗑️ PAINEL ADMIN - Deletando imagens de reserva relacionadas...')
        const { error: imagesError } = await supabase
          .from('reservation_images')
          .delete()
          .eq('product_id', productId)

        if (imagesError) {
          console.error('❌ PAINEL ADMIN - Erro ao deletar imagens de reserva:', imagesError)
          throw new Error('Erro ao deletar imagens de reserva: ' + imagesError.message)
        } else {
          console.log('✅ PAINEL ADMIN - Imagens de reserva deletadas com sucesso')
        }
      } else {
        console.log('ℹ️ PAINEL ADMIN - Nenhuma imagem de reserva encontrada')
      }
      
      // Finalmente, tentar deletar o produto
      console.log('🗑️ PAINEL ADMIN - Tentando DELETAR produto...')
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (deleteError) {
        console.error('❌ PAINEL ADMIN - ERRO NA EXCLUSÃO DO PRODUTO:', deleteError)
        console.error('❌ PAINEL ADMIN - Detalhes completos do erro:', {
          message: deleteError.message,
          details: deleteError.details,
          hint: deleteError.hint,
          code: deleteError.code
        })
        
        // Mostrar o erro completo para o usuário
        alert(`ERRO AO DELETAR PRODUTO:\n\nMensagem: ${deleteError.message}\n\nDetalhes: ${deleteError.details || 'N/A'}\n\nCódigo: ${deleteError.code || 'N/A'}\n\nDica: ${deleteError.hint || 'N/A'}`)
        throw new Error('Erro ao deletar produto: ' + deleteError.message)
      }

      console.log('✅ PAINEL ADMIN - Produto DELETADO com sucesso!')
      
      // Atualizar contexto global
      deleteProduct(productId)
      
      console.log('✅ PAINEL ADMIN - Produto removido do contexto local')
      alert('Produto DELETADO com sucesso!')
    } catch (error) {
      console.error('❌ PAINEL ADMIN - Erro ao deletar produto:', error)
      alert('Erro ao deletar produto: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    }
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !formData.name || !formData.category_id) {
      alert('Nome e categoria são obrigatórios')
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .update(formData)
        .eq('id', editingProduct.id)

      if (error) throw error

      const updatedProduct = { ...editingProduct, ...formData }
      updateProduct(updatedProduct)

      setShowEditModal(false)
      setEditingProduct(null)
      alert('Produto atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      alert('Erro ao atualizar produto.')
    }
  }

  const reservedProducts = products.filter(p => p.reservation_status === 'reserved')
  const receivedProducts = products.filter(p => p.reservation_status === 'received')
  const cancelledProducts = products.filter(p => p.reservation_status === 'cancelled')
  const availableProducts = products.filter(p => p.reservation_status === 'available')
  
  // Debug logs
  console.log('🔍 DEBUG - Total produtos:', products.length)
  console.log('🔍 DEBUG - Produtos reservados:', reservedProducts.length)
  console.log('🔍 DEBUG - Produtos recebidos:', receivedProducts.length)
  console.log('🔍 DEBUG - Produtos cancelados:', cancelledProducts.length)
  console.log('🔍 DEBUG - Produtos disponíveis:', availableProducts.length)
  console.log('🔍 DEBUG - Status dos produtos:', products.map(p => ({ name: p.name, status: p.reservation_status, reserved: p.reserved })))
  
  // Debug específico para produtos recebidos
  console.log('🔍 DEBUG - Produtos recebidos detalhado:', receivedProducts.map(p => ({ 
    id: p.id, 
    name: p.name, 
    status: p.reservation_status, 
    received_at: p.received_at 
  })))

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
    <ResponsiveContainer className="h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Olá, {admin?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{reservedProducts.length}</div>
            <div className="text-sm text-gray-600">Reservados</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{receivedProducts.length}</div>
            <div className="text-sm text-gray-600">Recebidos</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{cancelledProducts.length}</div>
            <div className="text-sm text-gray-600">Cancelados</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{availableProducts.length}</div>
            <div className="text-sm text-gray-600">Disponíveis</div>
          </CardContent>
        </Card>
      </div>

      {/* Produtos Reservados */}
      <div className="mb-8">
        <h2 className="mobile-subtitle text-gray-900 mb-4">
          Produtos Reservados ({reservedProducts.length})
        </h2>
        
        {reservedProducts.length === 0 ? (
          <Card className="mobile-card">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">Nenhum produto reservado ainda.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservedProducts.map((product) => (
              <Card key={product.id} className="mobile-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Categoria: {product.category?.name}
                      </p>
                    </div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      Reservado
                    </div>
                  </div>

                  {/* Dados de quem reservou */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Dados de quem reservou:
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRevealReservation(product.id)}
                        className="h-8 px-2"
                      >
                        {revealedReservations.has(product.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    
                    {revealedReservations.has(product.id) ? (
                      <div className="space-y-3">
                        {/* Dados básicos */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-900">
                              {product.reserved_by}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {product.reserved_contact?.includes('@') ? (
                              <Mail className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Phone className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="text-sm text-gray-900">
                              {product.reserved_contact}
                            </span>
                          </div>
                        </div>

                        {/* Mensagem Carinhosa */}
                        {product.reservation_message && (
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-start space-x-2">
                              <span className="text-lg">💝</span>
                              <div>
                                <h4 className="font-semibold text-yellow-800 text-sm mb-1">Mensagem Carinhosa:</h4>
                                <p className="text-sm text-yellow-700 italic">"{product.reservation_message}"</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Foto Fofa */}
                        {product.reservation_image_id && (
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-start space-x-2">
                              <span className="text-lg">📸</span>
                              <div>
                                <h4 className="font-semibold text-purple-800 text-sm mb-2">Foto Fofa:</h4>
                                <ImageDisplay
                                  imageId={product.reservation_image_id}
                                  alt="Foto fofa da reserva"
                                  className="w-32 h-24 object-cover rounded border border-purple-200"
                                />
                                <p className="text-xs text-purple-600 mt-1">
                                  Que foto linda! 🥰
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <div className="w-32 h-4 bg-gray-300 rounded"></div>
                      </div>
                    )}
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex space-x-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateProductStatus(product.id, 'available')}
                      disabled={updating.has(product.id)}
                      className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                    >
                      {updating.has(product.id) ? (
                        <Clock className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      Liberar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateProductStatus(product.id, 'received')}
                      disabled={updating.has(product.id)}
                      className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      {updating.has(product.id) ? (
                        <Clock className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Package className="w-4 h-4 mr-1" />
                      )}
                      Recebido
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateProductStatus(product.id, 'cancelled')}
                      disabled={updating.has(product.id)}
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {updating.has(product.id) ? (
                        <Clock className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Produtos Recebidos */}
      <div className="mb-8">
        <h2 className="mobile-subtitle text-gray-900 mb-4">
          Produtos Recebidos ({receivedProducts.length})
        </h2>
        
        {receivedProducts.length === 0 ? (
          <Card className="mobile-card">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">Nenhum produto recebido ainda.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {receivedProducts.map((product) => (
              <Card key={product.id} className="mobile-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Categoria: {product.category?.name}
                      </p>
                      {product.received_at && (
                        <p className="text-xs text-gray-400 mt-1">
                          Recebido em: {new Date(product.received_at).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Recebido
                    </div>
                  </div>

                  {/* Dados de quem reservou */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Dados de quem reservou:
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRevealReservation(product.id)}
                        className="h-8 px-2"
                      >
                        {revealedReservations.has(product.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    
                    {revealedReservations.has(product.id) ? (
                      <div className="space-y-3">
                        {/* Dados básicos */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-900">
                              {product.reserved_by}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {product.reserved_contact?.includes('@') ? (
                              <Mail className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Phone className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="text-sm text-gray-900">
                              {product.reserved_contact}
                            </span>
                          </div>
                        </div>

                        {/* Mensagem Carinhosa */}
                        {product.reservation_message && (
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-start space-x-2">
                              <span className="text-lg">💝</span>
                              <div>
                                <h4 className="font-semibold text-yellow-800 text-sm mb-1">Mensagem Carinhosa:</h4>
                                <p className="text-sm text-yellow-700 italic">"{product.reservation_message}"</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Foto Fofa */}
                        {product.reservation_image_id && (
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-start space-x-2">
                              <span className="text-lg">📸</span>
                              <div>
                                <h4 className="font-semibold text-purple-800 text-sm mb-1">Foto Fofa:</h4>
                                <div className="w-32 h-24 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <span className="text-purple-600 text-xs">Imagem da reserva</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Clique no olho para ver os dados
                      </p>
                    )}
                  </div>

                  {/* Ações para produtos recebidos */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateProductStatus(product.id, 'available')}
                      disabled={updating.has(product.id)}
                      className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      {updating.has(product.id) ? (
                        <Clock className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Package className="w-4 h-4 mr-1" />
                      )}
                      Liberar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateProductStatus(product.id, 'reserved')}
                      disabled={updating.has(product.id)}
                      className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      {updating.has(product.id) ? (
                        <Clock className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 mr-1" />
                      )}
                      Voltar Reservado
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita.')) {
                          handleDeleteProduct(product.id)
                        }
                      }}
                      disabled={updating.has(product.id)}
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {updating.has(product.id) ? (
                        <Clock className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
                      Remover
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Produtos Disponíveis */}
      <div>
        <h2 className="mobile-subtitle text-gray-900 mb-4">
          Produtos Disponíveis ({availableProducts.length})
        </h2>
        
        {availableProducts.length === 0 ? (
          <Card className="mobile-card">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">Nenhum produto disponível.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {availableProducts.map((product) => (
              <Card key={product.id} className="mobile-card cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleEditProduct(product)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Categoria: {product.category?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Tipo: {product.item_type === 'principal' ? 'Principal' : 'Adicional'}
                      </p>
                      {product.description && (
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Disponível
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditProduct(product)
                          }}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 px-2"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProduct(product.id)
                          }}
                          className="text-red-600 border-red-200 hover:bg-red-50 h-8 px-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Produtos</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disponíveis</p>
              <p className="text-2xl font-bold text-gray-900">{availableProducts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reservados</p>
              <p className="text-2xl font-bold text-gray-900">{reservedProducts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recebidos</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.reservation_status === 'received').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição de Produto */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Categoria *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-item-type">Tipo de Item</Label>
              <Select
                value={formData.item_type}
                onValueChange={(value: 'principal' | 'adicional') => setFormData(prev => ({ ...prev, item_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal">Principal</SelectItem>
                  <SelectItem value="adicional">Adicional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1">
                Atualizar
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </ResponsiveContainer>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminPageContent />
    </ProtectedRoute>
  )
}
