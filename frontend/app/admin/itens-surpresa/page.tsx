'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { supabase, SurpriseItem } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import DetectiveCard from '@/components/DetectiveCard'
import { ArrowLeft, Gift, Eye, EyeOff, Package, Edit, Trash2, CheckCircle, XCircle, Clock, MessageCircle } from 'lucide-react'

function AdminItensSurpresaContent() {
  const [items, setItems] = useState<SurpriseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<SurpriseItem | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('surprise_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Erro ao carregar itens surpresa:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateItemStatus = async (id: string, status: string) => {
    try {
      const updateData: any = { reservation_status: status }
      
      if (status === 'received') {
        updateData.received_at = new Date().toISOString()
      } else if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('surprise_items')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
      fetchItems()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status. Tente novamente.')
    }
  }

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('surprise_items')
        .update({ is_visible: isVisible })
        .eq('id', id)

      if (error) throw error
      fetchItems()
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error)
      alert('Erro ao alterar visibilidade. Tente novamente.')
    }
  }

  const updateAdminNotes = async (id: string) => {
    try {
      const { error } = await supabase
        .from('surprise_items')
        .update({ admin_notes: adminNotes })
        .eq('id', id)

      if (error) throw error
      setEditingItem(null)
      setAdminNotes('')
      fetchItems()
    } catch (error) {
      console.error('Erro ao atualizar notas:', error)
      alert('Erro ao atualizar notas. Tente novamente.')
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item surpresa?')) return

    try {
      const { error } = await supabase
        .from('surprise_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchItems()
    } catch (error) {
      console.error('Erro ao excluir item:', error)
      alert('Erro ao excluir item. Tente novamente.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'received': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível'
      case 'reserved': return 'Reservado'
      case 'received': return 'Recebido'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const getItemTypeColor = (type: string) => {
    return type === 'principal' ? 'bg-pink-100 text-pink-800' : 'bg-purple-100 text-purple-800'
  }

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando itens surpresa...</p>
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
            <Gift className="w-6 h-6 mr-2 text-pink-600" />
            Itens Surpresa
          </h1>
          <p className="text-sm text-gray-500">
            Gerencie os itens surpresa enviados pelos convidados para os anfitriões
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">
              {items.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {items.filter(item => item.reservation_status === 'available').length}
            </div>
            <div className="text-sm text-gray-600">Disponíveis</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {items.filter(item => item.reservation_status === 'reserved').length}
            </div>
            <div className="text-sm text-gray-600">Reservados</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {items.filter(item => item.reservation_status === 'received').length}
            </div>
            <div className="text-sm text-gray-600">Recebidos</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Itens */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="mobile-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {item.is_anonymous ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Gift className="w-5 h-5 text-pink-500" />
                  )}
                  <h3 className="font-semibold text-gray-900">
                    {item.is_anonymous ? 'Item Misterioso' : item.name}
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getItemTypeColor(item.item_type)}`}>
                    {item.item_type === 'principal' ? 'Principal' : 'Adicional'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.reservation_status)}`}>
                    {getStatusText(item.reservation_status)}
                  </span>
                  {!item.is_visible && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Oculto
                    </span>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 mb-3">
                  {item.description}
                </p>
              )}

              {item.category && (
                <div className="flex items-center space-x-2 mb-3">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Categoria: {item.category}
                  </span>
                </div>
              )}

              {item.is_anonymous ? (
                <DetectiveCard
                  title="Item Anônimo"
                  message="Este item foi enviado anonimamente. O mistério permanece!"
                />
              ) : (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                  <p className="text-sm text-blue-800">
                    <strong>Enviado por:</strong> {item.reserved_by || 'Não informado'}
                  </p>
                  {item.reserved_contact && (
                    <p className="text-sm text-blue-800">
                      <strong>Contato:</strong> {item.reserved_contact}
                    </p>
                  )}
                </div>
              )}

              {item.admin_notes && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Notas do Admin:</strong> {item.admin_notes}
                  </p>
                </div>
              )}

              {/* Ações do Admin */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateItemStatus(item.id, 'received')}
                  disabled={item.reservation_status === 'received'}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Marcar como Recebido
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateItemStatus(item.id, 'cancelled')}
                  disabled={item.reservation_status === 'cancelled'}
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Cancelar
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleVisibility(item.id, !item.is_visible)}
                >
                  {item.is_visible ? (
                    <>
                      <EyeOff className="w-3 h-3 mr-1" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      Mostrar
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingItem(item)
                    setAdminNotes(item.admin_notes || '')
                  }}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Notas
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteItem(item.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Excluir
                </Button>
              </div>

              <div className="text-xs text-gray-400">
                Enviado em {new Date(item.created_at).toLocaleDateString('pt-BR')}
                {item.received_at && (
                  <span> • Recebido em {new Date(item.received_at).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Edição de Notas */}
      {editingItem && (
        <Card className="mobile-card mt-6">
          <CardHeader>
            <CardTitle className="mobile-subtitle">
              Notas do Admin - {editingItem.is_anonymous ? 'Item Misterioso' : editingItem.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Notas Internas</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Adicione notas internas sobre este item..."
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => updateAdminNotes(editingItem.id)}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  Salvar Notas
                </Button>
                <Button
                  onClick={() => {
                    setEditingItem(null)
                    setAdminNotes('')
                  }}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {items.length === 0 && (
        <Card className="mobile-card">
          <CardContent className="text-center py-8">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Nenhum item surpresa ainda
            </h3>
            <p className="text-gray-600">
              Os itens surpresa enviados pelos convidados aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AdminItensSurpresaPage() {
  return (
    <ProtectedRoute>
      <AdminItensSurpresaContent />
    </ProtectedRoute>
  )
}
