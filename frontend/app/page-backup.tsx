'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCategoriesSimple } from '@/lib/hooks/useSimpleQuery'
import ProgressBars from '@/components/ProgressBars'
import DeliveryAddress from '@/components/DeliveryAddress'
import StableLoading from '@/components/StableLoading'
import { useAuth } from '@/lib/auth'
import { 
  Home, 
  ShoppingBag, 
  Store, 
  Plus, 
  Settings, 
  Heart, 
  Gift 
} from 'lucide-react'

export default function HomePage() {
  const { admin } = useAuth()
  const { data: categories, loading } = useCategoriesSimple()

  return (
    <StableLoading loading={loading}>
      <div className="mobile-container">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
            <Home className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="mobile-title text-gray-900 mb-2">Lista de Presentes</h1>
          <p className="mobile-text text-gray-600">
            Escolha uma categoria para ver os produtos disponíveis
          </p>
        </div>


        {/* Barras de Progresso */}
        <ProgressBars />

        {/* Endereço de Entrega */}
        <DeliveryAddress />

        {/* Categorias */}
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
                    <ShoppingBag className="w-6 h-6 text-pink-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

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
    </StableLoading>
  )
}
