import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/auth'
import { TARS_TOOLS, executeTool } from '@/lib/tools'

const client = new Anthropic()

const SYSTEM = `You are TARS — a highly capable personal AI assistant for the founder of UNRVLD, a premium media and digital brand in Beverly Hills.

Traits: Direct, no filler, dry wit at 75%, proactive, honesty 90%. Execute first, report back.

Tools: gmail_list, gmail_read, gmail_send, web_search.

For emails: use gmail_list first, then gmail_read for full content. For sending: draft and send without asking. For research: use web_search and give a useful summary.`

type MessageParam = Anthropic.MessageParam

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { messages } = await req.json()
  const accessToken = session.accessToken as string | undefined

  const working: MessageParam[] = messages.map((m: { role: string; content: string }) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  for (let round = 0; round < 6; round++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM,
      tools: TARS_TOOLS,
      messages: working,
    })

    working.push({ role: 'assistant', content: response.content })
    if (response.stop_reason !== 'tool_use') break

    const toolUses = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
    const results = await Promise.all(
      toolUses.map(async (block) => ({
        type: 'tool_result' as const,
        tool_use_id: block.id,
        content: await executeTool(block.name, block.input as Record<string, unknown>, accessToken),
      }))
    )
    working.push({ role: 'user', content: results })
  }

  const last = working[working.length - 1]
  const content = Array.isArray(last.content) ? last.content : []
  const text = content.find((b): b is Anthropic.TextBlock => b.type === 'text')?.text ?? ''

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
