'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { supabase, Product, Category } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, ShoppingCart, Package, XCircle, CheckCircle, Clock } from 'lucide-react'
import ImageDisplay from '@/components/ImageDisplay'
import ResponsiveContainer from '@/components/ResponsiveContainer'

function AdminProdutosContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [revealedReservations, setRevealedReservations] = useState<Set<string>>(new Set())
  const [updating, setUpdating] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    item_type: 'principal' as 'principal' | 'adicional',
    image_id: null as string | null
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsResult, categoriesResult] = await Promise.all([
        supabase
          .from('products')
          .select(`
            *,
            category:categories(name)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .order('name')
      ])

      if (productsResult.error) throw productsResult.error
      if (categoriesResult.error) throw categoriesResult.error

      setProducts(productsResult.data || [])
      setCategories(categoriesResult.data || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.category_id) {
      alert('Nome e categoria são obrigatórios')
      return
    }

    try {
      if (editingProduct) {
        // Atualizar produto
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id)

        if (error) throw error

        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id ? { ...p, ...formData } : p
        ))
      } else {
        // Criar produto
        const { data, error } = await supabase
          .from('products')
          .insert([formData])
          .select()

        if (error) throw error

        setProducts(prev => [data[0], ...prev])
      }

      setShowForm(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        category_id: '',
        item_type: 'principal',
        image_id: null
      })
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar. Tente novamente.')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      category_id: product.category_id,
      item_type: product.item_type,
      image_id: product.image_id ?? null
    })
    setShowForm(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      setProducts(prev => prev.filter(p => p.id !== productId))
      alert('Produto excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      alert('Erro ao excluir produto.')
    }
  }

  const updateProductStatus = async (productId: string, newStatus: 'available' | 'reserved' | 'received' | 'cancelled') => {
    try {
      setUpdating(prev => new Set(prev).add(productId))
      
      const { error } = await supabase
        .from('products')
        .update({ 
          reservation_status: newStatus,
          reserved_by: newStatus === 'available' ? null : undefined,
          reserved_contact: newStatus === 'available' ? null : undefined,
          received_at: newStatus === 'received' ? new Date().toISOString() : null,
          cancelled_at: newStatus === 'cancelled' ? new Date().toISOString() : null
        })
        .eq('id', productId)

      if (error) throw error

      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              reservation_status: newStatus,
              reserved_by: newStatus === 'available' ? null : product.reserved_by,
              reserved_contact: newStatus === 'available' ? null : product.reserved_contact,
              received_at: newStatus === 'received' ? new Date().toISOString() : product.received_at,
              cancelled_at: newStatus === 'cancelled' ? new Date().toISOString() : product.cancelled_at
            }
          : product
      ))

      alert(`Produto ${newStatus === 'available' ? 'liberado' : newStatus === 'received' ? 'marcado como recebido' : 'cancelado'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      alert('Erro ao atualizar produto')
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const toggleRevealReservation = (productId: string) => {
    const newRevealed = new Set(revealedReservations)
    if (newRevealed.has(productId)) {
      newRevealed.delete(productId)
    } else {
      newRevealed.add(productId)
    }
    setRevealedReservations(newRevealed)
  }

  const getStatusConfig = (product: Product) => {
    const statusConfig = {
      available: { 
        icon: CheckCircle, 
        text: 'Disponível', 
        color: 'bg-green-100 text-green-800'
      },
      reserved: { 
        icon: Clock, 
        text: product.is_anonymous ? 'Reservado Anonimamente' : 'Reservado', 
        color: product.is_anonymous ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
      },
      received: { 
        icon: Package, 
        text: 'Recebido', 
        color: 'bg-blue-100 text-blue-800'
      },
      cancelled: { 
        icon: XCircle, 
        text: 'Cancelado', 
        color: 'bg-red-100 text-red-800'
      }
    }

    return statusConfig[product.reservation_status]
  }

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer className="h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h1>
          <p className="text-sm text-gray-500">Gerencie todos os produtos da lista</p>
        </div>
      </div>

      {/* Botão de Adicionar */}
      <div className="mb-6">
        <Button 
          onClick={() => {
            setEditingProduct(null)
            setFormData({
              name: '',
              description: '',
              category_id: '',
              item_type: 'principal',
              image_id: null
            })
            setShowForm(true)
          }}
          className="mobile-button"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Produto
        </Button>
      </div>

      {/* Lista de Produtos */}
      <div className="space-y-4">
        {products.map((product) => {
          const statusConfig = getStatusConfig(product)
          const StatusIcon = statusConfig.icon

          return (
            <Card key={product.id} className="mobile-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <div className="flex items-center space-x-1">
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusConfig.text}</span>
                        </div>
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      Categoria: {product.category?.name}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      Tipo: {product.item_type === 'principal' ? 'Principal' : 'Adicional'}
                    </p>
                    {product.description && (
                      <p className="text-sm text-gray-600">{product.description}</p>
                    )}
                  </div>
                  {product.image_id && (
                    <div className="ml-4">
                      <ImageDisplay imageId={product.image_id} className="w-16 h-16 rounded-lg object-cover" />
                    </div>
                  )}
                </div>

                {/* Dados de Reserva */}
                {product.reservation_status === 'reserved' && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
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
                            <span className="text-sm text-gray-900">
                              {product.reserved_by}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
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
                )}

                {/* Botões de Ação */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>

                  {product.reservation_status === 'reserved' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProductStatus(product.id, 'available')}
                        disabled={updating.has(product.id)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
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
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        {updating.has(product.id) ? (
                          <Clock className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Package className="w-4 h-4 mr-1" />
                        )}
                        Recebido
                      </Button>
                    </>
                  )}

                  {product.reservation_status === 'available' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateProductStatus(product.id, 'cancelled')}
                      disabled={updating.has(product.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {updating.has(product.id) ? (
                        <Clock className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modal de Formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria *</Label>
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
              <Label htmlFor="item_type">Tipo de Item</Label>
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
                {editingProduct ? 'Atualizar' : 'Criar'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
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

export default function AdminProdutosPage() {
  return (
    <ProtectedRoute>
      <AdminProdutosContent />
    </ProtectedRoute>
  )
}
