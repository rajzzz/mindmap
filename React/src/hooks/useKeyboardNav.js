import { useEffect } from 'react'
import { cats } from '../data/mindmapData'

export function useKeyboardNav(active, setActive) {
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return
      if (e.key === 'Escape') { setActive(null); return }
      const n = parseInt(e.key)
      if (n >= 1 && n <= cats.length) {
        const id = cats[n - 1].id
        setActive(prev => prev === id ? null : id)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setActive])
}
