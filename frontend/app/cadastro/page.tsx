'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase, Category, FeaturedPurchaseMethod } from '@/lib/supabase'
import ImageUpload from '@/components/ImageUpload'
import { ArrowLeft, Plus, CheckCircle } from 'lucide-react'

export default function CadastroPage() {
  const [activeTab, setActiveTab] = useState<'product' | 'store'>('product')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [purchaseMethods, setPurchaseMethods] = useState<FeaturedPurchaseMethod[]>([])

  // Estados do formulário de produto
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    image_id: '',
    store_link: '',
    store_address: '',
    category_id: '',
    item_type: 'principal' as 'principal' | 'adicional',
    preferred_purchase_method_id: ''
  })

  // Estados do formulário de loja
  const [storeForm, setStoreForm] = useState({
    name: '',
    address: '',
    link: ''
  })

  useEffect(() => {
    fetchCategories()
    fetchPurchaseMethods()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const fetchPurchaseMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_purchase_methods')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      setPurchaseMethods(data || [])
    } catch (error) {
      console.error('Erro ao carregar meios de compra:', error)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productForm.name || !productForm.category_id) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('products')
        .insert([productForm])

      if (error) throw error

      setSuccess(true)
      setProductForm({
        name: '',
        description: '',
        image_id: '',
        store_link: '',
        store_address: '',
        category_id: '',
        item_type: 'principal',
        preferred_purchase_method_id: ''
      })
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error)
      alert('Erro ao cadastrar produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeForm.name) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('stores')
        .insert([storeForm])

      if (error) throw error

      setSuccess(true)
      setStoreForm({
        name: '',
        address: '',
        link: ''
      })
    } catch (error) {
      console.error('Erro ao cadastrar loja:', error)
      alert('Erro ao cadastrar loja. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mobile-container">
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="mobile-subtitle text-gray-900 mb-2">
            Cadastro realizado com sucesso!
          </h2>
          <p className="mobile-text text-gray-600 mb-6">
            {activeTab === 'product' ? 'Produto' : 'Loja'} cadastrado{activeTab === 'product' ? '' : 'a'} com sucesso.
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => setSuccess(false)}
              className="mobile-button w-full"
            >
              Cadastrar outro
            </Button>
            <Link href="/">
              <Button variant="outline" className="mobile-button w-full">
                Voltar ao início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="mobile-title text-gray-900">Cadastro</h1>
          <p className="text-sm text-gray-500">
            Adicione novos produtos e lojas
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('product')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'product'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Produto
        </button>
        <button
          onClick={() => setActiveTab('store')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'store'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Loja
        </button>
      </div>

      {/* Formulário de Produto */}
      {activeTab === 'product' && (
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="mobile-subtitle">Cadastrar Produto</CardTitle>
            <CardDescription>
              Adicione um novo produto à lista de presentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <Label htmlFor="product-name">Nome do produto *</Label>
                <Input
                  id="product-name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ex: Jogo de pratos"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="product-category">Categoria *</Label>
                <select
                  id="product-category"
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                  required
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="product-type">Tipo do Item *</Label>
                <select
                  id="product-type"
                  value={productForm.item_type}
                  onChange={(e) => setProductForm({ ...productForm, item_type: e.target.value as 'principal' | 'adicional' })}
                  required
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="principal">Principal (essencial)</option>
                  <option value="adicional">Adicional (opcional)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Itens principais são essenciais, adicionais são extras
                </p>
              </div>

              <div>
                <Label htmlFor="product-description">Descrição</Label>
                <Textarea
                  id="product-description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Descreva o produto..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Imagem do produto</Label>
                <ImageUpload
                  onImageUploaded={(imageId, imageUrl) => {
                    setProductForm({ ...productForm, image_id: imageId })
                  }}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="product-store-link">Link da loja</Label>
                <Input
                  id="product-store-link"
                  value={productForm.store_link}
                  onChange={(e) => setProductForm({ ...productForm, store_link: e.target.value })}
                  placeholder="https://loja.com/produto"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="product-store-address">Endereço da loja</Label>
                <Input
                  id="product-store-address"
                  value={productForm.store_address}
                  onChange={(e) => setProductForm({ ...productForm, store_address: e.target.value })}
                  placeholder="Rua, número - Bairro"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="product-purchase-method">Meio de Compra Preferencial</Label>
                <select
                  id="product-purchase-method"
                  value={productForm.preferred_purchase_method_id}
                  onChange={(e) => setProductForm({ ...productForm, preferred_purchase_method_id: e.target.value })}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Nenhum (opcional)</option>
                  {purchaseMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.icon} {method.name} {method.is_affiliate && method.affiliate_commission && `- ${method.affiliate_commission}`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Escolha o meio de compra preferencial para este produto específico
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !productForm.name || !productForm.category_id}
                className="mobile-button w-full bg-blue-500 hover:bg-blue-600"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Plus className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Loja */}
      {activeTab === 'store' && (
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="mobile-subtitle">Cadastrar Loja</CardTitle>
            <CardDescription>
              Adicione uma nova loja parceira
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStoreSubmit} className="space-y-4">
              <div>
                <Label htmlFor="store-name">Nome da loja *</Label>
                <Input
                  id="store-name"
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  placeholder="Ex: Casa & Cia"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="store-address">Endereço</Label>
                <Input
                  id="store-address"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  placeholder="Rua, número - Bairro, Cidade"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="store-link">Site da loja</Label>
                <Input
                  id="store-link"
                  value={storeForm.link}
                  onChange={(e) => setStoreForm({ ...storeForm, link: e.target.value })}
                  placeholder="https://loja.com"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !storeForm.name}
                className="mobile-button w-full bg-blue-500 hover:bg-blue-600"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Plus className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Cadastrando...' : 'Cadastrar Loja'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
