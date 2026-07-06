import { auth } from '@clerk/nextjs/server'
import { sql } from '../../../lib/db'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return Response.json({ error: 'Not signed in' }, { status: 401 })
  }

  const rows = await sql`
    SELECT id, domain, registrar, registered_at, expires_at, last_checked, raw
    FROM domains
    WHERE user_id = ${userId}
    ORDER BY expires_at ASC NULLS LAST
  `

  return Response.json({ domains: rows })
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

  const apiKey = process.env.WHOISJSON_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'WHOISJSON_API_KEY is not set' }, { status: 500 })
  }

  let data
  try {
    const res = await fetch(
      `https://whoisjson.com/api/v1/whois?domain=${encodeURIComponent(domain)}`,
      { headers: { Authorization: `TOKEN=${apiKey}` }, cache: 'no-store' }
    )
    if (!res.ok) {
      return Response.json({ error: 'WHOIS lookup failed', status: res.status }, { status: 502 })
    }
    data = await res.json()
  } catch (err) {
    return Response.json({ error: 'WHOIS request error', detail: String(err) }, { status: 502 })
  }

  const registrar = data?.registrar?.name || null
  const registeredAt = data?.created || null
  const expiresAt = data?.expires || null

  const rows = await sql`
    INSERT INTO domains (user_id, domain, registrar, registered_at, expires_at, last_checked, raw)
    VALUES (${userId}, ${domain}, ${registrar}, ${registeredAt}, ${expiresAt}, now(), ${JSON.stringify(data)}::jsonb)
    ON CONFLICT (user_id, domain)
    DO UPDATE SET registrar = EXCLUDED.registrar,
                  registered_at = EXCLUDED.registered_at,
                  expires_at = EXCLUDED.expires_at,
                  last_checked = now(),
                  raw = EXCLUDED.raw
    RETURNING id, domain, registrar, registered_at, expires_at, last_checked, raw
  `

  return Response.json({ domain: rows[0] })
}

export async function DELETE(request) {
  const { userId } = auth()
  if (!userId) {
    return Response.json({ error: 'Not signed in' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const id = body.id
  const domain = (body.domain || '').trim().toLowerCase()

  // Delete by id when we have it (precise), otherwise fall back to domain.
  // Either way it's scoped to the signed-in user, so nobody can delete
  // someone else's rows.
  let rows
  if (id != null && id !== '') {
    rows = await sql`
      DELETE FROM domains
      WHERE user_id = ${userId} AND id = ${id}
      RETURNING id
    `
  } else if (domain) {
    rows = await sql`
      DELETE FROM domains
      WHERE user_id = ${userId} AND domain = ${domain}
      RETURNING id
    `
  } else {
    return Response.json({ error: 'Missing id or domain' }, { status: 400 })
  }

  if (rows.length === 0) {
    return Response.json({ error: 'Domain not found' }, { status: 404 })
  }

  return Response.json({ deleted: rows[0].id })
}
