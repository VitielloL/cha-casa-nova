'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AdminSidebarContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined)

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  return (
    <AdminSidebarContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      {children}
    </AdminSidebarContext.Provider>
  )
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext)
  if (context === undefined) {
    throw new Error('useAdminSidebar must be used within an AdminSidebarProvider')
  }
  return context
}
