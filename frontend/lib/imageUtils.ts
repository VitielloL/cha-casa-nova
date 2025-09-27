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
 * Converte bytes do banco para base64 para exibir
 */
export function bytesToBase64(bytes: Uint8Array, mimeType: string = 'image/jpeg'): string {
  try {
    // Verificar se o array não está vazio
    if (!bytes || bytes.length === 0) {
      throw new Error('Array de bytes vazio')
    }
    
    // Converter Uint8Array para string de forma mais segura
    let binaryString = ''
    
    // Processar byte por byte para evitar stack overflow
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i])
    }
    
    const base64 = btoa(binaryString)
    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Erro ao converter bytes para base64:', error)
    // Retornar uma imagem de erro (ícone de imagem quebrada)
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
