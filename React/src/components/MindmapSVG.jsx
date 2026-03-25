import { pal } from '../data/mindmapData'

const CX = 340, CY = 265, RAD = 188, NW = 120, NH = 36

function toRad(d) { return d * Math.PI / 180 }

function bezierPath(x1, y1, x2, y2) {
  const cx1 = x1 + (x2 - x1) * 0.3
  const cy1 = y1 + (y2 - y1) * 0.3
  const cx2 = x1 + (x2 - x1) * 0.7
  const cy2 = y1 + (y2 - y1) * 0.7
  return `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`
}

export default function MindmapSVG({ active, onSelect, prog, cats = [], topicLabel = 'JavaScript' }) {
  const dk = window.matchMedia('(prefers-color-scheme:dark)').matches
  const cf = dk ? '#CECBF6' : '#2C2C2A'
  const ct = dk ? '#1a1a18' : '#ffffff'

  return (
    <svg
      id="mm"
      viewBox="0 0 680 520"
      className="block w-full max-w-[700px] mx-auto overflow-visible"
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connection lines */}
      {cats.map(c => {
        const x = CX + RAD * Math.cos(toRad(c.angle))
        const y = CY + RAD * Math.sin(toRad(c.angle))
        const P = pal[c.p]
        const act = active === c.id
        return (
          <path
            key={`line-${c.id}`}
            d={bezierPath(CX, CY, x, y)}
            fill="none"
            stroke={P.s}
            strokeWidth={act ? 2 : 0.8}
            opacity={act ? 0.75 : 0.28}
            strokeDasharray={act ? 'none' : '4,3'}
          />
        )
      })}

      {/* Category progress arcs */}
      {cats.map(c => {
        const total = c.groups.reduce((a, g) => a + g.cs.length, 0)
        const learned = c.groups.reduce((a, g, gi) =>
          a + g.cs.filter((_, ci) => !!prog[`${c.id}:${gi}:${ci}`]).length, 0)
        const pct = total ? learned / total : 0
        if (!pct) return null
        const x = CX + RAD * Math.cos(toRad(c.angle))
        const y = CY + RAD * Math.sin(toRad(c.angle))
        const P = pal[c.p]
        const r = NH / 2 + 3
        const startA = toRad(-90)
        const endA = startA + 2 * Math.PI * pct
        const sx = x + r * Math.cos(startA), sy = y + r * Math.sin(startA)
        const ex = x + r * Math.cos(endA), ey = y + r * Math.sin(endA)
        const laf = pct > 0.5 ? 1 : 0
        return (
          <path
            key={`arc-${c.id}`}
            d={`M${sx},${sy} A${r},${r} 0 ${laf} 1 ${ex},${ey}`}
            fill="none"
            stroke={P.s}
            strokeWidth="2.5"
            opacity="0.7"
            strokeLinecap="round"
          />
        )
      })}

      {/* Category nodes */}
      {cats.map(c => {
        const x = CX + RAD * Math.cos(toRad(c.angle))
        const y = CY + RAD * Math.sin(toRad(c.angle))
        const P = pal[c.p]
        const act = active === c.id
        return (
          <g key={c.id} className="cat-node cursor-pointer" onClick={() => onSelect(c.id)}>
            <rect
              className="cat-node-rect"
              x={x - NW / 2} y={y - NH / 2}
              width={NW} height={NH}
              rx={NH / 2}
              fill={P.f} stroke={P.s}
              strokeWidth={act ? 2.5 : 1.5}
              filter={act ? 'url(#glow)' : undefined}
            />
            <text
              x={x} y={y}
              textAnchor="middle" dominantBaseline="central"
              fill={P.t} fontSize="11.5" fontWeight="500"
              fontFamily="Inter,sans-serif"
            >
              {c.name}
            </text>
          </g>
        )
      })}

      {/* Center node */}
      <g>
        <rect
          x={CX - 60} y={CY - 20}
          width={120} height={40} rx={20}
          fill={cf}
        />
        <text
          x={CX} y={CY}
          textAnchor="middle" dominantBaseline="central"
          fill={ct} fontSize="14" fontWeight="600"
          fontFamily="Inter,sans-serif"
        >
          {topicLabel}
        </text>
      </g>
    </svg>
  )
}
