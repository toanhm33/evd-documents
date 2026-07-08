import { useEffect } from 'react'

export function useEscapeKey(onEscape: (() => void) | null) {
  useEffect(() => {
    if (!onEscape) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onEscape])
}
