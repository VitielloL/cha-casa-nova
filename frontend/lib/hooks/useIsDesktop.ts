'use client'

import { useState, useEffect } from 'react'

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024) // lg breakpoint
    }

    // Check on mount
    checkIsDesktop()

    // Add event listener
    window.addEventListener('resize', checkIsDesktop)

    // Cleanup
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  return isDesktop
}
