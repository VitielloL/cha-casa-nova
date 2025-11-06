// Utilitários para manipulação de imagens

export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
}

export interface OptimizedImage {
  data: string // base64
  width: number
  height: number
  size: number // em bytes
  mimeType: string
}

// Configurações padrão para otimização
const DEFAULT_OPTIONS: Required<ImageOptimizationOptions> = {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8,
  maxSizeKB: 200 // 200KB máximo
}

/**
 * Otimiza uma imagem para salvar no banco de dados
 */
export async function optimizeImageForDatabase(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImage> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      try {
        // Calcular novas dimensões mantendo proporção
        let { width, height } = calculateDimensions(
          img.width,
          img.height,
          opts.maxWidth,
          opts.maxHeight
        )
        
        // Configurar canvas
        canvas.width = width
        canvas.height = height
        
        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Converter para base64 com qualidade
        const dataURL = canvas.toDataURL('image/jpeg', opts.quality)
        
        // Verificar tamanho
        const sizeKB = (dataURL.length * 0.75) / 1024 // Aproximação do tamanho em KB
        
        if (sizeKB > opts.maxSizeKB) {
          // Se ainda estiver muito grande, reduzir qualidade
          const newQuality = Math.max(0.3, opts.quality * (opts.maxSizeKB / sizeKB))
          const newDataURL = canvas.toDataURL('image/jpeg', newQuality)
          
          resolve({
            data: newDataURL,
            width,
            height,
            size: Math.round(newDataURL.length * 0.75),
            mimeType: 'image/jpeg'
          })
        } else {
          resolve({
            data: dataURL,
            width,
            height,
            size: Math.round(dataURL.length * 0.75),
            mimeType: 'image/jpeg'
          })
        }
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => reject(new Error('Erro ao carregar imagem'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Calcula as novas dimensões mantendo a proporção
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = originalWidth
  let height = originalHeight
  
  // Reduzir se exceder largura máxima
  if (width > maxWidth) {
    height = (height * maxWidth) / width
    width = maxWidth
  }
  
  // Reduzir se exceder altura máxima
  if (height > maxHeight) {
    width = (width * maxHeight) / height
    height = maxHeight
  }
  
  return { width: Math.round(width), height: Math.round(height) }
}

/**
 * Converte base64 para bytes para salvar no banco
 */
export function base64ToBytes(base64: string): Uint8Array {
  const base64Data = base64.split(',')[1] // Remove o prefixo data:image/jpeg;base64,
  const binaryString = atob(base64Data)
  const bytes = new Uint8Array(binaryString.length)
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  return bytes
}

/**
 * Converte Uint8Array para data URL base64
 */
function convertUint8ArrayToBase64(bytes: Uint8Array, mimeType: string = 'image/jpeg'): string {
  console.log('[convertUint8ArrayToBase64] Iniciando conversão', { 
    bytesLength: bytes.length,
    mimeType 
  })

  // Converter Uint8Array para base64
  let binaryString = ''
  const startTime = performance.now()
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i])
  }
  const binaryTime = performance.now() - startTime
  
  console.log('[convertUint8ArrayToBase64] Binary string criada', { 
    binaryLength: binaryString.length,
    timeMs: binaryTime.toFixed(2)
  })
  
  const base64StartTime = performance.now()
  const base64 = btoa(binaryString)
  const base64Time = performance.now() - base64StartTime
  
  console.log('[convertUint8ArrayToBase64] Base64 criado', { 
    base64Length: base64.length,
    timeMs: base64Time.toFixed(2)
  })
  
  const dataUrl = `data:${mimeType};base64,${base64}`
  console.log('[convertUint8ArrayToBase64] ✅ Data URL criada', { 
    totalLength: dataUrl.length,
    startsWith: dataUrl.substring(0, 30)
  })
  
  return dataUrl
}

/**
 * Converte bytes do banco para base64 para exibir
 */
