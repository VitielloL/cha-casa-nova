'use client'

import { useEffect, useState, memo } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Gift, Package, CheckCircle, Clock } from 'lucide-react'

interface ProgressStats {
  total_principal: number
  reserved_principal: number
  received_principal: number
  total_adicional: number
  reserved_adicional: number
  received_adicional: number
  total_surprise: number
  reserved_surprise: number
  received_surprise: number
}

function ProgressBars() {
  const [stats, setStats] = useState<ProgressStats>({
    total_principal: 0,
    reserved_principal: 0,
    received_principal: 0,
    total_adicional: 0,
    reserved_adicional: 0,
    received_adicional: 0,
    total_surprise: 0,
    reserved_surprise: 0,
    received_surprise: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      try {
        // Fazer todas as consultas em paralelo para melhor performance
        const [productsResult, surpriseResult] = await Promise.all([
          supabase
            .from('products')
            .select('reservation_status, item_type'),
          supabase
            .from('surprise_items')
            .select('reservation_status, item_type')
            .eq('is_visible', true)
        ])

        if (!isMounted) return

        if (productsResult.error) {
          console.error('Erro ao carregar produtos:', productsResult.error)
          if (isMounted) setLoading(false)
          return
        }
        
        if (surpriseResult.error) {
          console.error('Erro ao carregar itens surpresa:', surpriseResult.error)
          if (isMounted) setLoading(false)
          return
        }

        const productsData = productsResult.data || []
        const surpriseData = surpriseResult.data || []

        // Calcular estatísticas em uma única passada
        const stats = {
          total_principal: 0,
          reserved_principal: 0,
          received_principal: 0,
          total_adicional: 0,
          reserved_adicional: 0,
          received_adicional: 0,
          total_surprise: 0,
          reserved_surprise: 0,
          received_surprise: 0
        }

        // Processar produtos
        productsData.forEach(item => {
          if (item.item_type === 'principal') {
            stats.total_principal++
            if (item.reservation_status === 'reserved') stats.reserved_principal++
            if (item.reservation_status === 'received') stats.received_principal++
          } else if (item.item_type === 'adicional') {
            stats.total_adicional++
            if (item.reservation_status === 'reserved') stats.reserved_adicional++
            if (item.reservation_status === 'received') stats.received_adicional++
          }
        })

        // Processar itens surpresa
        surpriseData.forEach(item => {
          stats.total_surprise++
          if (item.reservation_status === 'reserved') stats.reserved_surprise++
          if (item.reservation_status === 'received') stats.received_surprise++
        })

        if (isMounted) {
          setStats(stats)
          setLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          console.error('Erro ao carregar estatísticas:', error)
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])


  const calculatePercentage = (received: number, total: number) => {
    if (total === 0) return 0
    return Math.round((received / total) * 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500'
    if (percentage >= 75) return 'bg-blue-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getProgressText = (percentage: number) => {
    if (percentage >= 100) return 'Completo! 🎉'
    if (percentage >= 75) return 'Quase lá! 💪'
    if (percentage >= 50) return 'Na metade! 📈'
    return 'Começando! 🚀'
  }

  if (loading) {
    return (
      <Card className="mobile-card mb-6">
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

  const principalPercentage = calculatePercentage(stats.received_principal, stats.total_principal)
  const adicionalPercentage = calculatePercentage(stats.received_adicional, stats.total_adicional)
  const surprisePercentage = calculatePercentage(stats.received_surprise, stats.total_surprise)

  return (
    <Card className="mobile-card mb-6">
      <CardHeader>
        <CardTitle className="mobile-subtitle text-center flex items-center justify-center">
          <Gift className="w-6 h-6 mr-2 text-pink-500" />
          Progresso da Lista de Presentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Produtos Principais */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Produtos Principais</span>
            </div>
            <span className="text-sm text-gray-600">
              {stats.received_principal}/{stats.total_principal}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(principalPercentage)}`}
              style={{ width: `${principalPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {principalPercentage}% - {getProgressText(principalPercentage)}
            </span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3" />
              <span>{stats.received_principal} recebidos</span>
            </div>
          </div>
        </div>

        {/* Produtos Adicionais */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Produtos Adicionais</span>
            </div>
            <span className="text-sm text-gray-600">
              {stats.received_adicional}/{stats.total_adicional}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(adicionalPercentage)}`}
              style={{ width: `${adicionalPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {adicionalPercentage}% - {getProgressText(adicionalPercentage)}
            </span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3" />
              <span>{stats.received_adicional} recebidos</span>
            </div>
          </div>
        </div>

        {/* Itens Surpresa */}
        {stats.total_surprise > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-gray-900">Itens Surpresa</span>
              </div>
              <span className="text-sm text-gray-600">
                {stats.received_surprise}/{stats.total_surprise}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(surprisePercentage)}`}
                style={{ width: `${surprisePercentage}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {surprisePercentage}% - {getProgressText(surprisePercentage)}
              </span>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <CheckCircle className="w-3 h-3" />
                <span>{stats.received_surprise} recebidos</span>
              </div>
            </div>
          </div>
        )}

        {/* Resumo Geral */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {stats.reserved_principal + stats.reserved_adicional + stats.reserved_surprise}
              </div>
              <div className="text-xs text-blue-700">Reservados</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {stats.received_principal + stats.received_adicional + stats.received_surprise}
              </div>
              <div className="text-xs text-green-700">Recebidos</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default memo(ProgressBars)
