'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase, PartyOwner } from '@/lib/supabase'
import ImageUpload from '@/components/ImageUpload'
import ImageDisplay from '@/components/ImageDisplay'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ArrowLeft, Plus, Edit, Trash2, Users, Heart } from 'lucide-react'

function AdminDonosContent() {
  const [owners, setOwners] = useState<PartyOwner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingOwner, setEditingOwner] = useState<PartyOwner | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    relationship: '',
    photo_id: '',
    order_index: 0
  })

  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    try {
      const { data, error } = await supabase
        .from('party_owners')
        .select(`
          *,
          photo:images(*)
        `)
        .order('order_index', { ascending: true })

      if (error) throw error
      setOwners(data || [])
    } catch (error) {
      console.error('Erro ao carregar donos da festa:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingOwner) {
        // Atualizar
        const { error } = await supabase
          .from('party_owners')
          .update(formData)
          .eq('id', editingOwner.id)

        if (error) throw error
      } else {
        // Criar
        const { error } = await supabase
          .from('party_owners')
          .insert([formData])

        if (error) throw error
      }

      setShowForm(false)
      setEditingOwner(null)
      setFormData({ name: '', bio: '', relationship: '', photo_id: '', order_index: 0 })
      fetchOwners()
    } catch (error) {
      console.error('Erro ao salvar dono da festa:', error)
      alert('Erro ao salvar. Tente novamente.')
    }
  }

  const handleEdit = (owner: PartyOwner) => {
    setEditingOwner(owner)
    setFormData({
      name: owner.name,
      bio: owner.bio || '',
      relationship: owner.relationship || '',
      photo_id: owner.photo_id || '',
      order_index: owner.order_index
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este dono da festa?')) return

    try {
      const { error } = await supabase
        .from('party_owners')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchOwners()
    } catch (error) {
      console.error('Erro ao excluir dono da festa:', error)
      alert('Erro ao excluir. Tente novamente.')
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="mobile-title text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-pink-600" />
              Anfitriões da Festa
            </h1>
            <p className="text-sm text-gray-500">
              Gerencie as informações dos anfitriões da celebração
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="bg-pink-500 hover:bg-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card className="mobile-card mb-6">
          <CardHeader>
            <CardTitle className="mobile-subtitle">
              {editingOwner ? 'Editar Dono da Festa' : 'Adicionar Dono da Festa'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="relationship">Relacionamento</Label>
                <Input
                  id="relationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="Ex: Noivos, Aniversariantes, Casal"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Conte um pouco sobre esta pessoa..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Foto</Label>
                <ImageUpload
                  onImageUploaded={(imageId) => {
                    setFormData({ ...formData, photo_id: imageId })
                  }}
                  className="mt-1"
                />
                {formData.photo_id && (
                  <div className="mt-2">
                    <ImageDisplay
                      imageId={formData.photo_id}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="order_index">Ordem de Exibição</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                  {editingOwner ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingOwner(null)
                    setFormData({ name: '', bio: '', relationship: '', photo_id: '', order_index: 0 })
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de donos */}
      <div className="space-y-4">
        {owners.map((owner) => (
          <Card key={owner.id} className="mobile-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                {/* Foto */}
                <div className="flex-shrink-0">
                  {owner.photo_id ? (
                    <ImageDisplay
                      imageId={owner.photo_id}
                      alt={owner.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-pink-400" />
                    </div>
                  )}
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {owner.name}
                  </h3>
                  {owner.relationship && (
                    <div className="flex items-center space-x-1 mb-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="text-sm text-pink-600">{owner.relationship}</span>
                    </div>
                  )}
                  {owner.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {owner.bio}
                    </p>
                  )}
                </div>

                {/* Ações */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(owner)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(owner.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {owners.length === 0 && !showForm && (
        <Card className="mobile-card">
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="mobile-subtitle text-gray-900 mb-2">
              Nenhum dono da festa cadastrado
            </h2>
            <p className="text-gray-600 mb-4">
              Adicione informações sobre os organizadores da festa.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-pink-500 hover:bg-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Dono
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AdminDonosPage() {
  return (
    <ProtectedRoute>
      <AdminDonosContent />
    </ProtectedRoute>
  )
}
