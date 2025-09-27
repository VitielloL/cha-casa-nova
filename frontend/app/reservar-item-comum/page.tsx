'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ShoppingCart, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function ReservarItemComumPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    reserved_by: '',
    reserved_contact: '',
    is_anonymous: false,
    item_type: 'adicional' as 'principal' | 'adicional'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('surprise_items')
        .insert([{
          name: formData.name,
          description: formData.description || null,
          category: formData.category || null,
          reserved_by: formData.is_anonymous ? null : formData.reserved_by,
          reserved_contact: formData.is_anonymous ? null : formData.reserved_contact,
          is_anonymous: formData.is_anonymous,
          item_type: formData.item_type,
          reservation_status: 'reserved'
        }])

      if (error) throw error

      setSuccess(true)
      setFormData({
        name: '',
        description: '',
        category: '',
        reserved_by: '',
        reserved_contact: '',
        is_anonymous: false,
        item_type: 'adicional'
      })
    } catch (error) {
      console.error('Erro ao reservar item:', error)
      alert('Erro ao reservar item. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card className="mobile-card">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Item Reservado!
              </h2>
              <p className="text-gray-600 mb-6">
                Seu item foi reservado com sucesso. Obrigado pela contribuição!
              </p>
              <div className="space-y-3">
                <Link href="/">
                  <Button className="mobile-button w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao Início
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setSuccess(false)}
                  className="mobile-button w-full"
                >
                  Reservar Outro Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reservar Item Comum
          </h1>
          <p className="text-gray-600">
            Reserve um item comum que não está na lista oficial
          </p>
        </div>

        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Dados do Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome do item */}
              <div>
                <Label htmlFor="name">Nome do Item *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Jogo de copos, Toalha de mesa..."
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva o item, marca, cor, etc."
                  rows={3}
                />
              </div>

              {/* Categoria */}
              <div>
                <Label htmlFor="category">Categoria (opcional)</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Ex: Cozinha, Quarto, Sala..."
                />
              </div>

              {/* Tipo do item */}
              <div>
                <Label htmlFor="item_type">Tipo do Item *</Label>
                <Select
                  value={formData.item_type}
                  onValueChange={(value) => handleInputChange('item_type', value)}
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

              {/* Reserva anônima */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_anonymous"
                  checked={formData.is_anonymous}
                  onChange={(e) => handleInputChange('is_anonymous', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="is_anonymous" className="text-sm">
                  Reservar anonimamente
                </Label>
              </div>

              {/* Dados do reservador (se não anônimo) */}
              {!formData.is_anonymous && (
                <>
                  <div>
                    <Label htmlFor="reserved_by">Seu Nome *</Label>
                    <Input
                      id="reserved_by"
                      value={formData.reserved_by}
                      onChange={(e) => handleInputChange('reserved_by', e.target.value)}
                      placeholder="Como você gostaria de ser identificado"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="reserved_contact">Contato (WhatsApp) *</Label>
                    <Input
                      id="reserved_contact"
                      value={formData.reserved_contact}
                      onChange={(e) => handleInputChange('reserved_contact', e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </>
              )}

              {/* Botões */}
              <div className="space-y-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="mobile-button w-full bg-pink-500 hover:bg-pink-600"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Reservando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Reservar Item
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <Card className="mobile-card mt-6">
          <CardContent className="text-center py-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Como funciona?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Você pode reservar qualquer item comum que não esteja na lista oficial. 
              O item será marcado como reservado e aparecerá na lista de itens surpresa.
            </p>
            <div className="text-xs text-gray-500">
              <p>• Itens principais são mais importantes para a festa</p>
              <p>• Itens adicionais são extras que complementam</p>
              <p>• Você pode reservar anonimamente se preferir</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
