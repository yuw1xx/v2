import { useGitHub, LANG_COLOR, timeAgo } from '../hooks/useGitHub'
import { useReveal } from '../hooks/useReveal'

const GH_USER = 'yuw1xx'

export default function Projects() {
  const { topRepos, loading } = useGitHub(GH_USER)
  const ref = useReveal()

  return (
    <section ref={ref} className="reveal" style={{ maxWidth:680, margin:'0 auto', paddingBottom:'clamp(4rem,8vw,6rem)' }}>
      <Label>Projects</Label>
      <p style={{ color:'var(--text-2)',fontSize:14,marginTop:4,marginBottom:32 }}>
        Most recently active repositories.
      </p>

      <div style={{ display:'flex',flexDirection:'column',gap:1 }}>
        {loading
          ? Array.from({length:4}).map((_,i) => (
              <div key={i} style={{
                height:68,borderRadius:'var(--radius)',
                background:'var(--bg-card)',opacity:0.5,marginBottom:1,
              }}/>
            ))
          : topRepos.map((repo, i) => (
              <a key={repo.id}
                href={repo.html_url} target="_blank" rel="noopener noreferrer"
                data-hover="true"
                style={{
                  display:'flex', alignItems:'center', gap:16,
                  padding:'14px 16px',
                  borderRadius:'var(--radius)',
                  border:'1px solid transparent',
                  transition:'background 0.2s,border-color 0.2s',
                  textDecoration:'none',
                  animation:`fade-up 0.45s ease ${i*0.07}s both`,
                }}
                onMouseEnter={e=>{
                  e.currentTarget.style.background='var(--bg-card)'
                  e.currentTarget.style.borderColor='var(--border)'
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.background='transparent'
                  e.currentTarget.style.borderColor='transparent'
                }}
              >
                {/* Icon / lang dot */}
                <div style={{
                  width:36,height:36,borderRadius:'var(--radius-sm)',
                  background:'var(--bg-raised)',
                  border:'1px solid var(--border)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  flexShrink:0,fontSize:16,
                }}>
                  {getIcon(repo.language)}
                </div>

                {/* Name + desc */}
                <div style={{ flex:1,minWidth:0 }}>
                  <p style={{
                    margin:0,fontSize:14,fontWeight:500,
                    color:'var(--text)',
                    whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                  }}>{repo.name}</p>
                  <p style={{
                    margin:'2px 0 0',fontSize:12,color:'var(--text-2)',
                    whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                  }}>{repo.description || 'No description'}</p>
                </div>

                {/* Meta */}
                <div style={{ flexShrink:0,display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4 }}>
                  {repo.language && (
                    <span style={{ display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--text-2)',fontFamily:'var(--mono)' }}>
                      <span style={{
                        width:7,height:7,borderRadius:'50%',
                        background: LANG_COLOR[repo.language] || '#888',
                      }}/>
                      {repo.language}
                    </span>
                  )}
                  <span style={{ fontSize:11,color:'var(--text-3)',fontFamily:'var(--mono)' }}>
                    {timeAgo(repo.pushed_at)}
                  </span>
                </div>
              </a>
            ))
        }
      </div>
    </section>
  )
}

function getIcon(lang: string | null) {
  const map: Record<string,string> = {
    TypeScript:'📘', JavaScript:'📙', Python:'🐍',
    'C#':'⚙️', Java:'☕', CSS:'🎨', HTML:'🌐',
    PHP:'🐘', Rust:'⚙️', Go:'🐹',
  }
  return lang ? (map[lang] || '📂') : '📂'
}

function Label({ children }: { children: string }) {
  return (
    <p style={{
      fontSize:11,textTransform:'uppercase',letterSpacing:'0.12em',
      color:'var(--text-3)',fontFamily:'var(--mono)',marginBottom:2,
    }}>
      {children}
    </p>
  )
}
