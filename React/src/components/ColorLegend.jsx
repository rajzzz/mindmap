import { pal } from '../data/mindmapData'

export default function ColorLegend({ active, onSelect, cats = [] }) {
  return (
    <div className="px-6 pt-2 flex flex-wrap gap-1.5">
      {cats.map(c => {
        const P = pal[c.p]
        const isActive = active === c.id
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: P.s }} />
            {c.name}
          </button>
        )
      })}
    </div>
  )
}
