'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase, Product, ProductPurchaseMethod } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ArrowLeft, Plus, Edit, Trash2, Package, ExternalLink, MapPin, Phone, Mail, Image as ImageIcon, FileText } from 'lucide-react'

function AdminProdutosMeiosContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [purchaseMethods, setPurchaseMethods] = useState<ProductPurchaseMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMethod, setEditingMethod] = useState<ProductPurchaseMethod | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'link' as 'link' | 'address' | 'photo' | 'text' | 'phone' | 'email',
    content: '',
    description: '',
    icon: '',
    color: 'blue',
    is_primary: false,
    order_index: 0
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          purchase_methods:product_purchase_methods(*)
        `)
        .order('name')

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPurchaseMethods = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_purchase_methods')
        .select('*')
        .eq('product_id', productId)
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      setPurchaseMethods(data || [])
    } catch (error) {
      console.error('Erro ao carregar meios de compra:', error)
    }
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    fetchPurchaseMethods(product.id)
    setShowForm(false)
    setEditingMethod(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    try {
      const methodData = {
        ...formData,
        product_id: selectedProduct.id
      }

      if (editingMethod) {
        // Atualizar
        const { error } = await supabase
          .from('product_purchase_methods')
          .update(methodData)
          .eq('id', editingMethod.id)

        if (error) throw error
      } else {
        // Criar
        const { error } = await supabase
          .from('product_purchase_methods')
          .insert([methodData])

        if (error) throw error
      }

      setShowForm(false)
      setEditingMethod(null)
      setFormData({
        name: '',
        type: 'link',
        content: '',
        description: '',
        icon: '',
        color: 'blue',
        is_primary: false,
        order_index: 0
      })
      fetchPurchaseMethods(selectedProduct.id)
    } catch (error) {
      console.error('Erro ao salvar meio de compra:', error)
      alert('Erro ao salvar. Tente novamente.')
    }
  }

  const handleEdit = (method: ProductPurchaseMethod) => {
    setEditingMethod(method)
    setFormData({
      name: method.name,
      type: method.type,
      content: method.content,
      description: method.description || '',
      icon: method.icon || '',
      color: method.color,
      is_primary: method.is_primary,
      order_index: method.order_index
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este meio de compra?')) return

    try {
      const { error } = await supabase
        .from('product_purchase_methods')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchPurchaseMethods(selectedProduct!.id)
    } catch (error) {
      console.error('Erro ao excluir meio de compra:', error)
      alert('Erro ao excluir. Tente novamente.')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'link': return <ExternalLink className="w-4 h-4" />
      case 'address': return <MapPin className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'photo': return <ImageIcon className="w-4 h-4" />
      case 'text': return <FileText className="w-4 h-4" />
      default: return <ExternalLink className="w-4 h-4" />
    }
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
          <h1 className="mobile-title text-gray-900 flex items-center">
            <Package className="w-6 h-6 mr-2 text-pink-600" />
            Meios de Compra dos Produtos
          </h1>
          <p className="text-sm text-gray-500">
            Gerencie os meios de compra específicos de cada produto
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Produtos */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="mobile-subtitle">Produtos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {products.map((product) => (
              <Button
                key={product.id}
                onClick={() => handleProductSelect(product)}
                variant={selectedProduct?.id === product.id ? "default" : "outline"}
                className={`w-full justify-start ${selectedProduct?.id === product.id ? 'bg-pink-500' : ''}`}
              >
                <Package className="w-4 h-4 mr-2" />
                {product.name}
                {product.purchase_methods && product.purchase_methods.length > 0 && (
                  <span className="ml-auto text-xs bg-white text-pink-600 px-2 py-1 rounded-full">
                    {product.purchase_methods.length}
                  </span>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Meios de Compra do Produto Selecionado */}
        {selectedProduct && (
          <Card className="mobile-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="mobile-subtitle">
                  Meios de Compra: {selectedProduct.name}
                </CardTitle>
                <Button
                  onClick={() => setShowForm(true)}
                  size="sm"
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {purchaseMethods.length > 0 ? (
                <div className="space-y-3">
                  {purchaseMethods.map((method) => (
                    <div key={method.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(method.type)}
                          <span className="font-medium">{method.name}</span>
                          {method.is_primary && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Principal
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(method)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(method.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{method.content}</p>
                      {method.description && (
                        <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Nenhum meio de compra configurado para este produto.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Meio
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Formulário */}
      {showForm && selectedProduct && (
        <Card className="mobile-card mt-6">
          <CardHeader>
            <CardTitle className="mobile-subtitle">
              {editingMethod ? 'Editar Meio de Compra' : 'Adicionar Meio de Compra'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Magazine Luiza"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    required
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="link">Link</option>
                    <option value="address">Endereço</option>
                    <option value="phone">Telefone</option>
                    <option value="email">Email</option>
                    <option value="photo">Foto</option>
                    <option value="text">Texto</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="content">Conteúdo *</Label>
                <Input
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="URL, endereço, telefone, etc."
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional do meio de compra"
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="icon">Ícone</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🛒"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="color">Cor</Label>
                  <select
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="blue">Azul</option>
                    <option value="purple">Roxo</option>
                    <option value="red">Vermelho</option>
                    <option value="yellow">Amarelo</option>
                    <option value="green">Verde</option>
                    <option value="pink">Rosa</option>
                    <option value="gray">Cinza</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="order_index">Ordem</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={formData.is_primary}
                  onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_primary">Meio principal (aparece em destaque)</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                  {editingMethod ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingMethod(null)
                    setFormData({
                      name: '',
                      type: 'link',
                      content: '',
                      description: '',
                      icon: '',
                      color: 'blue',
                      is_primary: false,
                      order_index: 0
                    })
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AdminProdutosMeiosPage() {
  return (
    <ProtectedRoute>
      <AdminProdutosMeiosContent />
    </ProtectedRoute>
  )
}
