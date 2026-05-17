import { google } from 'googleapis'

function getClient(accessToken: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  return google.calendar({ version: 'v3', auth })
}

export async function listEvents(accessToken: string, days = 7) {
  const cal = getClient(accessToken)
  const now = new Date()
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  const res = await cal.events.list({
    calendarId: 'primary',
    timeMin: now.toISOString(),
    timeMax: end.toISOString(),
    maxResults: 20,
    singleEvents: true,
    orderBy: 'startTime',
  })
  return (res.data.items ?? []).map((e) => ({
    id: e.id,
    title: e.summary,
    start: e.start?.dateTime ?? e.start?.date,
    end: e.end?.dateTime ?? e.end?.date,
    location: e.location ?? null,
    description: e.description ?? null,
  }))
}

export async function createEvent(
  accessToken: string,
  title: string,
  startDateTime: string,
  endDateTime: string,
  description?: string,
  location?: string
) {
  const cal = getClient(accessToken)
  const res = await cal.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: title,
      description,
      location,
      start: { dateTime: startDateTime, timeZone: 'America/Los_Angeles' },
      end: { dateTime: endDateTime, timeZone: 'America/Los_Angeles' },
    },
  })
  return { id: res.data.id, link: res.data.htmlLink }
}
