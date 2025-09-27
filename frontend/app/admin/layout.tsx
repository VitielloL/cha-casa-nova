'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { useAdminSidebar } from '@/lib/AdminSidebarContext'
import AdminProvider from './AdminProvider'
import { useMemo } from 'react'
import './transitions.css'
import { 
  ShoppingCart, 
  Tag, 
  Clock, 
  Users, 
  Package, 
  Gift, 
  Settings, 
  Image, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { admin, logout } = useAuth()
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useAdminSidebar()

  const navigationItems = [
    { href: '/admin', label: 'Dashboard', icon: Menu },
    { href: '/admin/produtos', label: 'Gerenciar Produtos', icon: ShoppingCart },
    { href: '/admin/categorias', label: 'Gerenciar Categorias', icon: Tag },
    { href: '/admin/reservas', label: 'Gerenciar Reservas', icon: Clock },
    { href: '/admin/donos', label: 'Anfitriões da Festa', icon: Users },
    { href: '/admin/produtos-meios', label: 'Meios de Compra', icon: Package },
    { href: '/admin/itens-surpresa', label: 'Itens Surpresa', icon: Gift },
    { href: '/admin/configuracoes', label: 'Configurações WhatsApp', icon: Settings },
    { href: '/admin/imagens', label: 'Gerenciar Imagens', icon: Image },
  ]

  const isActive = useMemo(() => (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }, [pathname])

  return (
    <div className="h-screen flex flex-col bg-gray-50 admin-layout">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b flex-shrink-0">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Painel Admin</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-red-600 hover:text-red-700 p-2"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between p-6 border-b flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Painel Admin</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${active 
                        ? 'bg-pink-100 text-pink-700 border-r-2 border-pink-500' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t bg-gray-50 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-pink-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {admin?.username || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AdminProvider>
  )
}