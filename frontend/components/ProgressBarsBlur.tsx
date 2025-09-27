'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import BlurLoading from '@/components/BlurLoading'
import { useInstantProgress } from '@/lib/hooks/useInstantData'

interface ProgressData {
  principal: {
    total: number
    reserved: number
    percentage: number
  }
  adicional: {
    total: number
    reserved: number
    percentage: number
  }
}

export default function ProgressBarsBlur() {
  const { data: progressData, isUpdating } = useInstantProgress()

  return (
    <div className="space-y-4 mb-8">
      {/* Progresso Itens Principais */}
      <Card className="mobile-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Itens Principais</h3>
            <span className="text-sm text-gray-600">
              {progressData.principal.reserved}/{progressData.principal.total}
            </span>
          </div>
          <Progress 
            value={progressData.principal.percentage} 
            className="h-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            {progressData.principal.percentage}% reservados
          </p>
        </CardContent>
      </Card>

      {/* Progresso Itens Adicionais */}
      <Card className="mobile-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Itens Adicionais</h3>
            <span className="text-sm text-gray-600">
              {progressData.adicional.reserved}/{progressData.adicional.total}
            </span>
          </div>
          <Progress 
            value={progressData.adicional.percentage} 
            className="h-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            {progressData.adicional.percentage}% reservados
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
