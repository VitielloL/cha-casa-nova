import { useState, useEffect } from 'react'

export interface LocalReservation {
  id: string
  productId: string
  productName: string
  categoryName: string
  reservedBy: string
  reservedContact: string
  isAnonymous: boolean
  message?: string
  imagePreview?: string
  reservedAt: string
}

const STORAGE_KEY = 'vitielo_reservations'

export function useLocalReservations() {
  const [reservations, setReservations] = useState<LocalReservation[]>([])

  // Carregar reservas do localStorage na inicialização
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setReservations(parsed)
      }
    } catch (error) {
      console.error('Erro ao carregar reservas do localStorage:', error)
    }
  }, [])

  // Salvar no localStorage sempre que as reservas mudarem
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
    } catch (error) {
      console.error('Erro ao salvar reservas no localStorage:', error)
    }
  }, [reservations])

  const addReservation = (reservation: Omit<LocalReservation, 'id' | 'reservedAt'>) => {
    const newReservation: LocalReservation = {
      ...reservation,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reservedAt: new Date().toISOString()
    }
    
    setReservations(prev => [...prev, newReservation])
  }

  const removeReservation = (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id))
  }

  const clearAllReservations = () => {
    setReservations([])
  }

  const getReservationCount = () => reservations.length

  const hasReservations = () => reservations.length > 0

  return {
    reservations,
    addReservation,
    removeReservation,
    clearAllReservations,
    getReservationCount,
    hasReservations
  }
}
