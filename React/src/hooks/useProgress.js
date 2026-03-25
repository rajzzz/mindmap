import { useState, useCallback } from 'react'
import { progKey } from '../data/mindmapData'

export function useProgress(storeKey = 'jsmm_prog_v1') {
  const [prog, setProg] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storeKey) || '{}') }
    catch { return {} }
  })

  // Re-read when storeKey changes (topic switch)
  const [lastKey, setLastKey] = useState(storeKey)
  if (storeKey !== lastKey) {
    setLastKey(storeKey)
    try { setProg(JSON.parse(localStorage.getItem(storeKey) || '{}')) }
    catch { setProg({}) }
  }

  const save = useCallback((next) => {
    localStorage.setItem(storeKey, JSON.stringify(next))
  }, [storeKey])

  const toggle = useCallback((cid, gi, ci) => {
    setProg(prev => {
      const k = progKey(cid, gi, ci)
      const next = { ...prev }
      if (next[k]) delete next[k]; else next[k] = true
      save(next)
      return next
    })
  }, [save])

  const markGroup = useCallback((cat, gi, val) => {
    setProg(prev => {
      const next = { ...prev }
      cat.groups[gi].cs.forEach((_, ci) => {
        const k = progKey(cat.id, gi, ci)
        if (val) next[k] = true; else delete next[k]
      })
      save(next)
      return next
    })
  }, [save])

  const markAllCat = useCallback((cat, val) => {
    setProg(prev => {
      const next = { ...prev }
      cat.groups.forEach((g, gi) =>
        g.cs.forEach((_, ci) => {
          const k = progKey(cat.id, gi, ci)
          if (val) next[k] = true; else delete next[k]
        })
      )
      save(next)
      return next
    })
  }, [save])

  const resetAll = useCallback(() => {
    setProg({})
    save({})
  }, [save])

  const isDone = (cid, gi, ci) => !!prog[progKey(cid, gi, ci)]
  const learnedCount = Object.values(prog).filter(Boolean).length

  return { prog, isDone, toggle, markGroup, markAllCat, resetAll, learnedCount }
}
