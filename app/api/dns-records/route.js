import { auth } from '@clerk/nextjs/server'
import { resolve4, resolveMx, resolveTxt, resolveNs, resolveCname } from 'dns/promises'
import { sql } from '../../../lib/db'

const STALE_HOURS = 6

async function lookupRecords(domain) {
  const results = {}
  try {
    results.A = (await resolve4(domain)).sort()
  } catch {
    results.A = []
  }
  try {
    const mx = await resolveMx(domain)
    results.MX = mx.sort((a, b) => a.priority - b.priority).map((r) => `${r.priority} ${r.exchange}`)
  } catch {
    results.MX = []
  }
  try {
    results.TXT = (await resolveTxt(domain)).map((r) => r.join('')).sort()
  } catch {
    results.TXT = []
  }
  try {
    results.NS = (await resolveNs(domain)).sort()
  } catch {
    results.NS = []
  }
  try {
    results.CNAME = await resolveCname(domain)
  } catch {
    results.CNAME = []
  }
  return results
}

// Resolves live records for a domain and upserts each record type.
// ON CONFLICT DO UPDATE compares the incoming value against what's
// already stored, so "changed_at" only moves when the value actually differs.
async function checkDomain(userId, domain) {
  const live = await lookupRecords(domain)
  const out = []
  for (const type of Object.keys(live)) {
    const value = JSON.stringify(live[type])
    const rows = await sql`
      INSERT INTO dns_records (user_id, domain, record_type, value, previous_value, changed_at, last_checked)
      VALUES (${userId}, ${domain}, ${type}, ${value}::jsonb, NULL, NULL, now())
      ON CONFLICT (user_id, domain, record_type)
      DO UPDATE SET
        previous_value = dns_records.value,
        changed_at = CASE WHEN dns_records.value IS DISTINCT FROM EXCLUDED.value THEN now() ELSE dns_records.changed_at END,
        value = EXCLUDED.value,
        last_checked = now()
      RETURNING record_type, value, previous_value, changed_at, last_checked
    `
    out.push(rows[0])
  }
  return out
}

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return Response.json({ error: 'Not signed in' }, { status: 401 })
  }

  const domainRows = await sql`
    SELECT domain FROM domains WHERE user_id = ${userId} ORDER BY domain ASC
  `

  const results = []
  for (const { domain } of domainRows) {
    const cached = await sql`
      SELECT record_type, value, previous_value, changed_at, last_checked
      FROM dns_records
      WHERE user_id = ${userId} AND domain = ${domain}
    `
    const oldestCheck = cached.reduce((min, r) => {
      const t = new Date(r.last_checked).getTime()
      return min === null || t < min ? t : min
    }, null)
    const isStale = cached.length === 0 || oldestCheck === null || Date.now() - oldestCheck > STALE_HOURS * 3600 * 1000

    const records = isStale ? await checkDomain(userId, domain) : cached
    results.push({ domain, records })
  }

  return Response.json({ domains: results })
}

export async function POST(request) {
  const { userId } = auth()
  if (!userId) {
    return Response.json({ error: 'Not signed in' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const domain = (body.domain || '').trim().toLowerCase()
  if (!domain) {
    return Response.json({ error: 'Missing domain' }, { status: 400 })
  }
  const records = await checkDomain(userId, domain)
  return Response.json({ domain, records })
}
