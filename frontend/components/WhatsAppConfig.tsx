'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { 
  validateAndFormatWhatsAppNumber, 
  formatPhoneNumberForDisplay, 
  isValidWhatsAppNumber
} from '@/lib/whatsappUtils'
import type { WhatsAppConfig } from '@/lib/whatsappUtils'
import { MessageCircle, Phone, Settings, CheckCircle, AlertCircle } from 'lucide-react'

interface WhatsAppConfigProps {
  onConfigUpdated?: () => void
}

export default function WhatsAppConfig({ onConfigUpdated }: WhatsAppConfigProps) {
  
  const [config, setConfig] = useState<WhatsAppConfig>({
    whatsapp_number: '',
    thank_you_message: '',
    admin_whatsapp_number: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('app_config')
        .select('key, value')

      if (error) throw error

      const configData: WhatsAppConfig = {
        whatsapp_number: '',
        thank_you_message: '',
        admin_whatsapp_number: ''
      }

      data?.forEach(item => {
        if (item.key in configData) {
          configData[item.key as keyof WhatsAppConfig] = item.value
        }
      })

      setConfig(configData)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validar número principal
    if (!config.whatsapp_number) {
      newErrors.whatsapp_number = 'Número do WhatsApp é obrigatório'
    } else if (!isValidWhatsAppNumber(config.whatsapp_number)) {
      newErrors.whatsapp_number = 'Número inválido. Use apenas números com código do país'
    }

    // Validar número do admin
    if (!config.admin_whatsapp_number) {
      newErrors.admin_whatsapp_number = 'Número do admin é obrigatório'
    } else if (!isValidWhatsAppNumber(config.admin_whatsapp_number)) {
      newErrors.admin_whatsapp_number = 'Número inválido. Use apenas números com código do país'
    }

    // Validar mensagem
    if (!config.thank_you_message.trim()) {
      newErrors.thank_you_message = 'Mensagem de agradecimento é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      // Atualizar cada configuração
      for (const [key, value] of Object.entries(config)) {
        const { error } = await supabase
          .from('app_config')
          .update({ value })
          .eq('key', key)

        if (error) throw error
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      
      if (onConfigUpdated) {
        onConfigUpdated()
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      alert('Erro ao salvar configurações. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleNumberChange = (field: keyof WhatsAppConfig, value: string) => {
    // Remove caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '')
    
    setConfig(prev => ({
      ...prev,
      [field]: cleanValue
    }))

    // Limpar erro quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const testWhatsAppNumber = (phoneNumber: string) => {
    if (!phoneNumber || !isValidWhatsAppNumber(phoneNumber)) return
    
    const testMessage = 'Teste de configuração do WhatsApp'
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(testMessage)}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <Card className="mobile-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mobile-card">
      <CardHeader>
        <CardTitle className="mobile-subtitle flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Configurações do WhatsApp
        </CardTitle>
        <CardDescription>
          Configure os números e mensagens para comunicação via WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Número Principal */}
        <div>
          <Label htmlFor="whatsapp-number">Número Principal do WhatsApp *</Label>
          <div className="mt-1 space-y-2">
            <Input
              id="whatsapp-number"
              type="tel"
              placeholder="5521986189443"
              value={config.whatsapp_number}
              onChange={(e) => handleNumberChange('whatsapp_number', e.target.value)}
              className={errors.whatsapp_number ? 'border-red-500' : ''}
            />
            {config.whatsapp_number && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Formato: {formatPhoneNumberForDisplay(config.whatsapp_number)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testWhatsAppNumber(config.whatsapp_number)}
                  className="text-xs"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Testar
                </Button>
              </div>
            )}
            {errors.whatsapp_number && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.whatsapp_number}
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Digite apenas números com código do país (ex: 5521986189443 para Brasil)
          </p>
        </div>

        {/* Número do Admin */}
        <div>
          <Label htmlFor="admin-whatsapp-number">Número do Admin para Dúvidas *</Label>
          <div className="mt-1 space-y-2">
            <Input
              id="admin-whatsapp-number"
              type="tel"
              placeholder="5521986189443"
              value={config.admin_whatsapp_number}
              onChange={(e) => handleNumberChange('admin_whatsapp_number', e.target.value)}
              className={errors.admin_whatsapp_number ? 'border-red-500' : ''}
            />
            {config.admin_whatsapp_number && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Formato: {formatPhoneNumberForDisplay(config.admin_whatsapp_number)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testWhatsAppNumber(config.admin_whatsapp_number)}
                  className="text-xs"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Testar
                </Button>
              </div>
            )}
            {errors.admin_whatsapp_number && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.admin_whatsapp_number}
              </p>
            )}
          </div>
        </div>

        {/* Mensagem de Agradecimento */}
        <div>
          <Label htmlFor="thank-you-message">Mensagem de Agradecimento *</Label>
          <Textarea
            id="thank-you-message"
            placeholder="Oi! Obrigado(a) pelo presente! Recebi o produto {{PRODUCT_NAME}} e estou muito feliz! 🎉"
            value={config.thank_you_message}
            onChange={(e) => setConfig(prev => ({ ...prev, thank_you_message: e.target.value }))}
            className={`mt-1 ${errors.thank_you_message ? 'border-red-500' : ''}`}
            rows={4}
          />
          {errors.thank_you_message && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.thank_you_message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Use <code className="bg-gray-100 px-1 rounded">&#123;&#123;PRODUCT_NAME&#125;&#125;</code> para incluir o nome do produto automaticamente
          </p>
        </div>

        {/* Botão Salvar */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {success && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Configurações salvas!</span>
              </div>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
