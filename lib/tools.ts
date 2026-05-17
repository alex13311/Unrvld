import type Anthropic from '@anthropic-ai/sdk'
import { listEmails, readEmail, sendEmail } from './gmail'

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Heavy showers', 95: 'Thunderstorm',
}

async function getWeather(location: string): Promise<string> {
  // Strip state/country for geocoding ("Beverly Hills, California" -> "Beverly Hills")
  const simpleName = location.split(',')[0].trim()

  // Try Open-Meteo geocoding
  let lat: number | null = null
  let lon: number | null = null
  let placeName = simpleName

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(simpleName)}&count=1&language=en&format=json`,
      { signal: AbortSignal.timeout(5000) }
    )
    const geoData = await geoRes.json()
    const place = geoData.results?.[0]
    if (place) {
      lat = place.latitude
      lon = place.longitude
      placeName = `${place.name}, ${place.admin1 ?? ''}`
    }
  } catch { /* fall through */ }

  // Hardcoded fallback for Beverly Hills
  if (lat === null) {
    if (simpleName.toLowerCase().includes('beverly')) {
      lat = 34.0736; lon = -118.4004; placeName = 'Beverly Hills, CA'
    } else {
      return `Could not geocode: ${location}`
    }
  }

  // Fetch from Open-Meteo
  try {
    const wxRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=3&timezone=auto`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!wxRes.ok) throw new Error(`Open-Meteo ${wxRes.status}`)
    const wx = await wxRes.json()
    const c = wx.current
    const d = wx.daily
    return JSON.stringify({
      location: placeName,
      condition: WMO_CODES[c.weather_code] ?? `WMO ${c.weather_code}`,
      temp_f: Math.round(c.temperature_2m),
      feels_like_f: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m + '%',
      wind_mph: Math.round(c.wind_speed_10m),
      forecast: d.time?.map((date: string, i: number) => ({
        date,
        condition: WMO_CODES[d.weather_code[i]] ?? `WMO ${d.weather_code[i]}`,
        high_f: Math.round(d.temperature_2m_max[i]),
        low_f: Math.round(d.temperature_2m_min[i]),
      })),
    }, null, 2)
  } catch (e1) {
    // Fallback: wttr.in
    try {
      const wttrRes = await fetch(
        `https://wttr.in/${encodeURIComponent(simpleName)}?format=j1`,
        { headers: { 'User-Agent': 'TARS-AI/1.0' }, signal: AbortSignal.timeout(5000) }
      )
      if (!wttrRes.ok) throw new Error(`wttr.in ${wttrRes.status}`)
      const wttr = await wttrRes.json()
      const cur = wttr.current_condition?.[0]
      if (!cur) throw new Error('No wttr data')
      return JSON.stringify({
        location: placeName,
        condition: cur.weatherDesc?.[0]?.value,
        temp_f: cur.temp_F,
        feels_like_f: cur.FeelsLikeF,
        humidity: cur.humidity + '%',
        wind_mph: cur.windspeedMiles + ' mph',
      })
    } catch (e2) {
      return `Weather unavailable. Open-Meteo: ${e1}. wttr.in: ${e2}`
    }
  }
}

export const TARS_TOOLS: Anthropic.Tool[] = [
  {
    name: 'get_weather',
    description: 'Get current weather and 3-day forecast for any location.',
    input_schema: { type: 'object' as const, properties: { location: { type: 'string' } }, required: ['location'] },
  },
  {
    name: 'web_search',
    description: 'Search the web for news, research, leads, companies, or any information.',
    input_schema: { type: 'object' as const, properties: { query: { type: 'string' } }, required: ['query'] },
  },
  {
    name: 'gmail_list',
    description: 'List emails from Gmail.',
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
      case 'get_weather':
        return await getWeather(input.location as string)

      case 'web_search': {
        const key = process.env.BRAVE_SEARCH_API_KEY
        if (!key) return 'BRAVE_SEARCH_API_KEY not set in environment.'
        const res = await fetch(
          `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(input.query as string)}&count=6`,
          { headers: { Accept: 'application/json', 'X-Subscription-Token': key } }
        )
        if (!res.ok) {
          const body = await res.text().catch(() => '')
          return `Search API error ${res.status}: ${body}`
        }
        const data = await res.json()
        const results = (data.web?.results ?? []).slice(0, 6).map(
          (r: { title: string; url: string; description: string }) => ({ title: r.title, url: r.url, description: r.description })
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
