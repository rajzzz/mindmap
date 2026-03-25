import { pal } from '../data/mindmapData'

export default function SearchResults({ results, isDone, toggle, highlight }) {
  if (!results.length) return null

  // Group results by category
  const grouped = {}
  results.forEach(({ c, ci, gi, cat, g }) => {
    if (!grouped[cat.id]) grouped[cat.id] = { cat, items: [] }
    grouped[cat.id].items.push({ c, ci, gi, g })
  })

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 mt-1 px-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-2.5 py-4">
        {Object.values(grouped).map(({ cat, items }) => {
          const P = pal[cat.p]
          return (
            <div
              key={cat.id}
              className="rounded-xl p-3 border animate-fade-up"
              style={{ background: P.b, borderColor: `${P.s}33` }}
            >
              <div className="mb-2">
                <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: P.t }}>
                  {cat.name}
                </span>
              </div>
              {items.map(({ c, ci, gi }) => {
                const done = isDone(cat.id, gi, ci)
                return (
                  <div
                    key={`${gi}-${ci}`}
                    onClick={() => toggle(cat.id, gi, ci)}
                    className={`flex items-start gap-1.5 py-[3px] text-xs leading-snug cursor-pointer border-b last:border-b-0 hover:opacity-70 transition-opacity ${done ? 'concept-done' : ''}`}
                    style={{ borderColor: `${P.s}22` }}
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggle(cat.id, gi, ci)}
                      onClick={e => e.stopPropagation()}
                      className="mt-0.5 flex-shrink-0 w-3 h-3 cursor-pointer"
                      style={{ accentColor: P.s }}
                    />
                    <span className="concept-text" style={{ color: P.t }}>
                      {highlight(c)}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
