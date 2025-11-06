'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useInstantCategories } from '@/lib/hooks/useInstantData'
import { useCategoriesSimple } from '@/lib/hooks/useSimpleQuery'
import DeliveryAddressBlur from '@/components/DeliveryAddressBlur'
import ProgressBarsBlur from '@/components/ProgressBarsBlur'
import { useAuth } from '@/lib/auth'
import ResponsiveGrid, { ResponsiveButton } from '@/components/ResponsiveGrid'
import BlurLoading from '@/components/BlurLoading'
import CategoryModal from '@/components/CategoryModal'
import { useIsDesktop } from '@/lib/hooks/useIsDesktop'
import { Home, ShoppingBag, Store, Plus, Settings, Heart, Gift, Package, ShoppingCart } from 'lucide-react'

export default function HomePage() {
  
  const { data: categories, loading } = useCategoriesSimple()
  const { admin } = useAuth()
  const isDesktop = useIsDesktop()
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string, description?: string} | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)


  const handleCategoryClick = (category: {id: string, name: string, description?: string}) => {
    if (isDesktop) {
      setSelectedCategory(category)
      setIsModalOpen(true)
    }
    // No mobile, o Link vai funcionar normalmente
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="text-center mb-8 lg:mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-blue-100 rounded-full mb-4 lg:mb-6">
          <Home className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
        </div>
        <h1 className="mobile-title text-gray-900 mb-2 lg:mb-4">Lista de Presentes</h1>
        <p className="mobile-text text-gray-600 max-w-2xl mx-auto">
          Escolha uma categoria para ver os produtos disponíveis
        </p>
      </div>

      {/* Categorias */}
      <ResponsiveGrid className="mb-8">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando categorias...</p>
          </div>
        ) : (categories?.length ?? 0) > 0 ? (
          categories!.map((category) => (
          <div key={category.id}>
            {isDesktop ? (
              <Card 
                className="mobile-card hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="mobile-subtitle text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Clique para ver os produtos
                    </p>
                  </div>
                  <ShoppingBag className="w-6 h-6 text-blue-500" />
                </CardContent>
              </Card>
            ) : (
              <Link href={`/categoria/${category.id}`}>
                <Card className="mobile-card hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="mobile-subtitle text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Clique para ver os produtos
                      </p>
                    </div>
                    <ShoppingBag className="w-6 h-6 text-blue-500" />
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">Nenhuma categoria encontrada.</p>
            <p className="text-sm text-gray-500 mt-2">
              Verifique se o banco de dados está configurado corretamente.
            </p>
          </div>
        )}
      </ResponsiveGrid>

      {/* Barras de Progresso com Blur Loading */}
      <ProgressBarsBlur />

      {/* Endereço de Entrega com Blur Loading */}
      <DeliveryAddressBlur />

      {/* Menu de navegação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-8 max-w-4xl mx-auto">
        <ResponsiveButton 
          href="/lojas" 
          variant="outline"
          icon={<Store className="w-5 h-5 lg:w-6 lg:h-6" />}
          className="hover:bg-blue-50 hover:border-blue-200 group-hover:text-blue-600"
        >
          Ver Lojas
        </ResponsiveButton>
        
        {admin && (
          <ResponsiveButton 
            href="/cadastro" 
            variant="outline"
            icon={<Plus className="w-5 h-5 lg:w-6 lg:h-6" />}
            className="hover:bg-orange-50 hover:border-orange-200 group-hover:text-orange-600"
          >
            Cadastrar Produto
          </ResponsiveButton>
        )}
        
        <ResponsiveButton 
          href="/item-surpresa" 
          variant="outline"
          icon={<Gift className="w-5 h-5 lg:w-6 lg:h-6" />}
          className="hover:bg-purple-50 hover:border-purple-200 group-hover:text-purple-600"
        >
          Enviar Item Surpresa
        </ResponsiveButton>
        
        <ResponsiveButton 
          href="/reservar-item-comum" 
          variant="outline"
          icon={<ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />}
          className="hover:bg-orange-50 hover:border-orange-200 group-hover:text-orange-600"
        >
          Reservar Item Comum
        </ResponsiveButton>
        
        <ResponsiveButton 
          href="/itens-surpresa" 
          variant="outline"
          icon={<Package className="w-5 h-5 lg:w-6 lg:h-6" />}
          className="hover:bg-green-50 hover:border-green-200 group-hover:text-green-600"
        >
          Ver Itens Surpresa
        </ResponsiveButton>
        
        <ResponsiveButton 
          href="/sobre-nos" 
          variant="outline"
          icon={<Heart className="w-5 h-5 lg:w-6 lg:h-6" />}
          className="hover:bg-blue-50 hover:border-blue-200 group-hover:text-blue-600"
        >
          Sobre Nós
        </ResponsiveButton>
        
        <ResponsiveButton 
          href="/login" 
          variant="outline"
          icon={<Settings className="w-5 h-5 lg:w-6 lg:h-6" />}
          className="hover:bg-gray-50 hover:border-gray-300 group-hover:text-gray-600 sm:col-span-2 lg:col-span-2 xl:col-span-1"
        >
          Login Admin
        </ResponsiveButton>
      </div>

      {/* Footer para desktop */}
      <div className="hidden lg:block mt-16 pt-8 border-t border-gray-200">
        <div className="text-center text-gray-500">
          <p className="text-sm">
            Lista de presentes para os anfitriões da celebração
          </p>
        </div>
      </div>

      {/* Modal de Categoria para Desktop */}
      <CategoryModal
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