export function bytesToBase64(bytesOrBase64: unknown, mimeType: string = 'image/jpeg'): string {
  console.log('[bytesToBase64] INÍCIO', { 
    type: typeof bytesOrBase64,
    isUint8Array: bytesOrBase64 instanceof Uint8Array,
    isArray: Array.isArray(bytesOrBase64),
    isObject: typeof bytesOrBase64 === 'object' && bytesOrBase64 !== null,
    isNull: bytesOrBase64 === null,
    constructor: bytesOrBase64?.constructor?.name,
    mimeType
  })
  
  try {
    // Caso já venha uma string base64 (com ou sem prefixo data:)
    if (typeof bytesOrBase64 === 'string') {
      const str = bytesOrBase64.trim()
      console.log('[bytesToBase64] É STRING', { 
        length: str.length, 
        startsWithData: str.startsWith('data:'),
        firstChars: str.substring(0, 50),
        hasHexEscapes: str.includes('\\x'),
        mimeType 
      })
      if (!str) throw new Error('String base64 vazia')
      if (str.startsWith('data:')) {
        console.log('[bytesToBase64] Já é data URL, retornando direto')
        return str
      }
      
      // Verificar se a string contém escapes hexadecimais (ex: \x7b = {)
      // Isso indica que é uma string JSON serializada com escapes
      // O Supabase pode retornar como string literal com escapes: "\\x7b" (que é \x7b na string)
      const hasHexEscapes = str.includes('\\x') || /\\x[0-9a-fA-F]{2}/i.test(str)
      if (hasHexEscapes) {
        console.log('[bytesToBase64] 🔍 Detectado escapes hexadecimais, decodificando...', {
          sample: str.substring(0, 100)
        })
        
        // Decodificar escapes hexadecimais (\x7b -> {, \x22 -> ", etc)
        // A regex procura por \x seguido de 2 hexadecimais (pode ter 1 ou 2 backslashes)
        let decodedStr = str
        // Primeiro, tratar caso de dois backslashes (string literal)
        decodedStr = decodedStr.replace(/\\\\x([0-9a-fA-F]{2})/gi, (match, hex) => {
          const charCode = parseInt(hex, 16)
          return String.fromCharCode(charCode)
        })
        // Depois, tratar caso de um backslash
        decodedStr = decodedStr.replace(/\\x([0-9a-fA-F]{2})/gi, (match, hex) => {
          const charCode = parseInt(hex, 16)
          return String.fromCharCode(charCode)
        })
        
        console.log('[bytesToBase64] ✅ String decodificada (primeira passagem)', { 
          originalLength: str.length, 
          decodedLength: decodedStr.length,
          firstChars: decodedStr.substring(0, 50)
        })
        
        // Verificar se após decodificar os escapes, ainda temos hexadecimal puro
        // Ex: após \x7b -> {, temos {2230223a... onde 2230223a são pares hex que precisam ser decodificados
        // Se a string começa com { e o próximo caractere é hex, decodificar tudo em pares
        if (decodedStr.startsWith('{') && decodedStr.length > 1) {
          const secondChar = decodedStr.charAt(1)
          // Se o segundo caractere é hexadecimal, provavelmente toda a string (exceto o {) é hex
          if (/[0-9a-fA-F]/.test(secondChar)) {
            console.log('[bytesToBase64] 🔍 Detectado hexadecimal puro após {, decodificando...')
            // Decodificar tudo após o { em pares hexadecimais
            let fullyDecoded = '{'
            let i = 1
            while (i < decodedStr.length) {
              if (i + 1 < decodedStr.length) {
                const hexPair = decodedStr.substring(i, i + 2)
                if (/^[0-9a-fA-F]{2}$/.test(hexPair)) {
                  const charCode = parseInt(hexPair, 16)
                  fullyDecoded += String.fromCharCode(charCode)
                  i += 2
                } else {
                  // Se não é um par hex válido, parar a decodificação
                  // Pode ser que já tenhamos o JSON completo
                  break
                }
              } else {
                // Caractere solto no final, manter como está
                fullyDecoded += decodedStr.charAt(i)
                i++
              }
            }
            // Se ainda sobraram caracteres, adicionar
            if (i < decodedStr.length) {
              fullyDecoded += decodedStr.substring(i)
            }
            decodedStr = fullyDecoded
            console.log('[bytesToBase64] ✅ String totalmente decodificada', { 
              length: decodedStr.length,
              firstChars: decodedStr.substring(0, 100),
              lastChars: decodedStr.substring(Math.max(0, decodedStr.length - 50))
            })
          }
        }
        
        // Tentar fazer parse do JSON
        try {
          const parsed = JSON.parse(decodedStr)
          console.log('[bytesToBase64] ✅ JSON parseado', { 
            type: typeof parsed,
            isObject: typeof parsed === 'object' && parsed !== null,
            isArray: Array.isArray(parsed),
            keysCount: typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 0
          })
          
          // Se for um objeto com chaves numéricas, converter para bytes
          if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
            const keys = Object.keys(parsed)
            const numericKeys = keys.filter(k => /^\d+$/.test(k))
            
            if (numericKeys.length > 0) {
              console.log('[bytesToBase64] 🔄 Convertendo objeto JSON para bytes', { 
                totalKeys: keys.length,
                numericKeys: numericKeys.length 
              })
              
              // Ordenar chaves numericamente e extrair valores
              const sortedKeys = numericKeys.map(k => parseInt(k, 10)).sort((a, b) => a - b)
              const bytesArray = sortedKeys.map(key => {
                const value = parsed[key.toString()]
                if (typeof value !== 'number' || value < 0 || value > 255) {
                  throw new Error(`Valor inválido na chave ${key}: ${value}`)
                }
                return value
              })
              
              console.log('[bytesToBase64] ✅ Array de bytes extraído', { 
                length: bytesArray.length,
                firstBytes: bytesArray.slice(0, 10)
              })
              
              // Converter para Uint8Array e depois para base64
              const uint8Array = new Uint8Array(bytesArray)
              return convertUint8ArrayToBase64(uint8Array, mimeType)
            }
          }
        } catch (parseError) {
          console.error('[bytesToBase64] ❌ Erro ao fazer parse do JSON decodificado', parseError)
          throw new Error(`Erro ao processar string com escapes hexadecimais: ${parseError}`)
        }
      }
      
      // Se não tem escapes hexadecimais, assumir que é base64 puro
      console.log('[bytesToBase64] Adicionando prefixo data:', { mimeType })
      return `data:${mimeType};base64,${str}`
    }

    // Normalizar para Uint8Array se vier como Array ou objeto similar
    let bytes: Uint8Array
    if (bytesOrBase64 instanceof Uint8Array) {
      console.log('[bytesToBase64] É Uint8Array', { 
        length: bytesOrBase64.length, 
        mimeType,
        firstBytes: Array.from(bytesOrBase64.slice(0, 10))
      })
      bytes = bytesOrBase64
    } else if (Array.isArray(bytesOrBase64)) {
      console.log('[bytesToBase64] É Array', { 
        length: (bytesOrBase64 as number[]).length, 
        mimeType,
        firstValues: (bytesOrBase64 as number[]).slice(0, 10)
      })
      bytes = new Uint8Array(bytesOrBase64 as number[])
      console.log('[bytesToBase64] Array convertido para Uint8Array', { length: bytes.length })
    } else if (
      typeof bytesOrBase64 === 'object' && bytesOrBase64 !== null &&
      'data' in (bytesOrBase64 as any) && Array.isArray((bytesOrBase64 as any).data)
    ) {
      // Alguns drivers retornam { data: number[] }
      console.log('[bytesToBase64] É objeto com { data: number[] }', { 
        length: (bytesOrBase64 as any).data.length, 
        mimeType,
        firstValues: (bytesOrBase64 as any).data.slice(0, 10)
      })
      bytes = new Uint8Array((bytesOrBase64 as any).data)
      console.log('[bytesToBase64] Objeto convertido para Uint8Array', { length: bytes.length })
    } else if (typeof bytesOrBase64 === 'object' && bytesOrBase64 !== null && !Array.isArray(bytesOrBase64)) {
      // Verificar se é um objeto com chaves numéricas (ex: {"0":255,"1":216,...})
      // Isso acontece quando o Supabase serializa BYTEA como JSON
      const obj = bytesOrBase64 as Record<string, number>
      const keys = Object.keys(obj)
      
      console.log('[bytesToBase64] É objeto genérico', { 
        keysCount: keys.length,
        firstKeys: keys.slice(0, 20),
        firstValues: keys.slice(0, 20).map(k => obj[k]),
        sampleKey: keys[0],
        sampleValue: keys[0] ? obj[keys[0]] : null,
        mimeType
      })
      
      // Verificar se todas as chaves são numéricas e os valores são números válidos (0-255)
      const allNumericKeys = keys.length > 0 && keys.every(key => {
        const numKey = parseInt(key, 10)
        return !isNaN(numKey) && numKey >= 0 && typeof obj[key] === 'number' && obj[key] >= 0 && obj[key] <= 255
      })
      
      console.log('[bytesToBase64] Validação de chaves numéricas', { 
        allNumericKeys,
        keysCount: keys.length,
        sampleValidation: keys.slice(0, 5).map(k => {
          const numKey = parseInt(k, 10)
          return {
            key: k,
            numKey,
            isValid: !isNaN(numKey) && numKey >= 0,
            value: obj[k],
            valueValid: typeof obj[k] === 'number' && obj[k] >= 0 && obj[k] <= 255
          }
        })
      })
      
      if (allNumericKeys) {
        // Ordenar chaves numericamente e extrair valores
        const sortedKeys = keys.map(k => parseInt(k, 10)).sort((a, b) => a - b)
        console.log('[bytesToBase64] Chaves ordenadas', { 
          firstSorted: sortedKeys.slice(0, 10),
          lastSorted: sortedKeys.slice(-5),
          total: sortedKeys.length
        })
        
        const bytesArray = sortedKeys.map(key => obj[key.toString()])
        console.log('[bytesToBase64] Array de bytes extraído', { 
          length: bytesArray.length, 
          mimeType,
          firstBytes: bytesArray.slice(0, 10),
          lastBytes: bytesArray.slice(-5)
        })
        
        bytes = new Uint8Array(bytesArray)
        console.log('[bytesToBase64] Uint8Array criado do objeto JSON', { length: bytes.length })
      } else {
        console.error('[bytesToBase64] Objeto não tem chaves numéricas válidas', { 
          type: typeof bytesOrBase64, 
          isObject: typeof bytesOrBase64 === 'object',
          constructor: bytesOrBase64?.constructor?.name,
          keys: keys.slice(0, 20),
          keysCount: keys.length,
          preview: JSON.stringify(bytesOrBase64).substring(0, 200)
        })
        throw new Error('Formato de bytes desconhecido para conversão')
      }
    } else {
      console.error('[bytesToBase64] Formato completamente desconhecido', { 
        type: typeof bytesOrBase64, 
        isObject: typeof bytesOrBase64 === 'object',
        isNull: bytesOrBase64 === null,
        constructor: bytesOrBase64?.constructor?.name,
        preview: typeof bytesOrBase64 === 'string' ? (bytesOrBase64 as string).substring(0, 100) : String(bytesOrBase64).substring(0, 100)
      })
      throw new Error('Formato de bytes desconhecido para conversão')
    }

    if (!bytes || bytes.length === 0) {
      console.error('[bytesToBase64] Array de bytes está vazio')
      throw new Error('Array de bytes vazio')
    }

    console.log('[bytesToBase64] Iniciando conversão para base64', { 
      bytesLength: bytes.length,
      mimeType 
    })

    // Converter Uint8Array para base64
    let binaryString = ''
    const startTime = performance.now()
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i])
    }
    const binaryTime = performance.now() - startTime
    
    console.log('[bytesToBase64] Binary string criada', { 
      binaryLength: binaryString.length,
      timeMs: binaryTime.toFixed(2)
    })
    
    const base64StartTime = performance.now()
    const base64 = btoa(binaryString)
    const base64Time = performance.now() - base64StartTime
    
    console.log('[bytesToBase64] Base64 criado', { 
      bytesLength: bytes.length, 
      base64Length: base64.length,
      timeMs: base64Time.toFixed(2),
      mimeType,
      firstChars: base64.substring(0, 50)
    })
    
    const dataUrl = `data:${mimeType};base64,${base64}`
    console.log('[bytesToBase64] Data URL criada', { 
      dataUrlLength: dataUrl.length,
      startsWith: dataUrl.substring(0, 30)
    })
    
    return dataUrl
  } catch (error) {
    console.error('[bytesToBase64] ERRO ao converter bytes para base64', { 
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      inputType: typeof bytesOrBase64,
      inputIsUint8Array: bytesOrBase64 instanceof Uint8Array,
      inputIsArray: Array.isArray(bytesOrBase64),
      inputIsObject: typeof bytesOrBase64 === 'object' && bytesOrBase64 !== null,
      inputPreview: typeof bytesOrBase64 === 'string' 
        ? (bytesOrBase64 as string).substring(0, 200) 
        : typeof bytesOrBase64 === 'object' && bytesOrBase64 !== null
        ? JSON.stringify(bytesOrBase64).substring(0, 200)
        : String(bytesOrBase64).substring(0, 200)
    })
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAzMiAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiA4VjE2TTEyIDEySDE2SDIwIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo='
  }
}

/**
 * Valida se o arquivo é uma imagem válida
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Verificar tipo MIME
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Arquivo deve ser uma imagem' }
  }
  
  // Verificar tamanho (5MB máximo antes da otimização)
  const maxSizeMB = 5
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Arquivo muito grande. Máximo: ${maxSizeMB}MB` }
  }
  
  // Verificar extensões suportadas
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'Formato não suportado. Use JPG, PNG ou WebP' }
  }
  
  return { valid: true }
}

/**
 * Gera um nome único para o arquivo
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
  return `img_${timestamp}_${random}.${extension}`
}
