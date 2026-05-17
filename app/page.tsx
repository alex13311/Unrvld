import { signIn } from '@/auth'

export default function LoginPage() {
  return (
    <div style={{ display:'flex', minHeight:'100vh', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#000', padding:'24px' }}>
      <div style={{ textAlign:'center' }}>
        <p style={{ marginBottom:'20px', fontSize:'11px', letterSpacing:'0.5em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)' }}>Personal AI</p>
        <h1 style={{ fontSize:'96px', fontWeight:700, lineHeight:1, letterSpacing:'-0.02em', color:'#fff' }}>TARS</h1>
        <p style={{ marginTop:'12px', fontFamily:'monospace', fontSize:'11px', letterSpacing:'0.35em', textTransform:'uppercase', color:'rgba(0,200,255,0.5)' }}>Tactical AI Response System</p>
        <p style={{ marginTop:'32px', maxWidth:'320px', fontSize:'14px', lineHeight:1.7, color:'rgba(255,255,255,0.35)' }}>Your personal assistant. Reads your emails, researches leads, and gets things done.</p>
        <div style={{ marginTop:'48px' }}>
          <form action={async () => { 'use server'; await signIn('google', { redirectTo: '/chat' }) }}>
            <button type="submit" style={{ background:'#fff', color:'#000', border:'none', borderRadius:'999px', padding:'12px 40px', fontSize:'12px', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>Sign in with Google</button>
          </form>
        </div>
        <p style={{ marginTop:'24px', fontFamily:'monospace', fontSize:'10px', letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.15)' }}>Honesty: 90%</p>
      </div>
    </div>
  )
}
