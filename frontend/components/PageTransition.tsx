'use client'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="h-full">
      {children}
    </div>
  )
}
