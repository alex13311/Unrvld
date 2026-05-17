import { signIn } from '@/auth'

export default function LoginPage() {
  return (
    <div style={{
      display: 'flex', minHeight: '100vh', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#000', padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Static star dots via box-shadow trick */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(100,50,0,0.15), transparent), radial-gradient(ellipse 50% 30% at 50% 0%, rgba(20,10,40,0.25), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Monolith */}
        <div style={{
          margin: '0 auto 40px',
          width: '20px', height: '80px',
          border: '1px solid rgba(212,145,42,0.3)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-around',
          padding: '8px 3px',
          boxShadow: '0 0 40px rgba(212,145,42,0.08)',
        }}>
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{ width: '100%', height: '1px', backgroundColor: `rgba(212,145,42,${0.15 + i * 0.04})` }} />
          ))}
        </div>

        <p style={{ marginBottom: '16px', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.55em', textTransform: 'uppercase', color: 'rgba(212,145,42,0.4)' }}>Personal AI</p>
        <h1 style={{ fontSize: '88px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', color: '#fff', fontFamily: 'monospace' }}>TARS</h1>
        <p style={{ marginTop: '12px', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(212,145,42,0.55)' }}>Tactical AI Response System</p>
        <p style={{ marginTop: '28px', maxWidth: '300px', fontSize: '13px', lineHeight: 1.8, color: 'rgba(255,255,255,0.28)', fontFamily: 'monospace', margin: '28px auto 0' }}>Reads your emails, researches leads,<br />and gets things done.</p>

        <div style={{ marginTop: '52px' }}>
          <form action={async () => { 'use server'; await signIn('google', { redirectTo: '/chat' }) }}>
            <button type="submit" style={{
              background: 'rgba(212,145,42,0.9)',
              color: '#000',
              border: 'none',
              borderRadius: '2px',
              padding: '13px 44px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}>Sign in with Google</button>
          </form>
        </div>

        <p style={{ marginTop: '28px', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.1)' }}>Honesty: 90% · Humor: 75%</p>
      </div>
    </div>
  )
}
