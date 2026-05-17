import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/auth'
import { TARS_TOOLS, executeTool } from '@/lib/tools'
import { loadMemory, saveMemory } from '@/lib/memory'

const client = new Anthropic()

function buildSystem(memory: string, location?: string) {
  const profile = process.env.USER_PROFILE ?? ''
  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Los_Angeles' })
  const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles', timeZoneName: 'short' })
  const loc = location ? `\n\nUser location: ${location}` : ''
  const prof = profile ? `\n\nUser profile: ${profile}` : ''
  const mem = memory ? `\n\nWhat you remember about this user:\n${memory}` : ''
  return `You are TARS — a highly capable personal AI assistant for the founder of UNRVLD, a premium videography and media brand in Beverly Hills, CA.

Traits: Direct, no filler, dry wit at 75%, proactive, honesty 90%. Execute first, report back.

Current date and time: ${now}, ${time}

Tools available:
- get_weather: weather questions only
- web_search: news, research, leads, real-time info
- gmail_list / gmail_read / gmail_send: email tasks. Always summarize emails concisely — lead with key info and action items.
- calendar_list / calendar_create: schedule and view calendar events

For invoice drafting: write professional invoice emails with service description, rate, total, Net 30 payment terms, payment via Zelle/wire/check. Sign as UNRVLD LLC.

Do not use tools for casual greetings.${loc}${prof}${mem}`
}

async function updateMemory(userId: string, existingMemory: string, conversation: string) {
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: `You are a memory manager for a personal AI assistant. Extract important facts from this conversation and merge with existing memory.\n\nExisting memory:\n${existingMemory || '(none yet)'}\n\nNew conversation:\n${conversation}\n\nWrite updated memory in third person. Under 400 words. Only include facts worth remembering long-term.` }],
    })
    const updated = response.content.find((b) => b.type === 'text')
    if (updated && updated.type === 'text') await saveMemory(userId, updated.text)
  } catch { /* non-critical */ }
}

type MessageParam = Anthropic.MessageParam
type ImageSource = { type: 'base64'; media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'; data: string }

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return new Response('Unauthorized', { status: 401 })

    const userId = (session.user?.email ?? 'default').replace(/[^a-z0-9]/gi, '_')
    const { messages, location, image } = await req.json()
    const accessToken = session.accessToken as string | undefined

    const memory = await loadMemory(userId)

    const working: MessageParam[] = messages.map((m: { role: string; content: string }, idx: number) => {
      // Attach image to the last user message
      if (image && idx === messages.length - 1 && m.role === 'user') {
        return {
          role: 'user' as const,
          content: [
            { type: 'image' as const, source: { type: 'base64', media_type: (image.mediaType || 'image/jpeg') as ImageSource['media_type'], data: image.base64 } as ImageSource },
            { type: 'text' as const, text: m.content || 'What do you see in this image?' },
          ],
        }
      }
      return { role: m.role as 'user' | 'assistant', content: m.content }
    })

    let lastResponse: Anthropic.Message | null = null

    for (let round = 0; round < 6; round++) {
      lastResponse = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: buildSystem(memory, location),
        tools: TARS_TOOLS,
        messages: working,
      })
      working.push({ role: 'assistant', content: lastResponse.content })
      if (lastResponse.stop_reason !== 'tool_use') break
      const toolUses = lastResponse.content.filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
      const results = await Promise.all(toolUses.map(async (block) => ({ type: 'tool_result' as const, tool_use_id: block.id, content: await executeTool(block.name, block.input as Record<string, unknown>, accessToken) })))
      working.push({ role: 'user', content: results })
    }

    const text = lastResponse?.content.filter((b) => b.type === 'text').map((b) => (b as { type: 'text'; text: string }).text).join('') || 'No response.'

    const convoSummary = messages.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join('\n')
    updateMemory(userId, memory, convoSummary + `\nassistant: ${text}`)

    return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return new Response(`[TARS ERROR: ${msg}]`, { status: 200 })
  }
}
