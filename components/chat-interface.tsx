'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, LogOut, RotateCcw } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'Check my unread emails',
  'Research videography clients in Beverly Hills',
  'Draft a follow-up to a prospect who went quiet',
  'Any emails about invoices or payments?',
  'Find luxury car brands I could pitch for content',
]

interface Props {
  userName: string
  userImage: string
}

export default function ChatInterface({ userName, userImage }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [stars] = useState(() =>
    Array.from({ length: 140 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.6 + 0.3,
      duration: Math.random() * 5 + 2,
      delay: Math.random() * 6,
    }))
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    setStatus('Processing…')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })

      if (res.status === 401) {
        setMessages([...next, { role: 'assistant', content: 'Session expired. Please sign in again.' }])
        return
      }

      if (!res.ok) throw new Error('Bad response')

      const text = await res.text()
      setMessages([...next, { role: 'assistant', content: text }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Connection lost. Try again.' }])
    } finally {
      setLoading(false)
      setStatus('')
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const isEmpty = messages.length === 0
  const amber = 'rgba(212,145,42,'

  return (
    <div className="flex h-screen flex-col bg-black text-white">

      {/* Star field */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {stars.map((s) => (
          <div
            key={s.id}
            className="star absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: 'rgba(255,255,255,0.95)',
              '--duration': `${s.duration}s`,
              '--delay': `${s.delay}s`,
            } as React.CSSProperties}
          />
        ))}
        {/* Deep space glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 120% 50% at 50% 110%, rgba(100,50,0,0.18), transparent), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(20,10,40,0.3), transparent)',
        }} />
        {/* Subtle scanline */}
        <div className="scanline pointer-events-none" style={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(212,145,42,0.03), transparent)',
        }} />
      </div>

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{ borderBottom: `1px solid ${amber}0.12)` }}
      >
        <div className="flex items-center gap-4">
          {/* TARS monolith */}
          <div style={{
            width: '10px', height: '36px',
            border: `1px solid ${amber}0.35)`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'space-around',
            padding: '3px 2px',
          }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ width: '100%', height: '1px', backgroundColor: `rgba(212,145,42,${0.3 + i * 0.1})` }} />
            ))}
          </div>
          <div>
            <div className="font-mono font-bold tracking-[0.35em] uppercase text-sm" style={{ color: `${amber}0.95)` }}>TARS</div>
            <div className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: `${amber}0.3)` }}>Unit 01 · Online</div>
          </div>
          <div className="hidden sm:block font-mono text-[10px] tracking-[0.25em] uppercase ml-2" style={{ color: 'rgba(255,255,255,0.1)' }}>
            Honesty 90% · Humor 75%
          </div>
        </div>

        <div className="flex items-center gap-4">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1.5 transition"
              style={{ color: `${amber}0.25)` }}
              onMouseEnter={(e) => (e.currentTarget.style.color = `${amber}0.7)`)}
              onMouseLeave={(e) => (e.currentTarget.style.color = `${amber}0.25)`)}
            >
              <RotateCcw size={12} />
              <span className="text-[10px] uppercase tracking-widest font-mono">Clear</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            {userImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userImage} alt={userName} className="h-7 w-7 rounded-full" style={{ opacity: 0.5, filter: 'sepia(0.3)' }} />
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="transition"
              style={{ color: `${amber}0.25)` }}
              onMouseEnter={(e) => (e.currentTarget.style.color = `${amber}0.7)`)}
              onMouseLeave={(e) => (e.currentTarget.style.color = `${amber}0.25)`)}
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-3xl flex flex-col gap-6">
          {isEmpty && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center fade-up">
              {/* Monolith */}
              <div style={{
                width: '28px', height: '64px',
                border: `1px solid ${amber}0.25)`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'space-around',
                padding: '6px 3px',
                marginBottom: '32px',
                boxShadow: `0 0 24px ${amber}0.08)`,
              }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{ width: '100%', height: '1px', backgroundColor: `rgba(212,145,42,${0.12 + i * 0.05})` }} />
                ))}
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.6em] mb-3" style={{ color: `${amber}0.4)` }}>Ready</p>
              <p className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.22)', fontFamily: 'monospace' }}>What do you need?</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-4 py-2 text-xs transition font-mono"
                    style={{
                      border: `1px solid ${amber}0.1)`,
                      color: `${amber}0.4)`,
                      borderRadius: '2px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${amber}0.45)`
                      e.currentTarget.style.color = `${amber}0.9)`
                      e.currentTarget.style.background = `${amber}0.05)`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${amber}0.1)`
                      e.currentTarget.style.color = `${amber}0.4)`
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex fade-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <span className="mr-3 mt-[14px] font-mono text-[11px] uppercase tracking-[0.2em] shrink-0 font-bold" style={{ color: `${amber}0.7)` }}>T</span>
              )}
              <div
                className="max-w-[80%] px-4 py-3 text-sm leading-[1.9] whitespace-pre-wrap font-mono"
                style={msg.role === 'user'
                  ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', borderRadius: '2px 12px 12px 12px' }
                  : { background: `${amber}0.04)`, border: `1px solid ${amber}0.14)`, color: 'rgba(255,255,255,0.82)', borderRadius: '12px 12px 12px 2px' }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start fade-up">
              <span className="mr-3 mt-[14px] font-mono text-[11px] uppercase tracking-[0.2em] shrink-0 font-bold" style={{ color: `${amber}0.7)` }}>T</span>
              <div className="px-4 py-3 text-sm" style={{ background: `${amber}0.04)`, border: `1px solid ${amber}0.14)`, borderRadius: '12px 12px 12px 2px' }}>
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: `${amber}0.6)` }}>
                  {status}<span className="cursor-blink">_</span>
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 px-6 py-4" style={{ borderTop: `1px solid ${amber}0.1)` }}>
        <div className="mx-auto max-w-3xl flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize() }}
            onKeyDown={handleKey}
            placeholder="Speak to TARS…"
            rows={1}
            disabled={loading}
            className="flex-1 resize-none px-4 py-3 text-sm outline-none transition disabled:opacity-40 font-mono"
            style={{
              background: `${amber}0.03)`,
              border: `1px solid ${amber}0.12)`,
              color: 'rgba(255,255,255,0.85)',
              minHeight: '48px',
              borderRadius: '2px',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${amber}0.4)`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = `${amber}0.12)`)}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="flex h-12 w-12 shrink-0 items-center justify-center transition disabled:opacity-20 disabled:cursor-not-allowed"
            style={{ background: `${amber}0.9)`, border: `1px solid ${amber}0.6)`, borderRadius: '2px' }}
            onMouseEnter={(e) => { if (!loading && input.trim()) (e.currentTarget as HTMLElement).style.background = `${amber}1)` }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${amber}0.9)` }}
          >
            <Send size={15} color="black" />
          </button>
        </div>
        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: `${amber}0.18)` }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
