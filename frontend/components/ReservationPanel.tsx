'use client'


import { useState } from 'react'
import { useLocalReservations, LocalReservation } from '@/lib/hooks/useLocalReservations'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  X, 
  Trash2, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  Image as ImageIcon,
  User,
  UserX,
  Calendar
} from 'lucide-react'

export default function ReservationPanel() {
  const { 
    reservations, 
    removeReservation, 
    clearAllReservations, 
    getReservationCount,
    hasReservations 
  } = useLocalReservations()
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})


  const toggleDetails = (id: string) => {
    setShowDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!hasReservations()) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {/* Botão do carrinho */}
      <div className="flex flex-col items-end space-y-2">
        {/* Contador de reservas */}
        <div className="flex items-center space-x-2">
          <Badge variant="destructive" className="text-xs">
            {getReservationCount()} reserva{getReservationCount() !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Botão principal */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg"
        >
          <ShoppingCart className="w-6 h-6" />
        </Button>
      </div>

      {/* Painel expandido */}
      {isExpanded && (
        <Card className="mt-2 w-80 max-h-96 overflow-y-auto shadow-xl border-pink-200">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-pink-500" />
                <span>Minhas Reservas</span>
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={clearAllReservations}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setIsExpanded(false)}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Lista de reservas */}
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="border border-gray-200 rounded-lg p-3">
                  {/* Header da reserva */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {reservation.productName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {reservation.categoryName}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        onClick={() => toggleDetails(reservation.id)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        {showDetails[reservation.id] ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        onClick={() => removeReservation(reservation.id)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Data da reserva */}
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(reservation.reservedAt)}</span>
                  </div>

                  {/* Detalhes expandidos */}
                  {showDetails[reservation.id] && (
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      {/* Dados da pessoa */}
                      <div className="flex items-center space-x-2 text-xs">
                        {reservation.isAnonymous ? (
                          <>
                            <UserX className="w-3 h-3 text-purple-500" />
                            <span className="text-purple-600">Reservado anonimamente</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 text-blue-500" />
                            <span className="text-blue-600">{reservation.reservedBy}</span>
                          </>
                        )}
                      </div>

                      {/* Mensagem carinhosa */}
                      {reservation.message && (
                        <div className="flex items-start space-x-2 text-xs">
                          <MessageCircle className="w-3 h-3 text-yellow-500 mt-0.5" />
                          <div>
                            <p className="text-yellow-700 italic">"{reservation.message}"</p>
                          </div>
                        </div>
                      )}

                      {/* Foto fofa */}
                      {reservation.imagePreview && (
                        <div className="flex items-start space-x-2 text-xs">
                          <ImageIcon className="w-3 h-3 text-purple-500 mt-0.5" />
                          <div>
                            <img
                              src={reservation.imagePreview}
                              alt="Foto fofa"
                              className="w-16 h-12 object-cover rounded border border-purple-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                            <p className="text-purple-600 mt-1">Foto fofa! 🥰</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                💡 Suas reservas ficam salvas localmente
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
