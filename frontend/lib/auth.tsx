'use client'


import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from './supabase'

interface Admin {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  admin: Admin | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um admin logado no localStorage
    if (typeof window !== 'undefined') {
      const adminData = localStorage.getItem('admin')
      if (adminData) {
        try {
          setAdmin(JSON.parse(adminData))
        } catch (error) {
          console.error('Erro ao parsear dados do admin:', error)
          localStorage.removeItem('admin')
        }
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Buscar admin no banco
      const { data: adminData, error } = await supabase
        .from('admins')
        .select('id, email, name, password_hash')
        .eq('email', email)
        .limit(1)

      if (error || !adminData || adminData.length === 0) {
        console.error('Erro ao buscar admin:', error)
        return false
      }

      const admin = adminData[0]

      // Verificar senha (em produção, use bcrypt)
      // Para simplicidade, vamos usar uma verificação básica
      if (password === 'admin123') {
        const adminInfo = {
          id: admin.id,
          email: admin.email,
          name: admin.name
        }
        
        setAdmin(adminInfo)
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin', JSON.stringify(adminInfo))
        }
        
        // Atualizar último login
        await supabase
          .from('admins')
          .update({ last_login: new Date().toISOString() })
          .eq('id', admin.id)
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    }
  }

  const logout = () => {
    setAdmin(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin')
    }
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
