import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/auth'

const client = new Anthropic()

const SYSTEM = `You are TARS — a highly capable personal AI assistant. Direct, dry wit at 75%, honest. Keep responses concise.`

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return new Response('Unauthorized', { status: 401 })

    const { messages } = await req.json()

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')

    return new Response(text || '[empty response from Claude]', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return new Response(`[TARS ERROR: ${msg}]`, { status: 200 })
  }
}
