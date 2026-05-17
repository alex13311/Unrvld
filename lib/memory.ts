const REDIS_URL = process.env.UPSTASH_REDIS_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN

async function redis(cmd: unknown[]) {
  if (!REDIS_URL || !REDIS_TOKEN) return null
  try {
    const res = await fetch(REDIS_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmd),
    })
    const data = await res.json()
    return data.result ?? null
  } catch { return null }
}

export async function loadMemory(userId: string): Promise<string> {
  const result = await redis(['GET', `tars:memory:${userId}`])
  return typeof result === 'string' ? result : ''
}

export async function saveMemory(userId: string, memory: string): Promise<void> {
  await redis(['SET', `tars:memory:${userId}`, memory])
}
