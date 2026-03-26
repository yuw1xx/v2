import Cursor    from './components/Cursor'
import Hero       from './components/Hero'
import Projects   from './components/Projects'
import LangChart  from './components/LangChart'
import ContribGraph from './components/ContribGraph'
import Footer     from './components/Footer'
import SpotifyPill from './components/SpotifyPill'
import Divider    from './components/Divider'

export default function App() {
  return (
    <>
      <Cursor />

      {/* Subtle top-left glow */}
      <div style={{
        position:'fixed', top:-100, left:-100,
        width:500, height:500,
        borderRadius:'50%',
        background:'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        pointerEvents:'none',
        zIndex:0,
      }}/>

      <main style={{
        position:'relative', zIndex:1,
        padding:'0 clamp(1.5rem,5vw,2rem)',
      }}>
        <Hero />
        <Divider />
        <Projects />
        <Divider />
        <ContribGraph />
        <Divider />
        <LangChart />
        <Footer />
      </main>

      <SpotifyPill />
    </>
  )
}
