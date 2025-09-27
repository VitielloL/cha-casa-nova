// Sistema de cache para imagens
class ImageCache {
  private cache = new Map<string, string>()
  private loadingPromises = new Map<string, Promise<string>>()

  async getImage(imageId: string, fetchFunction: () => Promise<string>): Promise<string> {
    // Se já está no cache, retorna imediatamente
    if (this.cache.has(imageId)) {
      return this.cache.get(imageId)!
    }

    // Se já está carregando, aguarda a promise existente
    if (this.loadingPromises.has(imageId)) {
      return this.loadingPromises.get(imageId)!
    }

    // Inicia o carregamento
    const promise = fetchFunction().then((imageUrl) => {
      this.cache.set(imageId, imageUrl)
      this.loadingPromises.delete(imageId)
      return imageUrl
    }).catch((error) => {
      this.loadingPromises.delete(imageId)
      throw error
    })

    this.loadingPromises.set(imageId, promise)
    return promise
  }

  // Limpar cache (útil para logout ou mudanças)
  clear() {
    this.cache.clear()
    this.loadingPromises.clear()
  }

  // Remover imagem específica do cache
  remove(imageId: string) {
    this.cache.delete(imageId)
    this.loadingPromises.delete(imageId)
  }

  // Verificar se imagem está no cache
  has(imageId: string): boolean {
    return this.cache.has(imageId)
  }
}

// Instância global do cache
export const imageCache = new ImageCache()
