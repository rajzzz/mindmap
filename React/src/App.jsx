import { useState, useCallback } from 'react'
import { cats as jsCats, totalConcepts as jsTotalConcepts, pal } from './data/mindmapData'
import { reactCats } from './data/reactData'
import { nextCats } from './data/nextData'
import { aiCats } from './data/aiData'
import { useProgress } from './hooks/useProgress'
import { useSearch } from './hooks/useSearch'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import MindmapSVG from './components/MindmapSVG'
import DetailPanel from './components/DetailPanel'
import SearchBar from './components/SearchBar'
import ColorLegend from './components/ColorLegend'
import SearchResults from './components/SearchResults'

const TOPICS = [
  { id: 'js',   label: 'JavaScript', badge: 'ES2024',    cats: jsCats,    color: '#F7DF1E', textColor: '#1a1200' },
  { id: 'react', label: 'React',     badge: 'v18 / v19', cats: reactCats, color: '#61DAFB', textColor: '#1a2a30' },
  { id: 'next',  label: 'Next.js',   badge: '14 / 15',   cats: nextCats,  color: '#ffffff', textColor: '#1a1a18' },
  { id: 'ai',    label: 'AI Eng',    badge: '2026',      cats: aiCats,    color: '#a855f7', textColor: '#ffffff' },
]

// Each topic gets its own isolated progress store key
const STORE_KEYS = { js: 'jsmm_prog_v1', react: 'reactmm_prog_v1', next: 'nextmm_prog_v1', ai: 'aimm_prog_v1' }

export default function App() {
  const [topic, setTopic] = useState('js')
  const [active, setActive] = useState(null)

  const currentTopic = TOPICS.find(t => t.id === topic)
  const cats = currentTopic.cats
  const total = cats.reduce((a, c) => a + c.groups.reduce((b, g) => b + g.cs.length, 0), 0)

  const { prog, isDone, toggle, markGroup, markAllCat, resetAll, learnedCount } = useProgress(STORE_KEYS[topic])
  const { query, setQuery, clearSearch, results, matchCount, highlight } = useSearch(cats)
  useKeyboardNav(active, setActive)

  const activeCat = active ? cats.find(c => c.id === active) : null
  const pct = total ? Math.round(learnedCount / total * 100) : 0

  const handleSelect = useCallback((id) => {
    setActive(prev => prev === id ? null : id)
    if (query) clearSearch()
  }, [query, clearSearch])

  const switchTopic = (id) => {
    setTopic(id)
    setActive(null)
    clearSearch()
  }

  const exportProg = () => {
    const data = { topic, exported: new Date().toISOString(), learnedCount, totalCount: total, progress: prog }
    const a = document.createElement('a')
    a.href = 'data:application/json,' + encodeURIComponent(JSON.stringify(data, null, 2))
    a.download = `${topic}_mindmap_progress.json`
    a.click()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#181817] text-gray-900 dark:text-gray-100 font-sans pb-10">

      {/* Topic Switcher */}
      <div className="flex items-center gap-2 px-6 pt-5 pb-1 border-b border-gray-100 dark:border-gray-800">
        {TOPICS.map(t => (
          <button
            key={t.id}
            onClick={() => switchTopic(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              topic === t.id
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t.label}
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
              style={{ background: t.color, color: t.textColor }}
            >
              {t.badge}
            </span>
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2 min-w-40">
          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#534AB7 0%,#5DCAA5 100%)' }}
            />
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">{learnedCount} / {total} ({pct}%)</span>
        </div>
        <button onClick={exportProg} className="text-xs px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">↓ Export</button>
        <button onClick={() => { if (confirm('Reset all progress for this topic?')) resetAll() }} className="text-xs px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">↺ Reset</button>
      </div>

      {/* Search */}
      <SearchBar query={query} setQuery={setQuery} clearSearch={clearSearch} matchCount={matchCount} />

      {/* Legend */}
      <ColorLegend active={active} onSelect={handleSelect} cats={cats} />

      {/* SVG Mindmap */}
      <div className="px-6 pt-2">
        <MindmapSVG active={active} onSelect={handleSelect} prog={prog} cats={cats} topicLabel={currentTopic.label} />
      </div>

      {/* Detail or search results */}
      {query.trim() ? (
        <SearchResults results={results} isDone={isDone} toggle={toggle} highlight={highlight} />
      ) : (
        <DetailPanel cat={activeCat} isDone={isDone} toggle={toggle} markGroup={markGroup} markAllCat={markAllCat} highlight={highlight} />
      )}
    </div>
  )
}
