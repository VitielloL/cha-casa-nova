'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="mobile-container">
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="mobile-title text-red-600 mb-2">Ops! Algo deu errado</h1>
        <p className="mobile-text text-gray-600 mb-4">
          Ocorreu um erro inesperado. Tente recarregar a página.
        </p>
        {error && (
          <details className="text-left bg-gray-100 p-4 rounded-lg mb-4">
            <summary className="cursor-pointer font-medium">Detalhes do erro</summary>
            <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
              {error.message}
            </pre>
          </details>
        )}
        <button
          onClick={resetError}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  )
}
