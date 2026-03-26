import { useEffect, useState } from 'react'
import { useLanyard, statusColor, statusLabel } from '../hooks/useLanyard'

const DISCORD_ID = '712648730423197697'

function useProgress(start: number, end: number) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const tick = () => setPct(Math.min(((Date.now() - start) / (end - start)) * 100, 100))
    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [start, end])
  return pct
}

function fmt(ms: number) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function SpotifyPill() {
  const { data } = useLanyard(DISCORD_ID)
  const sp = data?.listening_to_spotify ? data.spotify : null
  const pct = useProgress(sp?.timestamps.start ?? 0, sp?.timestamps.end ?? 1)

  const elapsed = sp ? Date.now() - sp.timestamps.start : 0
  const total   = sp ? sp.timestamps.end - sp.timestamps.start : 0

  // Always rendered — slides in/out
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      pointerEvents: sp ? 'auto' : 'none',
      opacity: sp ? 1 : 0,
      transition: 'opacity 0.4s ease',
      animation: sp ? 'pill-in 0.45s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px 8px 8px',
        background: 'rgba(12,12,14,0.88)',
        border: '1px solid var(--border)',
        borderRadius: 999,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)',
        minWidth: 280,
        maxWidth: 380,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Progress bar — sits at very bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 2, background: 'rgba(255,255,255,0.05)',
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #1db954, #1ed760)',
            borderRadius: 1,
            transition: 'width 0.5s linear',
          }}/>
        </div>

        {/* Album art */}
        {sp?.album_art_url && (
          <img src={sp.album_art_url} alt={sp?.album}
            style={{ width:36,height:36,borderRadius:6,flexShrink:0,display:'block' }}
          />
        )}

        {/* Track info */}
        <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
          <p style={{
            margin:0, fontSize:13, fontWeight:500,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            color:'var(--text)',
          }}>{sp?.song}</p>
          <p style={{
            margin:'1px 0 0', fontSize:11,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            color:'var(--text-2)',
          }}>{sp?.artist}</p>
        </div>

        {/* Time */}
        <div style={{ flexShrink:0, textAlign:'right' }}>
          <p style={{ margin:0, fontSize:11, color:'var(--text-2)', fontFamily:'var(--mono)' }}>
            {fmt(elapsed)}
          </p>
          <p style={{ margin:0, fontSize:10, color:'var(--text-3)', fontFamily:'var(--mono)' }}>
            {fmt(total)}
          </p>
        </div>

        {/* Spotify logo dot */}
        <div style={{
          width:8,height:8,borderRadius:'50%',
          background:'#1db954',
          flexShrink:0,
          boxShadow:'0 0 6px #1db954',
          animation:'pulse-ring 2s ease infinite',
        }}/>
      </div>

      {/* Discord status row — sits just above pill when not spotify */}
      {!sp && data && (
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'center',gap:6,
          marginBottom:8,fontSize:12,color:'var(--text-2)',
        }}>
          <span style={{
            width:7,height:7,borderRadius:'50%',
            background: statusColor(data.discord_status),
            display:'inline-block',
          }}/>
          {statusLabel(data.discord_status)} on Discord
        </div>
      )}
    </div>
  )
}
