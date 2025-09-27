'use client'

import { AdminSidebarProvider } from '@/lib/AdminSidebarContext'
import { AdminDataProvider } from '@/lib/AdminDataContext'

interface AdminProviderProps {
  children: React.ReactNode
}

export default function AdminProvider({ children }: AdminProviderProps) {
  return (
    <AdminSidebarProvider>
      <AdminDataProvider>
        {children}
      </AdminDataProvider>
    </AdminSidebarProvider>
  )
}
