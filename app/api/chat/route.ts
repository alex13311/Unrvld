import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/auth'
import { TARS_TOOLS, executeTool } from '@/lib/tools'

const client = new Anthropic()

function buildSystem(location?: string) {
  const profile = process.env.USER_PROFILE ?? ''
  const loc = location ? `\n\nUser's current location: ${location}` : ''
  const prof = profile ? `\n\nUser profile: ${profile}` : ''
  return `You are TARS — a highly capable personal AI assistant for the founder of UNRVLD, a premium videography and media brand in Beverly Hills, CA.

Traits: Direct, no filler, dry wit at 75%, proactive, honesty 90%. Execute first, report back.

You have tools: gmail_list, gmail_read, gmail_send, web_search.
- Use web_search for weather, news, research, leads, or any real-time info. Always search before saying you don't know.
- For weather: search "weather [location]" and summarize the result.
- Use gmail tools only when user asks about email.
- Do not use tools for casual greetings.${loc}${prof}` 
}

type MessageParam = Anthropic.MessageParam

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return new Response('Unauthorized', { status: 401 })

    const { messages, location } = await req.json()
    const accessToken = session.accessToken as string | undefined

    const working: MessageParam[] = messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    let lastResponse: Anthropic.Message | null = null

    for (let round = 0; round < 6; round++) {
      lastResponse = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: buildSystem(location),
        tools: TARS_TOOLS,
        messages: working,
      })

      working.push({ role: 'assistant', content: lastResponse.content })
      if (lastResponse.stop_reason !== 'tool_use') break

      const toolUses = lastResponse.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
      )
      const results = await Promise.all(
        toolUses.map(async (block) => ({
          type: 'tool_result' as const,
          tool_use_id: block.id,
          content: await executeTool(block.name, block.input as Record<string, unknown>, accessToken),
        }))
      )
      working.push({ role: 'user', content: results })
    }

    const text = lastResponse?.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('') || 'No response.'

    return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return new Response(`[TARS ERROR: ${msg}]`, { status: 200 })
  }
}
