'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Store, Heart, Gift, Settings } from 'lucide-react'

export default function HomePageMinimal() {
  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
          <Home className="w-8 h-8 text-pink-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lista de Presentes</h1>
        <p className="text-gray-600">
          Escolha uma categoria para ver os produtos disponíveis
        </p>
      </div>

      {/* Menu de navegação */}
      <div className="space-y-3">
        <Link href="/lojas">
          <Button variant="outline" className="w-full h-12 text-base">
            <Store className="w-5 h-5 mr-2" />
            Ver Lojas
          </Button>
        </Link>
        
        <Link href="/item-surpresa">
          <Button variant="outline" className="w-full h-12 text-base">
            <Gift className="w-5 h-5 mr-2" />
            Enviar Item Surpresa
          </Button>
        </Link>
        
        <Link href="/itens-surpresa">
          <Button variant="outline" className="w-full h-12 text-base">
            <Gift className="w-5 h-5 mr-2" />
            Ver Itens Surpresa
          </Button>
        </Link>
        
        <Link href="/sobre-nos">
          <Button variant="outline" className="w-full h-12 text-base">
            <Heart className="w-5 h-5 mr-2" />
            Sobre Nós
          </Button>
        </Link>
        
        <Link href="/login">
          <Button variant="outline" className="w-full h-12 text-base">
            <Settings className="w-5 h-5 mr-2" />
            Login Admin
          </Button>
        </Link>
      </div>
    </div>
  )
}
