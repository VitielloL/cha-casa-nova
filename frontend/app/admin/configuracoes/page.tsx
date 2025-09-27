'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import WhatsAppConfig from '@/components/WhatsAppConfig'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ArrowLeft, Settings } from 'lucide-react'

function AdminConfiguracoesContent() {
  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="mobile-title text-gray-900 flex items-center">
            <Settings className="w-6 h-6 mr-2 text-blue-600" />
            Configurações
          </h1>
          <p className="text-sm text-gray-500">
            Configure números e mensagens do WhatsApp
          </p>
        </div>
      </div>

      {/* Configurações do WhatsApp */}
      <WhatsAppConfig />
    </div>
  )
}

export default function AdminConfiguracoesPage() {
  return (
    <ProtectedRoute>
      <AdminConfiguracoesContent />
    </ProtectedRoute>
  )
}
