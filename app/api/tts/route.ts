import { auth } from '@/auth'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) return new Response('TTS_NOT_CONFIGURED', { status: 503 })

  const { text } = await req.json()
  if (!text?.trim()) return new Response('No text', { status: 400 })

  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'TxGEqnHWrfWFTfGW9XjX'

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2',
      voice_settings: {
        stability: 0.92,
        similarity_boost: 0.75,
        style: 0.08,
        use_speaker_boost: true,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text().catch(() => res.status.toString())
    return new Response(`TTS_ERROR: ${err}`, { status: 200 })
  }

  return new Response(res.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  })
}
