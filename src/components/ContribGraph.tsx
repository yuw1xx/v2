import { useEffect, useState, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

const GH_USER = 'yuw1xx'

interface Day { count: number; date: string }

async function fetchContribSVG(username: string): Promise<Day[]> {
  const res = await fetch(`https://ghchart.rshah.org/${username}`)
  const text = await res.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'image/svg+xml')
  const rects = Array.from(doc.querySelectorAll('rect[data-count]'))
  return rects.map(r => ({
    count: parseInt(r.getAttribute('data-count') || '0', 10),
    date:  r.getAttribute('data-date') || '',
  }))
}

function cellColor(count: number): string {
  if (count === 0)  return '#1a1a1e'
  if (count <= 2)   return 'rgba(99,102,241,0.30)'
  if (count <= 5)   return 'rgba(99,102,241,0.55)'
  if (count <= 10)  return 'rgba(99,102,241,0.78)'
  return '#6366f1'
}

const DAY_LABELS  = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function ContribGraph() {
  const [days,    setDays]    = useState<Day[]>([])
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const revealRef = useReveal()
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  useEffect(() => {
    fetchContribSVG(GH_USER)
      .then(d => {
        setDays(d)
        setTotal(d.reduce((s, x) => s + x.count, 0))
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  // Group flat day list into weeks (7 days each)
  const weeks: Day[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const monthLabels: (string | null)[] = weeks.map(wk => {
    if (!wk[0]?.date) return null
    const d = new Date(wk[0].date)
    return d.getDate() <= 7 ? MONTH_NAMES[d.getMonth()] : null
  })

  return (
    <section ref={revealRef} className="reveal" style={{ maxWidth: 680, margin: '0 auto', paddingBottom: 'clamp(4rem,8vw,6rem)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <div>
          <SectionLabel>Contributions</SectionLabel>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>
            {loading ? '...' : error ? 'Could not load.' : `${total.toLocaleString()} contributions in the last year`}
          </p>
        </div>
        <a
          href={`https://github.com/${GH_USER}`}
          target="_blank" rel="noopener noreferrer"
          data-hover="true"
          style={{ fontSize: 12, color: 'var(--text-3)', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >
          github/{GH_USER} ↗
        </a>
      </div>

      {loading && (
        <div style={{ height: 112, borderRadius: 8, background: 'var(--bg-card)', opacity: 0.5 }} />
      )}

      {error && !loading && (
        <p style={{ color: 'var(--text-3)', fontSize: 13, fontStyle: 'italic' }}>
          Contribution data unavailable.
        </p>
      )}

      {!loading && !error && weeks.length > 0 && (
        <div ref={containerRef} style={{ overflowX: 'auto', paddingBottom: 6, position: 'relative' }}>
          <div style={{ display: 'flex', gap: 3, minWidth: 'max-content' }}>
            {/* Day-of-week labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 20, marginRight: 4, flexShrink: 0 }}>
              {DAY_LABELS.map((label, i) => (
                <div key={i} style={{
                  height: 11, lineHeight: '11px',
                  fontSize: 9, color: 'var(--text-3)', fontFamily: 'var(--mono)',
                }}>
                  {label}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Month row */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 6, height: 14 }}>
                {weeks.map((_, wi) => (
                  <div key={wi} style={{
                    width: 11, fontSize: 9, color: 'var(--text-3)',
                    fontFamily: 'var(--mono)', lineHeight: '14px',
                    flexShrink: 0, overflow: 'visible', whiteSpace: 'nowrap',
                  }}>
                    {monthLabels[wi] ?? ''}
                  </div>
                ))}
              </div>

              {/* Cell grid */}
              <div style={{ display: 'flex', gap: 3 }}>
                {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {week.map((day, di) => (
                      <div
                        key={di}
                        onMouseEnter={e => {
                          const rect   = e.currentTarget.getBoundingClientRect()
                          const parent = containerRef.current?.getBoundingClientRect()
                          setTooltip({
                            text: `${day.date} · ${day.count} contribution${day.count !== 1 ? 's' : ''}`,
                            x: rect.left - (parent?.left ?? 0) + 5,
                            y: rect.top  - (parent?.top  ?? 0) - 30,
                          })
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          width: 11, height: 11, borderRadius: 2,
                          background: cellColor(day.count),
                          transition: `background 0.3s ease ${wi * 0.004}s`,
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {tooltip && (
            <div style={{
              position: 'absolute', left: tooltip.x, top: tooltip.y,
              background: 'var(--bg-raised)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '4px 9px',
              fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--mono)',
              pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 10,
            }}>
              {tooltip.text}
            </div>
          )}

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>Less</span>
            {[0, 2, 5, 10, 15].map(v => (
              <div key={v} style={{ width: 11, height: 11, borderRadius: 2, background: cellColor(v) }} />
            ))}
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>More</span>
          </div>
        </div>
      )}
    </section>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{
      fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
      color: 'var(--text-3)', fontFamily: 'var(--mono)', marginBottom: 2,
    }}>
      {children}
    </p>
  )
}
