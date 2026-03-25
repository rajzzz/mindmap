import ConceptCard from './ConceptCard'
import { pal } from '../data/mindmapData'

export default function DetailPanel({ cat, isDone, toggle, markGroup, markAllCat, highlight }) {
  if (!cat) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 mt-1 px-6">
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 my-6">
          Click any node to explore its concepts &nbsp;·&nbsp;{' '}
          <kbd className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 text-xs">1</kbd>–
          <kbd className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 text-xs">9</kbd>{' '}
          select category &nbsp;·&nbsp;{' '}
          <kbd className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 text-xs">Esc</kbd> close
        </p>
      </div>
    )
  }

  const P = pal[cat.p]
  const total = cat.groups.reduce((a, g) => a + g.cs.length, 0)
  const learned = cat.groups.reduce((a, g, gi) =>
    a + g.cs.filter((_, ci) => isDone(cat.id, gi, ci)).length, 0)
  const pct = total ? Math.round(learned / total * 100) : 0

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 mt-1 px-6">
      {/* Header */}
      <div className="flex items-baseline gap-3 flex-wrap pt-4 pb-2">
        <span className="text-base font-medium text-gray-900 dark:text-gray-100">{cat.name}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {cat.groups.length} groups · {total} concepts
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: P.s }}
          />
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
          {learned} / {total} learned
        </span>
        <button
          onClick={() => markAllCat(cat, true)}
          className="text-xs px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Mark all ✓
        </button>
        <button
          onClick={() => markAllCat(cat, false)}
          className="text-xs px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-2.5 pb-5">
        {cat.groups.map((g, gi) => (
          <ConceptCard
            key={gi}
            g={g} gi={gi} cat={cat} P={P}
            isDone={isDone}
            toggle={toggle}
            markGroup={markGroup}
            highlight={highlight}
            index={gi}
          />
        ))}
      </div>
    </div>
  )
}
