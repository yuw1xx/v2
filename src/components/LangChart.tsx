import { useGitHub, LANG_COLOR } from '../hooks/useGitHub'
import { useReveal } from '../hooks/useReveal'

const GH_USER = 'yuw1xx'

export default function LangChart() {
  const { langPercent, loading } = useGitHub(GH_USER)
  const ref = useReveal()

  return (
    <section ref={ref} className="reveal" style={{ maxWidth:680, margin:'0 auto', paddingBottom:'clamp(4rem,8vw,6rem)' }}>
      <Label>Languages</Label>
      <p style={{ color:'var(--text-2)', fontSize:14, marginTop:4, marginBottom:32 }}>
        Aggregated across top repositories by codebase size.
      </p>

      {loading ? (
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
          {[80,60,45,35,25].map((w,i)=>(
            <div key={i} style={{ display:'flex',alignItems:'center',gap:12 }}>
              <div style={{ width:72,height:12,borderRadius:4,background:'var(--bg-card)',opacity:0.6 }}/>
              <div style={{ flex:1,height:6,borderRadius:3,background:'var(--bg-card)',opacity:0.4 }}/>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Segmented bar */}
          <div style={{
            display:'flex', height:6, borderRadius:3, overflow:'hidden',
            marginBottom:24, gap:2,
          }}>
            {langPercent.map(({ lang, pct }) => (
              <div key={lang} style={{
                width:`${pct}%`,
                background: LANG_COLOR[lang] || '#555',
                borderRadius:2,
                transition:'width 0.8s ease',
              }}/>
            ))}
          </div>

          {/* Legend rows */}
          <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
            {langPercent.map(({ lang, pct }, i) => (
              <div key={lang} style={{
                display:'flex', alignItems:'center', gap:12,
                animationDelay:`${i*0.05}s`,
              }}>
                {/* Dot */}
                <span style={{
                  width:8,height:8,borderRadius:'50%',flexShrink:0,
                  background: LANG_COLOR[lang] || '#555',
                  boxShadow:`0 0 6px ${LANG_COLOR[lang] || '#555'}88`,
                }}/>
                {/* Name */}
                <span style={{ width:100,fontSize:13,color:'var(--text)',fontFamily:'var(--mono)',flexShrink:0 }}>
                  {lang}
                </span>
                {/* Bar */}
                <div style={{ flex:1,height:3,borderRadius:2,background:'var(--bg-card)',overflow:'hidden' }}>
                  <div style={{
                    height:'100%',
                    width:`${pct}%`,
                    background: LANG_COLOR[lang] || '#555',
                    borderRadius:2,
                    transition:`width 0.8s ease ${i*0.06}s`,
                  }}/>
                </div>
                {/* Pct */}
                <span style={{ width:40,textAlign:'right',fontSize:12,color:'var(--text-2)',fontFamily:'var(--mono)',flexShrink:0 }}>
                  {pct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function Label({ children }: { children: string }) {
  return (
    <p style={{
      fontSize:11, textTransform:'uppercase', letterSpacing:'0.12em',
      color:'var(--text-3)', fontFamily:'var(--mono)', marginBottom:2,
    }}>
      {children}
    </p>
  )
}
