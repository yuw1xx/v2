import { useEffect, useRef } from 'react'

const TRAIL_LENGTH = 14    // number of trail dots
const TRAIL_DELAY  = 0.08  // lerp factor per dot (smaller = longer lag)

export default function Cursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot   = dotRef.current!
    const trail = trailRef.current!

    // Each trail particle: [x, y, el]
    const particles = Array.from(trail.children) as HTMLDivElement[]

    // Positions array — index 0 is freshest (closest to cursor)
    const positions: { x: number; y: number }[] = particles.map(() => ({ x: -100, y: -100 }))

    let mx = -100, my = -100, raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
    }

    const loop = () => {
      // Each particle chases the one ahead of it; index 0 chases the cursor
      for (let i = 0; i < positions.length; i++) {
        const target = i === 0
          ? { x: mx, y: my }
          : positions[i - 1]
        const factor = TRAIL_DELAY * (1 - i / positions.length * 0.4) // slight speed taper
        positions[i].x += (target.x - positions[i].x) * factor
        positions[i].y += (target.y - positions[i].y) * factor

        const p = particles[i]
        p.style.transform = `translate(${positions[i].x}px,${positions[i].y}px) translate(-50%,-50%)`

        // Scale & opacity taper toward tail
        const t = 1 - i / positions.length
        p.style.opacity = String(t * 0.55)
        const size = 4 * t + 1
        p.style.width  = `${size}px`
        p.style.height = `${size}px`
      }

      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Main dot */}
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0,
        zIndex: 99999, pointerEvents: 'none',
        width: 5, height: 5, borderRadius: '50%',
        background: 'var(--accent)',
        boxShadow: '0 0 6px var(--accent)',
        willChange: 'transform',
      }} />

      {/* Trail container */}
      <div ref={trailRef} style={{ position: 'fixed', inset: 0, zIndex: 99998, pointerEvents: 'none' }}>
        {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0,
            width: 4, height: 4, borderRadius: '50%',
            background: 'var(--accent)',
            willChange: 'transform, opacity',
          }} />
        ))}
      </div>

      {/* Hide native cursor globally */}
      <style>{`* { cursor: none !important; }`}</style>
    </>
  )
}
