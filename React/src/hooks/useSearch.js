import { useState, useCallback } from 'react'

export function useSearch(cats = []) {
  const [query, setQuery] = useState('')

  const clearSearch = useCallback(() => setQuery(''), [])

  const results = query.trim()
    ? cats.flatMap(cat =>
        cat.groups.flatMap((g, gi) => {
          const hits = g.cs
            .map((c, ci) => ({ c, ci, gi, cat, g }))
            .filter(({ c }) => c.toLowerCase().includes(query.trim().toLowerCase()))
          return hits
        })
      )
    : []

  const matchCount = results.length

  const highlight = (text) => {
    if (!query.trim()) return text
    const re = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(re)
    return parts.map((part, i) =>
      re.test(part)
        ? <mark key={i} className="search-hi">{part}</mark>
        : part
    )
  }

  return { query, setQuery, clearSearch, results, matchCount, highlight }
}

