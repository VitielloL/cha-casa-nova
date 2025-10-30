import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kednlctmkudawyguyekw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZG5sY3Rta3VkYXd5Z3V5ZWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTQ2NDMsImV4cCI6MjA3NDQ5MDY0M30.vFgWkbMU-5p8hXSZEcX4hr5lVbHv5J37nzLDJqoIQUU'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas
export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Store {
  id: string
  name: string
  address?: string
  link?: string
  created_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  description?: string
  image_id?: string | null
  image_url?: string // Mantido para compatibilidade
  store_link?: string
  store_address?: string
  reserved: boolean
  reserved_by?: string | null
  reserved_contact?: string | null
  is_anonymous: boolean
  reservation_status: 'available' | 'reserved' | 'received' | 'cancelled'
  item_type: 'principal' | 'adicional'
  received_at?: string | null
  cancelled_at?: string | null
  reservation_message?: string
  reservation_image_id?: string | null
  created_at: string
  category?: Category
  purchase_methods?: ProductPurchaseMethod[]
}

export interface Image {
  id: string
  filename: string
  original_name: string
  mime_type: string
  size_bytes: number
  width?: number
  height?: number
  image_data: Uint8Array
  thumbnail_data?: Uint8Array
  created_at: string
  updated_at: string
}

export interface PartyOwner {
  id: string
  name: string
  photo_id?: string
  bio?: string
  relationship?: string
  order_index: number
  created_at: string
  updated_at: string
  photo?: Image
}

export interface DeliveryAddress {
  id: string
  title: string
  address: string
  instructions?: string
  contact_phone?: string
  contact_name?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FeaturedPurchaseMethod {
  id: string
  name: string
  description?: string
  link: string
  is_affiliate: boolean
  affiliate_commission?: string
  icon?: string
  color: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductPurchaseMethod {
  id: string
  product_id: string
  name: string
  type: 'link' | 'address' | 'photo' | 'text' | 'phone' | 'email'
  content: string
  description?: string
  icon?: string
  color: string
  is_primary: boolean
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SurpriseItem {
  id: string
  name: string
  description?: string
  category?: string
  is_anonymous: boolean
  reserved_by?: string
  reserved_contact?: string
  reservation_status: 'available' | 'reserved' | 'received' | 'cancelled'
  item_type: 'principal' | 'adicional'
  is_visible: boolean
  admin_notes?: string
  received_at?: string
  cancelled_at?: string
  created_at: string
  updated_at: string
}
