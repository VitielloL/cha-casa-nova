'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Gift, Eye, EyeOff, Sparkles } from 'lucide-react'

export default function ItemSurpresaPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
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
          is_anonymous: formData.is_anonymous,
          item_type: formData.item_type
        }])

      if (error) throw error

      setSuccess(true)
      setFormData({
        name: '',
        description: '',
        category: '',
        is_anonymous: false,
        item_type: 'adicional'
      })
    } catch (error) {
      console.error('Erro ao enviar item surpresa:', error)
      alert('Erro ao enviar item. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mobile-container">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Gift className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="mobile-title text-gray-900 mb-4">
            Item Surpresa Enviado! 🎉
          </h1>
          <p className="mobile-text text-gray-600 mb-6">
            Obrigado por contribuir com a festa! Seu item surpresa foi registrado e aparecerá na lista para os anfitriões.
          </p>
          <div className="space-y-3">
            <Link href="/">
              <Button className="mobile-button w-full">
                Voltar ao Início
              </Button>
            </Link>
            <Button
              onClick={() => setSuccess(false)}
              variant="outline"
              className="mobile-button w-full"
            >
              Enviar Outro Item
            </Button>
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
          <h1 className="mobile-title text-gray-900 flex items-center">
            <Gift className="w-6 h-6 mr-2 text-pink-600" />
            Enviar Item Surpresa
          </h1>
          <p className="text-sm text-gray-500">
            Contribua com um presente especial para os anfitriões
          </p>
        </div>
      </div>

      {/* Informações sobre itens surpresa */}
      <Card className="mobile-card mb-6">
        <CardHeader>
          <CardTitle className="mobile-subtitle flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
            Como Funciona?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-pink-600">1</span>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Descreva seu item:</strong> Pode ser específico ou deixar como surpresa total
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-pink-600">2</span>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Escolha o anonimato:</strong> Pode aparecer seu nome ou ficar anônimo
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-pink-600">3</span>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Os anfitriões veem:</strong> Sua contribuição aparecerá na lista de presentes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Formulário */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle className="mobile-subtitle">Detalhes do Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Item *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Item Surpresa, Presente Especial, etc."
                required
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Pode ser genérico se quiser manter o mistério
              </p>
            </div>

            <div>
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o item ou deixe uma mensagem especial para os anfitriões..."
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Pode dar dicas ou deixar completamente em branco para surpresa total
              </p>
            </div>

            <div>
              <Label htmlFor="category">Categoria Sugerida (Opcional)</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Cozinha, Sala, Quarto, etc."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="item_type">Tipo do Item</Label>
              <select
                id="item_type"
                value={formData.item_type}
                onChange={(e) => setFormData({ ...formData, item_type: e.target.value as 'principal' | 'adicional' })}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="adicional">Adicional (presente extra)</option>
                <option value="principal">Principal (item essencial)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_anonymous"
                checked={formData.is_anonymous}
                onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_anonymous" className="flex items-center">
                {formData.is_anonymous ? (
                  <EyeOff className="w-4 h-4 mr-2 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 mr-2 text-blue-500" />
                )}
                Enviar anonimamente (manter mistério total)
              </Label>
            </div>

            {formData.is_anonymous && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  🕵️ <strong>Modo Detetive:</strong> Seu item aparecerá como "Item Misterioso" na lista!
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Enviar Item Surpresa
                  </>
                )}
              </Button>
              <Link href="/">
                <Button type="button" variant="outline" className="px-6">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dicas */}
      <Card className="mobile-card mt-6">
        <CardHeader>
          <CardTitle className="mobile-subtitle text-sm">💡 Dicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-gray-600">
            • <strong>Surpresa total:</strong> Deixe nome genérico e descrição vazia
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Dica sutil:</strong> Use descrição para dar pistas sem revelar
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Anônimo:</strong> Perfeito para surpresas em grupo
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Específico:</strong> Descreva o item se quiser que saibam
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
