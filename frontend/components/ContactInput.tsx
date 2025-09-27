'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { validateAndFormatWhatsAppNumber, isValidWhatsAppNumber, formatPhoneNumberForDisplay } from '@/lib/whatsappUtils'
import { AlertCircle, Phone, CheckCircle, Globe } from 'lucide-react'

interface ContactInputProps {
  value: string
  onChange: (value: string) => void
  onValidationChange: (isValid: boolean, formattedValue?: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
}

// Países e códigos mais comuns
const COUNTRIES = [
  { code: 'BR', name: 'Brasil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colômbia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'UY', name: 'Uruguai', dialCode: '+598', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguai', dialCode: '+595', flag: '🇵🇾' },
  { code: 'BO', name: 'Bolívia', dialCode: '+591', flag: '🇧🇴' },
  { code: 'EC', name: 'Equador', dialCode: '+593', flag: '🇪🇨' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'ES', name: 'Espanha', dialCode: '+34', flag: '🇪🇸' },
  { code: 'FR', name: 'França', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Alemanha', dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', name: 'Itália', dialCode: '+39', flag: '🇮🇹' },
  { code: 'GB', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧' },
]

export default function ContactInput({
  value,
  onChange,
  onValidationChange,
  label = "WhatsApp",
  placeholder = "5521986189443",
  required = true,
  className = ""
}: ContactInputProps) {
  const [error, setError] = useState('')
  const [formattedValue, setFormattedValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [contactType, setContactType] = useState<'phone' | 'email' | 'unknown'>('unknown')
  const [selectedCountry, setSelectedCountry] = useState('BR')
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    // Quando o valor externo muda, atualiza o número local
    if (value !== phoneNumber) {
      setPhoneNumber(value)
    }
  }, [value])

  useEffect(() => {
    validateContact()
  }, [phoneNumber, selectedCountry])

  const validateContact = () => {
    if (!phoneNumber.trim()) {
      setError(required ? 'Número de WhatsApp é obrigatório' : '')
      setIsValid(!required)
      onValidationChange(!required)
      return
    }

    const cleanNumber = phoneNumber.replace(/\D/g, '')
    const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry)
    
    if (!selectedCountryData) {
      setError('País inválido')
      setIsValid(false)
      onValidationChange(false)
      return
    }

    // Monta o número completo com código do país
    const fullNumber = selectedCountryData.dialCode.replace('+', '') + cleanNumber
    
    if (cleanNumber.length >= 10) {
      if (!isValidWhatsAppNumber(fullNumber)) {
        setError(`Número de WhatsApp inválido para ${selectedCountryData.name}`)
        setIsValid(false)
        onValidationChange(false)
        setContactType('unknown')
        return
      }
      
      // Formatar número para exibição
      const formatted = formatPhoneNumberForDisplay(fullNumber)
      setFormattedValue(formatted)
      setContactType('phone')
      setError('')
      setIsValid(true)
      onValidationChange(true, fullNumber)
    } else {
      setError('Digite um número de WhatsApp válido (mínimo 10 dígitos)')
      setIsValid(false)
      onValidationChange(false)
      setContactType('unknown')
    }
  }

  const handlePhoneChange = (newPhone: string) => {
    setPhoneNumber(newPhone)
    onChange(newPhone) // Notifica o componente pai
  }

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode)
    // Revalida com o novo país
    setTimeout(() => validateContact(), 100)
  }

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-4 h-4 text-red-500" />
    if (isValid && contactType === 'phone') return <Phone className="w-4 h-4 text-green-500" />
    if (isValid && contactType === 'email') return <Mail className="w-4 h-4 text-green-500" />
    return null
  }

  const getStatusText = () => {
    if (error) return error
    if (isValid && contactType === 'phone') return `WhatsApp: ${formattedValue}`
    return ''
  }

  const getStatusColor = () => {
    if (error) return 'text-red-600'
    if (isValid) return 'text-green-600'
    return 'text-gray-500'
  }

  const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry)

  return (
    <div className={className}>
      <Label>{label} {required && '*'}</Label>
      <div className="mt-1 space-y-2">
        <div className="flex space-x-2">
          {/* Select de País */}
          <div className="w-32">
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="h-10">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <span>{selectedCountryData?.flag}</span>
                    <span className="text-sm">{selectedCountryData?.dialCode}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center space-x-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="text-gray-500">{country.dialCode}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input do Número */}
          <div className="flex-1 relative">
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                handlePhoneChange(e.target.value)
                // Limpar erro quando usuário digita
                if (error) {
                  setError('')
                }
              }}
              placeholder={selectedCountryData?.code === 'BR' ? '21986189443' : '1234567890'}
              required={required}
              className={`${error ? 'border-red-500' : isValid ? 'border-green-500' : ''} pr-10`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getStatusIcon()}
            </div>
          </div>
        </div>
        
        {getStatusText() && (
          <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
            <span>{getStatusText()}</span>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        Selecione seu país e digite apenas o número (sem código do país)
      </p>
    </div>
  )
}
