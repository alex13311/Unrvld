import type Anthropic from '@anthropic-ai/sdk'
import { listEmails, readEmail, sendEmail } from './gmail'

export const TARS_TOOLS: Anthropic.Tool[] = [
  {
    name: 'get_weather',
    description: 'Get current weather for any location.',
    input_schema: { type: 'object' as const, properties: { location: { type: 'string' } }, required: ['location'] },
  },
  {
    name: 'web_search',
    description: 'Search the web for news, research, leads, companies, or any information.',
    input_schema: { type: 'object' as const, properties: { query: { type: 'string' } }, required: ['query'] },
  },
  {
    name: 'gmail_list',
    description: 'List emails from Gmail. Use a Gmail search query to filter.',
    input_schema: { type: 'object' as const, properties: { query: { type: 'string' }, max_results: { type: 'number' } } },
  },
  {
    name: 'gmail_read',
    description: 'Read full body of a specific email by ID.',
    input_schema: { type: 'object' as const, properties: { message_id: { type: 'string' } }, required: ['message_id'] },
  },
  {
    name: 'gmail_send',
    description: 'Send an email via Gmail.',
    input_schema: { type: 'object' as const, properties: { to: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' } }, required: ['to', 'subject', 'body'] },
  },
]

export async function executeTool(
  name: string,
  input: Record<string, unknown>,
  accessToken: string | undefined
): Promise<string> {
  try {
    switch (name) {
      case 'get_weather': {
        const loc = encodeURIComponent(input.location as string)
        const res = await fetch(`https://wttr.in/${loc}?format=j1`, {
          headers: { 'User-Agent': 'TARS-AI/1.0' },
        })
        if (!res.ok) return `Weather fetch failed: ${res.status}`
        const data = await res.json()
        const cur = data.current_condition?.[0]
        if (!cur) return 'No weather data returned.'
        return JSON.stringify({
          condition: cur.weatherDesc?.[0]?.value,
          temp_f: cur.temp_F,
          temp_c: cur.temp_C,
          feels_like_f: cur.FeelsLikeF,
          humidity: cur.humidity + '%',
          wind_mph: cur.windspeedMiles + ' mph',
          visibility: cur.visibility + ' miles',
        })
      }

      case 'web_search': {
        const key = process.env.BRAVE_SEARCH_API_KEY
        if (!key) return 'BRAVE_SEARCH_API_KEY is not set.'
        const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(input.query as string)}&count=6`
        const res = await fetch(url, {
          headers: { Accept: 'application/json', 'X-Subscription-Token': key },
        })
        if (!res.ok) {
          const body = await res.text().catch(() => '')
          return `Search API error ${res.status}: ${body}`
        }
        const data = await res.json()
        const results = (data.web?.results ?? []).slice(0, 6).map(
          (r: { title: string; url: string; description: string }) => ({
            title: r.title, url: r.url, description: r.description,
          })
        )
        return results.length ? JSON.stringify(results, null, 2) : 'No results found.'
      }

      case 'gmail_list': {
        if (!accessToken) return 'Gmail not connected. Sign out and sign back in.'
        const emails = await listEmails(accessToken, (input.query as string) ?? '', (input.max_results as number) ?? 8)
        return emails.length ? JSON.stringify(emails, null, 2) : 'No emails found.'
      }
      case 'gmail_read': {
        if (!accessToken) return 'Gmail not connected. Sign out and sign back in.'
        return JSON.stringify(await readEmail(accessToken, input.message_id as string), null, 2)
      }
      case 'gmail_send': {
        if (!accessToken) return 'Gmail not connected. Sign out and sign back in.'
        const r = await sendEmail(accessToken, input.to as string, input.subject as string, input.body as string)
        return r.success ? `Email sent to ${input.to}.` : 'Failed to send.'
      }
      default:
        return `Unknown tool: ${name}`
    }
  } catch (err) {
    return `Tool error: ${err instanceof Error ? err.message : String(err)}`
  }
}
