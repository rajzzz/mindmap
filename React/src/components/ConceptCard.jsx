const DELAYS = ['animate-fade-up', 'animate-fade-up-2', 'animate-fade-up-3', 'animate-fade-up-4', 'animate-fade-up-5', 'animate-fade-up-n']

export default function ConceptCard({ g, gi, cat, P, isDone, toggle, markGroup, highlight, index }) {
  const gTotal = g.cs.length
  const gLearned = g.cs.filter((_, ci) => isDone(cat.id, gi, ci)).length
  const allDone = gLearned === gTotal
  const delay = DELAYS[Math.min(index, DELAYS.length - 1)]

  return (
    <div
      className={`rounded-xl p-3 border ${delay}`}
      style={{ background: P.b, borderColor: `${P.s}33` }}
    >
      {/* Group header */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm leading-none">{g.icon || '📌'}</span>
        <span
          className="text-[10px] font-semibold tracking-widest uppercase flex-1 truncate"
          style={{ color: P.t }}
        >
          {g.n}
        </span>
        <button
          onClick={() => markGroup(cat, gi, !allDone)}
          className="text-[10px] px-1.5 py-0.5 rounded border-none cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
          style={{ background: P.f, color: P.t }}
        >
          {allDone ? '↩' : '✓'}
        </button>
      </div>

      {/* Concepts */}
      {g.cs.map((c, ci) => {
        const done = isDone(cat.id, gi, ci)
        return (
          <div
            key={ci}
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
              {highlight ? highlight(c) : c}
            </span>
          </div>
        )
      })}
    </div>
  )
}
