import { useLanyard, statusColor, statusLabel } from '../hooks/useLanyard'
import { useReveal } from '../hooks/useReveal'

const DISCORD_ID = '712648730423197697'

const LINKS = [
  { label:'GitHub',    href:'https://github.com/yuw1xx', external:true },
  { label:'Matrix',    href:'https://matrix.to/#/@yuwixx:matrix.org', external:true },
  { label:'Email',     href:'mailto:yuwixx@yuwixx.dev', external:false },
]

export default function Footer() {
  const { data } = useLanyard(DISCORD_ID)
  const ref = useReveal()

  return (
    <footer ref={ref} className="reveal" style={{
      maxWidth:680, margin:'0 auto',
      paddingBottom:'clamp(6rem,10vw,8rem)',
      paddingTop:32,
      borderTop:'1px solid var(--border)',
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      flexWrap:'wrap',
      gap:16,
    }}>
      <div style={{ display:'flex',gap:6,alignItems:'center',fontSize:12,color:'var(--text-3)' }}>
        {data && (
          <>
            <span style={{
              width:6,height:6,borderRadius:'50%',
              background: statusColor(data.discord_status),
              display:'inline-block',flexShrink:0,
            }}/>
            {statusLabel(data.discord_status)}
            <span style={{color:'var(--text-3)',opacity:0.5}}>·</span>
          </>
        )}
        <span style={{ fontFamily:'var(--mono)' }}>yuwixx</span>
      </div>

      <nav style={{ display:'flex',gap:20 }}>
        {LINKS.map(l => (
          <a key={l.label} href={l.href}
            target={l.external ? '_blank' : undefined}
            rel={l.external ? 'noopener noreferrer' : undefined}
            data-hover="true"
            style={{
              fontSize:13, color:'var(--text-3)',
              transition:'color 0.2s',
            }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--text)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--text-3)'}
          >
            {l.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
