'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, ShoppingBag, Store, Plus, Settings, Heart, Gift } from 'lucide-react'

export default function HomePageSimple() {
  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Home className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="mobile-title text-gray-900 mb-2">Lista de Presentes</h1>
        <p className="mobile-text text-gray-600">
          Escolha uma categoria para ver os produtos disponíveis
        </p>
      </div>

      {/* Menu de navegação */}
      <div className="space-y-3">
        <Link href="/lojas">
          <Button variant="outline" className="mobile-button w-full">
            <Store className="w-5 h-5 mr-2" />
            Ver Lojas
          </Button>
        </Link>
        
        <Link href="/item-surpresa">
          <Button variant="outline" className="mobile-button w-full">
            <Gift className="w-5 h-5 mr-2" />
            Enviar Item Surpresa
          </Button>
        </Link>
        
        <Link href="/itens-surpresa">
          <Button variant="outline" className="mobile-button w-full">
            <Gift className="w-5 h-5 mr-2" />
            Ver Itens Surpresa
          </Button>
        </Link>
        
        <Link href="/sobre-nos">
          <Button variant="outline" className="mobile-button w-full">
            <Heart className="w-5 h-5 mr-2" />
            Sobre Nós
          </Button>
        </Link>
        
        <Link href="/login">
          <Button variant="outline" className="mobile-button w-full">
            <Settings className="w-5 h-5 mr-2" />
            Login Admin
          </Button>
        </Link>
      </div>
    </div>
  )
}
