'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { supabase, Category } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ArrowLeft, Plus, Edit, Trash2, Tag } from 'lucide-react'
import ResponsiveContainer from '@/components/ResponsiveContainer'

function AdminCategoriasContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
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
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      alert('Nome é obrigatório')
      return
    }

    try {
      if (editingCategory) {
        // Atualizar categoria
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingCategory.id)

        if (error) throw error

        setCategories(prev => prev.map(c => 
          c.id === editingCategory.id ? { ...c, ...formData } : c
        ))
      } else {
        // Criar categoria
        const { data, error } = await supabase
          .from('categories')
          .insert([formData])
          .select()

        if (error) throw error

        setCategories(prev => [...prev, data[0]])
      }

      setShowForm(false)
      setEditingCategory(null)
      setFormData({
        name: '',
        description: ''
      })
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      alert('Erro ao salvar. Tente novamente.')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) return

    try {
      // Verificar se há produtos nesta categoria
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', categoryId)
        .limit(1)

      if (productsError) throw productsError

      if (products && products.length > 0) {
        alert('Não é possível excluir uma categoria que possui produtos. Remova todos os produtos primeiro.')
        return
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error

      setCategories(prev => prev.filter(c => c.id !== categoryId))
      alert('Categoria excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      alert('Erro ao excluir categoria.')
    }
  }

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando categorias...</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer className="h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h1>
          <p className="text-sm text-gray-500">Gerencie as categorias de produtos</p>
        </div>
      </div>

      {/* Botão de Adicionar */}
      <div className="mb-6">
        <Button 
          onClick={() => {
            setEditingCategory(null)
            setFormData({
              name: '',
              description: ''
            })
            setShowForm(true)
          }}
          className="mobile-button"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Categoria
        </Button>
      </div>

      {/* Lista de Categorias */}
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id} className="mobile-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Criada em: {new Date(category.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <Card className="mobile-card">
            <CardContent className="p-6 text-center">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">Nenhuma categoria cadastrada.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Adicionar Categoria'}
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

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingCategory ? 'Atualizar' : 'Criar'}
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

export default function AdminCategoriasPage() {
  return (
    <ProtectedRoute>
      <AdminCategoriasContent />
    </ProtectedRoute>
  )
}
