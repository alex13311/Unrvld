'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, LogOut, RotateCcw, Mic, MicOff, Paperclip, X, Volume2, VolumeX } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
}

interface ImageData {
  base64: string
  mediaType: string
  previewUrl: string
}

const SUGGESTIONS = [
  'Check my unread emails',
  "What's on my calendar this week?",
  'Research videography clients in Beverly Hills',
  'Draft an invoice for a brand video shoot',
  'Find luxury car brands I could pitch for content',
]

interface Props {
  userName: string
  userImage: string
}

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s/gm, '')
    .replace(/^\s*\d+\.\s/gm, '')
    .trim()
}

export default function ChatInterface({ userName, userImage }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [listening, setListening] = useState(false)
  const [image, setImage] = useState<ImageData | null>(null)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [stars] = useState(() =>
    Array.from({ length: 180 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.2,
      duration: Math.random() * 6 + 3,
      delay: Math.random() * 8,
      blue: Math.random() > 0.7,
    }))
  )

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, { headers: { 'User-Agent': 'TARS-AI/1.0' } })
        const data = await res.json()
        const city = data.address?.city || data.address?.town || data.address?.suburb || ''
        const state = data.address?.state || ''
        setLocation(city ? `${city}${state ? ', ' + state : ''}` : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
      } catch { setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`) }
    })
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }, [])

  function makeTarsAudioChain(ctx: AudioContext, source: AudioBufferSourceNode) {
    // Slight pitch drop — TARS is deep and measured
    source.playbackRate.value = 0.93

    // High-pass: cut muddy sub-bass below 90Hz
    const hpf = ctx.createBiquadFilter()
    hpf.type = 'highpass'
    hpf.frequency.value = 90
    hpf.Q.value = 0.7

    // Presence boost around 2kHz — cuts through, adds mechanical clarity
    const presence = ctx.createBiquadFilter()
    presence.type = 'peaking'
    presence.frequency.value = 2000
    presence.gain.value = 4
    presence.Q.value = 1.2

    // Slight air cut above 8kHz — less human, more synthetic
    const lpf = ctx.createBiquadFilter()
    lpf.type = 'lowpass'
    lpf.frequency.value = 8000
    lpf.Q.value = 0.5

    // Subtle ring modulation — the metallic "machine" quality
    const ringCarrier = ctx.createOscillator()
    ringCarrier.frequency.value = 28
    ringCarrier.type = 'sine'
    const ringGain = ctx.createGain()
    ringGain.gain.value = 0
    ringCarrier.connect(ringGain.gain)
    ringCarrier.start()

    // Very light saturation for that processed-audio edge
    const distortion = ctx.createWaveShaper()
    const curve = new Float32Array(256)
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1
      curve[i] = ((Math.PI + 12) * x) / (Math.PI + 12 * Math.abs(x))
    }
    distortion.curve = curve
    distortion.oversample = '4x'

    // Master gain
    const master = ctx.createGain()
    master.gain.value = 1.1

    source.connect(hpf)
    hpf.connect(presence)
    presence.connect(lpf)
    lpf.connect(ringGain)
    ringGain.connect(distortion)
    distortion.connect(master)
    master.connect(ctx.destination)

    return { ringCarrier, master }
  }

  async function speak(text: string) {
    if (!ttsEnabled) return
    stopSpeaking()
    const clean = stripMarkdown(text)
    if (!clean.trim()) return
    setSpeaking(true)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean }),
      })
      if (res.status === 503 || !res.ok) {
        browserSpeak(clean)
        return
      }
      const blob = await res.blob()
      const arrayBuffer = await blob.arrayBuffer()
      const ctx = new AudioContext()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
      const source = ctx.createBufferSource()
      source.buffer = audioBuffer
      const { ringCarrier } = makeTarsAudioChain(ctx, source)
      source.onended = () => { ringCarrier.stop(); ctx.close(); setSpeaking(false) }
      source.start()
      // store a stop handle
      audioRef.current = { pause: () => { try { source.stop(); ringCarrier.stop(); ctx.close() } catch { /* already stopped */ } }, src: '' } as unknown as HTMLAudioElement
    } catch {
      browserSpeak(clean)
    }
  }

  function browserSpeak(clean: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) { setSpeaking(false); return }
    const utter = new SpeechSynthesisUtterance(clean)
    utter.rate = 0.88
    utter.pitch = 0.75
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('david') || (v.lang === 'en-US' && v.name.toLowerCase().includes('male'))) || voices.find(v => v.lang.startsWith('en'))
    if (preferred) utter.voice = preferred
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utter)
  }

  function stopSpeaking() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  function toggleVoice() {
    if (listening) { setListening(false); return }
    const SR = (window as unknown as { SpeechRecognition?: new() => SpeechRecognition; webkitSpeechRecognition?: new() => SpeechRecognition }).SpeechRecognition
      || (window as unknown as { SpeechRecognition?: new() => SpeechRecognition; webkitSpeechRecognition?: new() => SpeechRecognition }).webkitSpeechRecognition
    if (!SR) { alert('Voice not supported in this browser. Try Chrome.'); return }
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.onresult = (e: SpeechRecognitionEvent) => { setInput(e.results[0][0].transcript); setListening(false) }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    rec.start()
    setListening(true)
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.split(',')[1]
      setImage({ base64, mediaType: file.type, previewUrl: dataUrl })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function send(text: string) {
    const trimmed = text.trim()
    if ((!trimmed && !image) || loading) return
    stopSpeaking()
    const userMsg: Message = { role: 'user', content: trimmed, imageUrl: image?.previewUrl }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    const sentImage = image
    setImage(null)
    setLoading(true)
    setStatus('Processing…')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })), location, image: sentImage ? { base64: sentImage.base64, mediaType: sentImage.mediaType } : null }),
      })
      if (res.status === 401) { setMessages([...next, { role: 'assistant', content: 'Session expired. Please sign in again.' }]); return }
      if (!res.ok) throw new Error('Bad response')
      const responseText = await res.text()
      setMessages([...next, { role: 'assistant', content: responseText }])
      speak(responseText)
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Connection lost. Try again.' }])
    } finally { setLoading(false); setStatus('') }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  const isEmpty = messages.length === 0
  const amber = 'rgba(212,145,42,'
  const blue = 'rgba(100,160,255,'

  return (
    <div className="flex h-screen flex-col text-white" style={{ background: '#000912' }}>

      {/* Spaceship background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Hull panel grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${blue}0.03) 1px, transparent 1px), linear-gradient(90deg, ${blue}0.03) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }} />
        {/* Viewport atmosphere */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 90% 55% at 15% 85%, rgba(0,20,70,0.55), transparent),
            radial-gradient(ellipse 70% 45% at 85% 10%, rgba(30,0,80,0.3), transparent),
            radial-gradient(ellipse 50% 35% at 50% 50%, rgba(0,5,20,0.6), transparent),
            radial-gradient(ellipse 100% 30% at 50% 100%, rgba(0,10,40,0.7), transparent)
          `
        }} />
        {/* Corner hull glow - amber instrument lighting */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
          background: `linear-gradient(to top, ${amber}0.06), transparent)`
        }} />
        {/* Horizon glow — like a distant star */}
        <div style={{
          position: 'absolute', bottom: '-60px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '120px',
          background: `radial-gradient(ellipse, rgba(0,60,140,0.18), transparent 70%)`
        }} />
        {/* Stars */}
        {stars.map((s) => (
          <div key={s.id} className="star absolute rounded-full" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            backgroundColor: s.blue ? 'rgba(160,200,255,0.9)' : 'rgba(255,255,255,0.95)',
            '--duration': `${s.duration}s`, '--delay': `${s.delay}s`
          } as React.CSSProperties} />
        ))}
        {/* Subtle scanlines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0px, transparent 1px, transparent 3px)', backgroundSize: '100% 4px', pointerEvents: 'none' }} />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: `1px solid ${amber}0.15)`, background: 'rgba(0,8,20,0.7)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center gap-4">
          {/* TARS monolith */}
          <div style={{ width: '10px', height: '36px', border: `1px solid ${amber}0.45)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', padding: '3px 2px', boxShadow: `0 0 12px ${amber}0.15)` }}>
            {[...Array(5)].map((_, i) => (<div key={i} style={{ width: '100%', height: '1px', backgroundColor: `rgba(212,145,42,${0.3 + i * 0.12})` }} />))}
          </div>
          <div>
            <div className="font-mono font-bold tracking-[0.35em] uppercase" style={{ color: `${amber}1)`, fontSize: '15px', textShadow: `0 0 18px ${amber}0.4)` }}>TARS</div>
            <div className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: `${blue}0.4)` }}>Unit 01 · {location || 'Online'}</div>
          </div>
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: `${amber}0.25)` }}>Humor 75%</span>
            <span style={{ color: `${amber}0.12)` }}>·</span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: `${amber}0.25)` }}>Honesty 90%</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* TTS toggle */}
          <button
            onClick={() => { if (speaking) stopSpeaking(); setTtsEnabled(p => !p) }}
            className="flex items-center gap-1.5 transition"
            style={{ color: ttsEnabled ? `${amber}0.7)` : `${amber}0.25)` }}
            onMouseEnter={(e) => (e.currentTarget.style.color = `${amber}0.9)`)}
            onMouseLeave={(e) => (e.currentTarget.style.color = ttsEnabled ? `${amber}0.7)` : `${amber}0.25)`)}
            title={ttsEnabled ? 'Mute TARS' : 'Unmute TARS'}
          >
            {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            {speaking && <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: `${amber}0.6)` }}>Speaking</span>}
          </button>
          {messages.length > 0 && (
            <button onClick={() => { stopSpeaking(); setMessages([]) }} className="flex items-center gap-1.5 transition" style={{ color: `${amber}0.25)` }} onMouseEnter={(e) => (e.currentTarget.style.color = `${amber}0.7)`)} onMouseLeave={(e) => (e.currentTarget.style.color = `${amber}0.25)`)}>
              <RotateCcw size={12} /><span className="text-[10px] uppercase tracking-widest font-mono">Clear</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            {userImage && (<img src={userImage} alt={userName} className="h-7 w-7 rounded-full" style={{ opacity: 0.6, border: `1px solid ${amber}0.2)` }} />)}
            <button onClick={() => signOut({ callbackUrl: '/' })} className="transition" style={{ color: `${amber}0.25)` }} onMouseEnter={(e) => (e.currentTarget.style.color = `${amber}0.7)`)} onMouseLeave={(e) => (e.currentTarget.style.color = `${amber}0.25)`)} title="Sign out"><LogOut size={14} /></button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-3xl flex flex-col gap-7">
          {isEmpty && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center fade-up">
              <div style={{ width: '32px', height: '76px', border: `1px solid ${amber}0.35)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', padding: '8px 4px', marginBottom: '36px', boxShadow: `0 0 32px ${amber}0.12), 0 0 80px ${amber}0.05)` }}>
                {[...Array(8)].map((_, i) => (<div key={i} style={{ width: '100%', height: '1px', backgroundColor: `rgba(212,145,42,${0.12 + i * 0.06})` }} />))}
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.6em] mb-3" style={{ color: `${amber}0.5)` }}>Ready</p>
              <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>What do you need, Cooper?</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="px-4 py-2 text-xs transition font-mono" style={{ border: `1px solid ${amber}0.12)`, color: `${amber}0.5)`, borderRadius: '2px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${amber}0.5)`; e.currentTarget.style.color = `${amber}1)`; e.currentTarget.style.background = `${amber}0.06)` }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${amber}0.12)`; e.currentTarget.style.color = `${amber}0.5)`; e.currentTarget.style.background = 'transparent' }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex fade-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="mr-3 mt-[14px] shrink-0 flex flex-col items-center gap-[3px]">
                  {[...Array(4)].map((_, j) => (<div key={j} style={{ width: '8px', height: '1px', backgroundColor: `rgba(212,145,42,${0.4 + j * 0.12})` }} />))}
                </div>
              )}
              <div className="max-w-[82%] flex flex-col gap-2">
                {msg.imageUrl && (<img src={msg.imageUrl} alt="attached" className="rounded max-w-[300px] max-h-[220px] object-cover" style={{ border: `1px solid ${amber}0.25)` }} />)}
                {msg.content && (
                  <div className="px-5 py-4 leading-[1.85] whitespace-pre-wrap font-mono"
                    style={{
                      fontSize: '15px',
                      ...(msg.role === 'user'
                        ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.92)', borderRadius: '2px 14px 14px 14px' }
                        : { background: `linear-gradient(135deg, ${amber}0.06), ${blue}0.03))`, border: `1px solid ${amber}0.2)`, color: 'rgba(255,255,255,0.95)', borderRadius: '14px 14px 14px 2px', boxShadow: `0 0 20px ${amber}0.05)` })
                    }}>
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start fade-up">
              <div className="mr-3 mt-[14px] shrink-0 flex flex-col items-center gap-[3px]">
                {[...Array(4)].map((_, j) => (<div key={j} style={{ width: '8px', height: '1px', backgroundColor: `rgba(212,145,42,${0.4 + j * 0.12})` }} />))}
              </div>
              <div className="px-5 py-4" style={{ background: `${amber}0.05)`, border: `1px solid ${amber}0.18)`, borderRadius: '14px 14px 14px 2px' }}>
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: `${amber}0.7)`, fontSize: '13px' }}>{status}<span className="cursor-blink">_</span></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-6 py-5" style={{ borderTop: `1px solid ${amber}0.12)`, background: 'rgba(0,8,20,0.75)', backdropFilter: 'blur(8px)' }}>
        {image && (
          <div className="mx-auto max-w-3xl mb-3 flex items-center gap-2">
            <img src={image.previewUrl} alt="preview" className="h-14 w-14 object-cover rounded" style={{ border: `1px solid ${amber}0.35)` }} />
            <span className="font-mono text-xs" style={{ color: `${amber}0.6)` }}>Image attached</span>
            <button onClick={() => setImage(null)} style={{ color: `${amber}0.5)` }} onMouseEnter={(e) => (e.currentTarget.style.color = `${amber}0.9)`)} onMouseLeave={(e) => (e.currentTarget.style.color = `${amber}0.5)`)}><X size={14} /></button>
          </div>
        )}
        <div className="mx-auto max-w-3xl flex items-end gap-3">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          <button onClick={() => fileInputRef.current?.click()} className="flex h-14 w-10 shrink-0 items-center justify-center transition" style={{ color: `${amber}0.4)` }} onMouseEnter={(e) => (e.currentTarget.style.color = `${amber}0.9)`)} onMouseLeave={(e) => (e.currentTarget.style.color = `${amber}0.4)`)} title="Attach image">
            <Paperclip size={17} />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize() }}
            onKeyDown={handleKey}
            placeholder="Speak to TARS…"
            rows={2}
            disabled={loading}
            className="flex-1 resize-none px-5 py-4 outline-none transition disabled:opacity-40 font-mono"
            style={{
              background: `rgba(0,10,30,0.6)`,
              border: `1px solid ${amber}0.15)`,
              color: 'rgba(255,255,255,0.95)',
              minHeight: '72px',
              borderRadius: '4px',
              fontSize: '15px',
              lineHeight: '1.7',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${amber}0.5)`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = `${amber}0.15)`)}
          />
          <button
            onClick={toggleVoice}
            className="flex h-14 w-10 shrink-0 items-center justify-center transition"
            style={{ color: listening ? `${amber}1)` : `${amber}0.4)`, background: listening ? `${amber}0.12)` : 'transparent', borderRadius: '4px' }}
            onMouseEnter={(e) => { if (!listening) e.currentTarget.style.color = `${amber}0.9)` }}
            onMouseLeave={(e) => { if (!listening) e.currentTarget.style.color = `${amber}0.4)` }}
            title="Voice input"
          >
            {listening ? <MicOff size={17} /> : <Mic size={17} />}
          </button>
          <button
            onClick={() => send(input)}
            disabled={(!input.trim() && !image) || loading}
            className="flex h-14 w-14 shrink-0 items-center justify-center transition disabled:opacity-20 disabled:cursor-not-allowed"
            style={{ background: `${amber}0.92)`, border: `1px solid ${amber}0.7)`, borderRadius: '4px', boxShadow: `0 0 16px ${amber}0.2)` }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = `${amber}1)` }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${amber}0.92)` }}
          >
            <Send size={16} color="black" />
          </button>
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: `${amber}0.2)` }}>Enter to send · Shift+Enter new line · 🎤 voice · 📎 image · 🔊 TARS speaks</p>
      </div>
    </div>
  )
}
