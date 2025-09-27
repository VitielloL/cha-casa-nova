import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './fonts.css'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import ErrorBoundary from '@/components/ErrorBoundary'
import RoutePrefetcher from '@/components/RoutePrefetcher'
import FastRouteTransition from '@/components/FastRouteTransition'
import ReservationPanel from '@/components/ReservationPanel'
import CopyrightProtection from '@/lib/protection'

// © 2025 Gabriel Vilela - Propriedade exclusiva - Licença: R$ 1.000.000,00

// Importar marca d'água de proteção
if (typeof window !== 'undefined') {
  import('@/lib/watermark.js');
  import('@/lib/copyright');
  import('@/lib/global-watermark.js');
  import('@/lib/watermark-config.js');
  import('@/lib/watermark-utils.js');
}

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: 'Lista de Presentes',
  description: 'Lista de presentes para os anfitriões da celebração',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="min-h-screen flex flex-col">
                <main className="flex-1">
                  <RoutePrefetcher />
                  <FastRouteTransition>
                    {children}
                  </FastRouteTransition>
                  <ReservationPanel />
                  <CopyrightProtection />
                </main>
              </div>
            </div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
