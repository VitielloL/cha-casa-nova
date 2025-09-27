'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase, PartyOwner } from '@/lib/supabase'
import ImageDisplay from '@/components/ImageDisplay'
import DeliveryAddress from '@/components/DeliveryAddress'
import { ArrowLeft, Heart, Users, Home } from 'lucide-react'

export default function SobreNosPage() {
  const [owners, setOwners] = useState<PartyOwner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPartyOwners()
  }, [])

  const fetchPartyOwners = async () => {
    try {
      const { data, error } = await supabase
        .from('party_owners')
        .select(`
          *,
          photo:images(*)
        `)
        .order('order_index', { ascending: true })

      if (error) throw error
      setOwners(data || [])
    } catch (error) {
      console.error('Erro ao carregar donos da festa:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="mobile-title text-gray-900 flex items-center">
            <Heart className="w-6 h-6 mr-2 text-pink-600" />
            Sobre os Anfitriões
          </h1>
          <p className="text-sm text-gray-500">
            Conheça quem está organizando esta celebração especial
          </p>
        </div>
      </div>

      {/* Donos da festa */}
      <div className="space-y-6 mb-8">
        {owners.map((owner) => (
          <Card key={owner.id} className="mobile-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                {/* Foto */}
                <div className="flex-shrink-0">
                  {owner.photo_id ? (
                    <ImageDisplay
                      imageId={owner.photo_id}
                      alt={owner.name}
                      className="w-32 h-32 object-cover rounded-full border-4 border-pink-200"
                      fallbackClassName="w-32 h-32 bg-pink-100 rounded-full border-4 border-pink-200 flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-pink-100 rounded-full border-4 border-pink-200 flex items-center justify-center">
                      <Users className="w-16 h-16 text-pink-400" />
                    </div>
                  )}
                </div>

                {/* Informações */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="mobile-subtitle text-gray-900 mb-2">
                    {owner.name}
                  </h2>
                  
                  {owner.relationship && (
                    <div className="inline-flex items-center space-x-1 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                      <Heart className="w-4 h-4" />
                      <span>{owner.relationship}</span>
                    </div>
                  )}

                  {owner.bio && (
                    <p className="text-gray-700 leading-relaxed">
                      {owner.bio}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Endereço de entrega */}
      <DeliveryAddress />

      {/* Botão para voltar */}
      <div className="text-center">
        <Link href="/">
          <Button className="mobile-button bg-pink-500 hover:bg-pink-600">
            <Home className="w-5 h-5 mr-2" />
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  )
}
