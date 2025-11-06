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
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  // Estados do formulário de produto
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    image_id: '',
    category_id: '',
    item_type: 'principal' as 'principal' | 'adicional',
    product_link: ''
  })

  useEffect(() => {
    fetchCategories()
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

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productForm.name || !productForm.category_id) return

    setLoading(true)
    try {
      // Inserir produto (apenas colunas válidas da tabela products)
      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert([{
          name: productForm.name,
          description: productForm.description || null,
          image_id: productForm.image_id || null,
          category_id: productForm.category_id,
          item_type: productForm.item_type
        }])
        .select('id')
        .single()

      if (insertError) throw insertError

      // Se tiver link único, salvar em product_purchase_methods
      if (productForm.product_link && inserted?.id) {
        const { error: linkError } = await supabase
          .from('product_purchase_methods')
          .insert([{
            product_id: inserted.id,
            name: 'Link',
            type: 'link',
            content: productForm.product_link,
            description: null,
            icon: '🔗',
            color: 'blue',
            is_primary: true,
            order_index: 0,
            is_active: true
          }])
        if (linkError) throw linkError
      }

      setSuccess(true)
      setProductForm({
        name: '',
        description: '',
        image_id: '',
        category_id: '',
        item_type: 'principal',
        product_link: ''
      })
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error)
      alert('Erro ao cadastrar produto. Tente novamente.')
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
          <p className="mobile-text text-gray-600 mb-6">Produto cadastrado com sucesso.</p>
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

      

      {/* Formulário de Produto */}
      (
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
              <Label htmlFor="product-store-link">Link do produto</Label>
                <Input
                  id="product-store-link"
                  value={productForm.product_link}
                  onChange={(e) => setProductForm({ ...productForm, product_link: e.target.value })}
                  placeholder="https://loja.com/produto"
                  className="mt-1"
                />
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
      )
    </div>
  )
}
