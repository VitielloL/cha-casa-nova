'use client'

import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Loading component otimizado
function FastLoader({ text = 'Carregando...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  )
}

// Lazy loading de componentes pesados
export const LazyProgressBars = lazy(() => import('@/components/ProgressBars'))
export const LazyDeliveryAddress = lazy(() => import('@/components/DeliveryAddress'))
export const LazyImageDisplay = lazy(() => import('@/components/ImageDisplay'))
export const LazyProductPurchaseMethods = lazy(() => import('@/components/ProductPurchaseMethods'))
export const LazyReservationModal = lazy(() => import('@/components/ReservationModal'))

// Wrappers com Suspense
export function ProgressBarsWrapper() {
  return (
    <Suspense fallback={<FastLoader text="Carregando progresso..." />}>
      <LazyProgressBars />
    </Suspense>
  )
}

export function DeliveryAddressWrapper() {
  return (
    <Suspense fallback={<FastLoader text="Carregando endereço..." />}>
      <LazyDeliveryAddress />
    </Suspense>
  )
}

export function ImageDisplayWrapper(props: any) {
  return (
    <Suspense fallback={<FastLoader text="Carregando imagem..." />}>
      <LazyImageDisplay {...props} />
    </Suspense>
  )
}

export function ProductPurchaseMethodsWrapper(props: any) {
  return (
    <Suspense fallback={<FastLoader text="Carregando métodos de compra..." />}>
      <LazyProductPurchaseMethods {...props} />
    </Suspense>
  )
}

export function ReservationModalWrapper(props: any) {
  return (
    <Suspense fallback={<FastLoader text="Carregando modal..." />}>
      <LazyReservationModal {...props} />
    </Suspense>
  )
}
