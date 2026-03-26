export default function Divider() {
  return (
    <div style={{
      maxWidth: 680,
      margin: '0 auto clamp(4rem,8vw,6rem)',
      height: 1,
      background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
    }}/>
  )
}
