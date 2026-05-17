import { google } from 'googleapis'

function getClient(accessToken: string) {
  const oauth2 = new google.auth.OAuth2()
  oauth2.setCredentials({ access_token: accessToken })
  return google.gmail({ version: 'v1', auth: oauth2 })
}

function getHeader(headers: { name?: string | null; value?: string | null }[], name: string) {
  return headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value ?? ''
}

export async function listEmails(accessToken: string, query = '', maxResults = 8) {
  const gmail = getClient(accessToken)
  const { data } = await gmail.users.messages.list({ userId: 'me', q: query || 'in:inbox', maxResults: Math.min(maxResults, 20) })
  if (!data.messages?.length) return []
  return Promise.all(data.messages.map(async msg => {
    const { data: email } = await gmail.users.messages.get({ userId: 'me', id: msg.id!, format: 'metadata', metadataHeaders: ['From','To','Subject','Date'] })
    const h = email.payload?.headers ?? []
    return { id: email.id, from: getHeader(h,'From'), to: getHeader(h,'To'), subject: getHeader(h,'Subject'), date: getHeader(h,'Date'), snippet: email.snippet }
  }))
}

export async function readEmail(accessToken: string, messageId: string) {
  const gmail = getClient(accessToken)
  const { data } = await gmail.users.messages.get({ userId: 'me', id: messageId, format: 'full' })
  const h = data.payload?.headers ?? []
  function extractText(part: typeof data.payload): string {
    if (!part) return ''
    if (part.mimeType === 'text/plain' && part.body?.data) return Buffer.from(part.body.data, 'base64').toString('utf-8')
    return (part.parts ?? []).map(extractText).join('')
  }
  return { id: data.id, from: getHeader(h,'From'), to: getHeader(h,'To'), subject: getHeader(h,'Subject'), date: getHeader(h,'Date'), body: extractText(data.payload).slice(0, 4000) }
}

export async function sendEmail(accessToken: string, to: string, subject: string, body: string) {
  const gmail = getClient(accessToken)
  const { data: profile } = await gmail.users.getProfile({ userId: 'me' })
  const raw = Buffer.from([`From: ${profile.emailAddress}`,`To: ${to}`,`Subject: ${subject}`,'',body].join('\n')).toString('base64url')
  const { data } = await gmail.users.messages.send({ userId: 'me', requestBody: { raw } })
  return { success: true, messageId: data.id }
}
