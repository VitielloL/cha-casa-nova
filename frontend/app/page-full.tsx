'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCategoriesSimple } from '@/lib/hooks/useSimpleQuery'
import ProgressBars from '@/components/ProgressBars'
import DeliveryAddress from '@/components/DeliveryAddress'
import { useAuth } from '@/lib/auth'
import { Home, ShoppingBag, Store, Plus, Settings, Heart, Gift } from 'lucide-react'

export default function HomePage() {
  const { data: categories, loading } = useCategoriesSimple()
  const { admin } = useAuth()

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

      {/* Categorias */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando categorias...</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {categories?.map((category) => (
            <Link key={category.id} href={`/categoria/${category.id}`}>
              <Card className="mobile-card hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="mobile-subtitle text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Clique para ver os produtos
                      </p>
                    </div>
                    <ShoppingBag className="w-6 h-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Barras de Progresso */}
      <ProgressBars />

      {/* Endereço de Entrega */}
      <DeliveryAddress />

      {/* Menu de navegação */}
      <div className="space-y-3">
        <Link href="/lojas">
          <Button variant="outline" className="mobile-button w-full">
            <Store className="w-5 h-5 mr-2" />
            Ver Lojas
          </Button>
        </Link>
        
        {admin && (
          <Link href="/cadastro">
            <Button variant="outline" className="mobile-button w-full">
              <Plus className="w-5 h-5 mr-2" />
              Cadastrar Produto
            </Button>
          </Link>
        )}
        
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
