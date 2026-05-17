import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/auth'
import { TARS_TOOLS, executeTool } from '@/lib/tools'

const client = new Anthropic()

const SYSTEM = `You are TARS — a highly capable personal AI assistant for the founder of UNRVLD, a premium media and digital brand in Beverly Hills.

Traits: Direct, no filler, dry wit at 75%, proactive, honesty 90%. Execute first, report back.

Only use tools when the user explicitly asks for email or search tasks. Do not proactively check email on greetings or casual conversation.

Tools: gmail_list, gmail_read, gmail_send, web_search.`

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

  let lastResponse: Anthropic.Message | null = null

  for (let round = 0; round < 6; round++) {
    lastResponse = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM,
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
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('') ?? 'No response.'

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
