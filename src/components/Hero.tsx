import React from 'react'
import { useGitHub } from '../hooks/useGitHub'
import { useLanyard, statusColor, statusLabel } from '../hooks/useLanyard'

const DISCORD_ID = '712648730423197697'
const GH_USER    = 'yuw1xx'

const btn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 20px',
  borderRadius: 'var(--radius-sm)',
  fontSize: 14,
  fontWeight: 500,
  transition: 'opacity 0.2s, transform 0.2s, border-color 0.2s, color 0.2s',
  textDecoration: 'none',
}

export default function Hero() {
  const { user }  = useGitHub(GH_USER)
  const { data }  = useLanyard(DISCORD_ID)

  return (
    <section style={{
      minHeight: '92vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 'clamp(4rem,10vw,8rem) 0 clamp(3rem,6vw,5rem)',
      maxWidth: 680,
      margin: '0 auto',
      animation: 'fade-up 0.7s ease both',
    }}>

      {/* Discord status chip */}
      {data && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '4px 12px',
          border: '1px solid var(--border)',
          borderRadius: 999,
          width: 'fit-content',
          marginBottom: 32,
          fontSize: 12,
          color: 'var(--text-2)',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: statusColor(data.discord_status),
            boxShadow: `0 0 5px ${statusColor(data.discord_status)}`,
            display: 'inline-block', flexShrink: 0,
          }} />
          {statusLabel(data.discord_status)} on Discord
          {data.listening_to_spotify && data.spotify && (
            <span style={{ color: 'var(--text-3)' }}>
              &nbsp;·&nbsp;
              <span style={{ color: '#1db954' }}>♫</span>
              &nbsp;{data.spotify.song}
            </span>
          )}
        </div>
      )}

      {/* Name */}
      <h1 style={{
        fontFamily: 'var(--font)',
        fontSize: 'clamp(3rem,8vw,5.5rem)',
        fontWeight: 600,
        letterSpacing: '-2.5px',
        lineHeight: 1.05,
        color: 'var(--text)',
        marginBottom: 24,
      }}>
        yuwixx
      </h1>

      {/* Bio */}
      <p style={{
        fontSize: 'clamp(1rem,2.2vw,1.15rem)',
        color: 'var(--text-2)',
        lineHeight: 1.75,
        maxWidth: 500,
        marginBottom: 36,
        fontWeight: 300,
      }}>
        Developer building things for the web since&nbsp;2019.
        Currently exploring{' '}
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>C#</span>,{' '}
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>Java</span> &amp;{' '}
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>PHP</span>.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a
          href={`https://github.com/${GH_USER}`}
          target="_blank" rel="noopener noreferrer"
          data-hover="true"
          style={{ ...btn, background: 'var(--accent)', border: '1px solid var(--accent)', color: '#fff' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)' }}
        >
          GitHub ↗
        </a>
        <a
          href="mailto:yuwixx@yuwixx.dev"
          data-hover="true"
          style={{ ...btn, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-2)' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--text)'
            e.currentTarget.style.borderColor = 'var(--border-hover)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-2)'
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Email
        </a>
      </div>

      {/* GitHub meta */}
      {user && (
        <div style={{ display: 'flex', gap: 20, marginTop: 40, fontSize: 13, color: 'var(--text-3)' }}>
          {([
            { label: 'repos',     val: user.public_repos },
            { label: 'followers', val: user.followers    },
          ] as const).map(s => (
            <span key={s.label} style={{ fontFamily: 'var(--mono)' }}>
              <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>{s.val}</span>
              &nbsp;{s.label}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
