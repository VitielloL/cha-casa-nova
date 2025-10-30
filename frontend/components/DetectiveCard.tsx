'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserX, Search, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

interface DetectiveCardProps {
  productName?: string
  title?: string
  message?: string
  onReveal?: () => void
  onInvestigate?: () => void
}

export default function DetectiveCard({ productName, title, message, onReveal, onInvestigate }: DetectiveCardProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [investigationLevel, setInvestigationLevel] = useState(0)

  const handleReveal = () => {
    setIsRevealed(true)
    if (onReveal) onReveal()
  }

  const handleInvestigate = () => {
    setInvestigationLevel(prev => Math.min(prev + 1, 3))
    if (onInvestigate) onInvestigate()
  }

  const getInvestigationText = () => {
    switch (investigationLevel) {
      case 0: return "🔍 Iniciando investigação..."
      case 1: return "🕵️‍♂️ Analisando evidências..."
      case 2: return "🔬 Examinando pistas..."
      case 3: return "💡 Eureka! Mas ainda não descobri quem é..."
      default: return "🕵️‍♂️ Caso em andamento..."
    }
  }

  const getInvestigationColor = () => {
    switch (investigationLevel) {
      case 0: return "text-gray-600"
      case 1: return "text-yellow-600"
      case 2: return "text-orange-600"
      case 3: return "text-red-600"
      default: return "text-gray-600"
    }
  }

  return (
    <Card className="mobile-card border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardContent className="p-4">
        <div className="text-center">
          {/* Ícone do detetive */}
          <div className="mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserX className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-purple-900 text-lg">{title || '🕵️‍♂️ Caso Misterioso'}</h3>
            {productName && (
              <p className="text-sm text-purple-700">Produto: {productName}</p>
            )}
          </div>

          {/* Status da investigação */}
          <div className="mb-4">
            <div className="p-3 bg-white rounded-lg border border-purple-200">
              <p className={`text-sm font-medium ${getInvestigationColor()}`}>
                {getInvestigationText()}
              </p>
            </div>
          </div>

          {/* Barra de progresso da investigação */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(investigationLevel / 3) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Progresso da investigação: {Math.round((investigationLevel / 3) * 100)}%
            </p>
          </div>

          {/* Botões de ação */}
          <div className="space-y-2">
            {!isRevealed ? (
              <>
                <Button
                  onClick={handleInvestigate}
                  disabled={investigationLevel >= 3}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {investigationLevel >= 3 ? 'Investigação Completa' : 'Investigar Mais'}
                </Button>
                
                <Button
                  onClick={handleReveal}
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Revelar Identidade
                </Button>
              </>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-center space-x-2 text-red-700 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-bold">Caso Resolvido!</span>
                </div>
                <p className="text-sm text-red-600">
                  A identidade foi revelada! Mas... ainda é um mistério! 🤔
                </p>
              </div>
            )}
          </div>

          {/* Dicas do detetive */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800">
                {message ? (
                  <>{message}</>
                ) : (
                  <>
                    <strong>💡 Dica do Detetive:</strong> {investigationLevel === 0 && "Alguém muito esperto reservou este produto..."}
                    {investigationLevel === 1 && "A pessoa gosta de mistérios e surpresas..."}
                    {investigationLevel === 2 && "Definitivamente alguém próximo, mas quem será?"}
                    {investigationLevel === 3 && "Mesmo com toda investigação, a identidade permanece um enigma!"}
                  </>
                )}
              </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
