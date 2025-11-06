'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, ArrowLeft } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { admin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/login')
    }
  }, [admin, loading, router])

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="mobile-container">
        <Card className="mobile-card">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="mobile-subtitle text-gray-900 mb-2">
              Acesso Restrito
            </h2>
            <p className="mobile-text text-gray-600 mb-6">
              Você precisa fazer login para acessar esta área.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => router.push('/login')}
                className="mobile-button w-full"
              >
                Fazer Login
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="mobile-button w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
