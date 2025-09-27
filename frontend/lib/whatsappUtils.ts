// Utilitários para WhatsApp

export interface WhatsAppConfig {
  whatsapp_number: string
  thank_you_message: string
  admin_whatsapp_number: string
}

// Países comuns e seus códigos
const COUNTRY_CODES: Record<string, string> = {
  'BR': '55',   // Brasil
  'US': '1',    // Estados Unidos
  'AR': '54',   // Argentina
  'CL': '56',   // Chile
  'CO': '57',   // Colômbia
  'MX': '52',   // México
  'PE': '51',   // Peru
  'UY': '598',  // Uruguai
  'PY': '595',  // Paraguai
  'BO': '591',  // Bolívia
  'EC': '593',  // Equador
  'VE': '58',   // Venezuela
  'PT': '351',  // Portugal
  'ES': '34',   // Espanha
  'FR': '33',   // França
  'DE': '49',   // Alemanha
  'IT': '39',   // Itália
  'GB': '44',   // Reino Unido
}

/**
 * Valida e formata um número de WhatsApp
 * @param phoneNumber Número de telefone (com ou sem código do país)
 * @param countryCode Código do país (ex: 'BR', 'US')
 * @returns Número formatado para WhatsApp ou null se inválido
 */
export function validateAndFormatWhatsAppNumber(
  phoneNumber: string, 
  countryCode: string = 'BR'
): string | null {
  if (!phoneNumber) return null

  // Remove todos os caracteres não numéricos
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  
  if (cleanNumber.length === 0) return null

  const countryPrefix = COUNTRY_CODES[countryCode] || '55' // Default Brasil

  // Se o número já tem o código do país
  if (cleanNumber.startsWith(countryPrefix)) {
    return cleanNumber
  }

  // Se o número tem 10-11 dígitos (número local)
  if (cleanNumber.length >= 10 && cleanNumber.length <= 11) {
    return countryPrefix + cleanNumber
  }

  // Se o número tem 12+ dígitos, pode ser internacional
  if (cleanNumber.length >= 12) {
    return cleanNumber
  }

  return null
}

/**
 * Formata um número para exibição
 * @param phoneNumber Número completo (ex: 5521986189443)
 * @returns Número formatado (ex: +55 21 98618-9443)
 */
export function formatPhoneNumberForDisplay(phoneNumber: string): string {
  if (!phoneNumber) return ''
  
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  
  if (cleanNumber.length <= 2) return phoneNumber
  
  // Para números brasileiros
  if (cleanNumber.startsWith('55') && cleanNumber.length === 13) {
    return `+55 ${cleanNumber.slice(2, 4)} ${cleanNumber.slice(4, 9)}-${cleanNumber.slice(9)}`
  }
  
  // Para outros países, adiciona + no início
  if (cleanNumber.length >= 10) {
    return `+${cleanNumber}`
  }
  
  return phoneNumber
}

/**
 * Gera URL do WhatsApp
 * @param phoneNumber Número completo (ex: 5521986189443)
 * @param message Mensagem a ser enviada
 * @returns URL do WhatsApp
 */
export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  if (!phoneNumber || !message) return ''
  
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}

/**
 * Substitui placeholders na mensagem
 * @param message Mensagem com placeholders
 * @param replacements Objeto com valores para substituição
 * @returns Mensagem com placeholders substituídos
 */
export function replaceMessagePlaceholders(
  message: string, 
  replacements: Record<string, string>
): string {
  let result = message
  
  Object.entries(replacements).forEach(([key, value]) => {
    const placeholder = `{{${key.toUpperCase()}}}`
    result = result.replace(new RegExp(placeholder, 'g'), value)
  })
  
  return result
}

/**
 * Valida se um número é válido para WhatsApp
 * @param phoneNumber Número a ser validado
 * @returns true se válido, false caso contrário
 */
export function isValidWhatsAppNumber(phoneNumber: string): boolean {
  if (!phoneNumber) return false
  
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  
  // Número deve ter pelo menos 10 dígitos
  if (cleanNumber.length < 10) return false
  
  // Número não pode ter mais de 15 dígitos (padrão internacional)
  if (cleanNumber.length > 15) return false
  
  // Para números brasileiros (55 + DDD + número)
  if (cleanNumber.startsWith('55') && cleanNumber.length === 13) {
    // Verifica se o DDD é válido (11-99)
    const ddd = cleanNumber.slice(2, 4)
    const dddNum = parseInt(ddd)
    if (dddNum < 11 || dddNum > 99) return false
    
    // Verifica se o número tem 9 dígitos (celular)
    const number = cleanNumber.slice(4)
    if (number.length !== 9) return false
    
    return true
  }
  
  // Para números sem código do país (assume Brasil)
  if (cleanNumber.length === 11) {
    // Verifica se o DDD é válido (11-99)
    const ddd = cleanNumber.slice(0, 2)
    const dddNum = parseInt(ddd)
    if (dddNum < 11 || dddNum > 99) return false
    
    return true
  }
  
  // Para outros países, aceita se tem 10-15 dígitos
  return cleanNumber.length >= 10 && cleanNumber.length <= 15
}

/**
 * Extrai código do país de um número
 * @param phoneNumber Número completo
 * @returns Código do país ou null
 */
export function extractCountryCode(phoneNumber: string): string | null {
  if (!phoneNumber) return null
  
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  
  // Tenta encontrar código do país conhecido
  for (const [country, code] of Object.entries(COUNTRY_CODES)) {
    if (cleanNumber.startsWith(code)) {
      return country
    }
  }
  
  return null
}
