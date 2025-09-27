'use client'

import { ReactNode } from 'react'

interface ResponsiveGridProps {
  children: ReactNode
  className?: string
}

export default function ResponsiveGrid({ children, className = '' }: ResponsiveGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 ${className}`}>
      {children}
    </div>
  )
}

// Componente para cards responsivos
interface ResponsiveCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function ResponsiveCard({ children, className = '', hover = true }: ResponsiveCardProps) {
  return (
    <div className={`
      mobile-card p-4 lg:p-6
      ${hover ? 'hover:shadow-lg hover:scale-105' : ''}
      transition-all duration-200 ease-in-out
      ${className}
    `}>
      {children}
    </div>
  )
}

// Componente para botões responsivos
interface ResponsiveButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  className?: string
  icon?: ReactNode
}

export function ResponsiveButton({ 
  children, 
  href, 
  onClick, 
  variant = 'outline', 
  className = '',
  icon 
}: ResponsiveButtonProps) {
  const baseClasses = `
    mobile-button group flex items-center justify-center
    ${variant === 'primary' ? 'bg-pink-600 hover:bg-pink-700 text-white' : ''}
    ${variant === 'secondary' ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : ''}
    ${variant === 'outline' ? 'border-2 hover:border-pink-300 hover:bg-pink-50' : ''}
    transition-all duration-200 ease-in-out
    ${className}
  `

  const content = (
    <>
      {icon && <span className="mr-2 group-hover:scale-110 transition-transform duration-200">{icon}</span>}
      <span>{children}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  )
}
