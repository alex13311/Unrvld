'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, LogOut, RotateCcw } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface Message { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'Check my unread emails',
  'Research videography clients in Beverly Hills',
  'Draft a follow-up to a prospect who went quiet',
  'Find luxury car brands I could pitch for content',
]

export default function ChatInterface({ userName, userImage }: { userName: string; userImage: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const next = [...messages, { role: 'user' as const, content: trimmed }]
    setMessages(next)
    setInput('')
    setLoading(true)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const text = await res.text()
      setMessages([...next, { role: 'assistant', content: text }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Connection lost. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#000', color:'#fff' }}>
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'rgb(0,210,255)', display:'inline-block' }} />
          <span style={{ fontFamily:'monospace', fontSize:'13px', fontWeight:'bold', letterSpacing:'0.25em' }}>TARS</span>
          <span style={{ fontFamily:'monospace', fontSize:'10px', letterSpacing:'0.3em', color:'rgba(255,255,255,0.2)' }}>// Online</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.25)', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', letterSpacing:'0.15em' }}>
              <RotateCcw size={12} /> Clear
            </button>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            {userImage && <img src={userImage} alt={userName} style={{ width:28, height:28, borderRadius:'50%', opacity:0.7 }} />}
            <button onClick={() => signOut({ callbackUrl: '/' })} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.25)', cursor:'pointer' }} title="Sign out">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      <div style={{ flex:1, overflowY:'auto', padding:'32px 24px' }}>
        <div style={{ maxWidth:720, margin:'0 auto', display:'flex', flexDirection:'column', gap:'24px' }}>
          {messages.length === 0 && !loading && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', paddingTop:'80px', textAlign:'center' }}>
              <p style={{ fontFamily:'monospace', fontSize:'11px', letterSpacing:'0.5em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', marginBottom:'8px' }}>Ready</p>
              <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.3)', marginBottom:'40px' }}>What do you need?</p>
              <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px', maxWidth:560 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} style={{ background:'none', border:'1px solid rgba(255,255,255,0.07)', borderRadius:999, padding:'8px 16px', fontSize:'12px', color:'rgba(255,255,255,0.35)', cursor:'pointer' }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display:'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && <span style={{ fontFamily:'monospace', fontSize:'10px', fontWeight:'bold', color:'rgba(0,200,255,0.55)', marginRight:12, marginTop:14, flexShrink:0 }}>T</span>}
              <div style={{
                maxWidth:'80%', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding:'12px 16px', fontSize:'14px', lineHeight:1.8, whiteSpace:'pre-wrap',
                background: msg.role === 'user' ? 'rgba(255,255,255,0.06)' : 'rgba(0,100,200,0.08)',
                border: msg.role === 'assistant' ? '1px solid rgba(0,150,255,0.12)' : 'none',
                color: msg.role === 'user' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.72)',
              }}>{msg.content}</div>
            </div>
          ))}

          {loading && (
            <div style={{ display:'flex', justifyContent:'flex-start' }}>
              <span style={{ fontFamily:'monospace', fontSize:'10px', fontWeight:'bold', color:'rgba(0,200,255,0.55)', marginRight:12, marginTop:14 }}>T</span>
              <div style={{ borderRadius:'18px 18px 18px 4px', padding:'12px 16px', background:'rgba(0,100,200,0.08)', border:'1px solid rgba(0,150,255,0.12)' }}>
                <span style={{ fontFamily:'monospace', fontSize:'12px', color:'rgba(0,200,255,0.5)' }}>Processing<span className="cursor-blink">_</span></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'16px 24px', flexShrink:0 }}>
        <div style={{ maxWidth:720, margin:'0 auto', display:'flex', alignItems:'flex-end', gap:'12px' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize() }}
            onKeyDown={handleKey}
            placeholder="Ask TARS anything…"
            rows={1}
            disabled={loading}
            style={{ flex:1, resize:'none', borderRadius:16, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', padding:'12px 16px', fontSize:'14px', color:'rgba(255,255,255,0.85)', outline:'none', minHeight:48, fontFamily:'inherit' }}
          />
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            style={{ width:48, height:48, borderRadius:'50%', background:'#fff', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, opacity: (!input.trim() || loading) ? 0.25 : 1 }}>
            <Send size={15} color="black" />
          </button>
        </div>
        <p style={{ marginTop:8, textAlign:'center', fontFamily:'monospace', fontSize:'10px', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,255,255,0.1)' }}>Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
