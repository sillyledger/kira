// app/api/domains/route.js

import { auth } from '@clerk/nextjs/server'
import { sql } from '../../../lib/db'
import { computeHealthScore } from '../../../lib/health-score'
import { fallbackExpires, fallbackCreated, fallbackRegistrar } from '../../../lib/whois-fallback'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return Response.json({ error: 'Not signed in' }, { status: 401 })
  }

  const rows = await sql`
    SELECT id, domain, registrar, registered_at, expires_at, last_checked, raw,
           ssl_valid_from, ssl_valid_to, ssl_issuer, ssl_authorized, ssl_error, ssl_checked_at
    FROM domains
    WHERE user_id = ${userId}
    ORDER BY expires_at ASC NULLS LAST
  `

  // Cached-only DNS drift summary — reads whatever /api/dns-records last
  // stored in dns_records. Does NOT trigger a live DNS lookup, so this
  // stays fast regardless of how many domains the user has. One query
  // covers every domain at once.
  //
  // 7 days must match the window in app/(app)/dns-records/page.js
  // (isChangedRecently) — keep these in sync if either changes.
  const dnsRows = await sql`
    SELECT domain, record_type, changed_at
    FROM dns_records
    WHERE user_id = ${userId}
      AND changed_at IS NOT NULL
      AND changed_at > now() - interval '7 days'
  `

  const dnsByDomain = {}
  for (const r of dnsRows) {
    if (!dnsByDomain[r.domain]) dnsByDomain[r.domain] = []
    dnsByDomain[r.domain].push(r.record_type)
  }

  const domains = rows.map((row) => {
    const dnsChangedTypes = dnsByDomain[row.domain] || []
    const health = computeHealthScore(row, dnsChangedTypes)
    return {
      ...row,
      dns_changed_types: dnsChangedTypes,
      health_score: health.score,
      health_domain_score: health.domainScore,
      health_ssl_score: health.sslScore,
      health_dns_score: health.dnsScore,
      health_worst_signal: health.worstSignal,
    }
  })

  return Response.json({ domains })
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

  // WhoisJSON's normalizer doesn't cover every registry equally — fall
  // back to regex-extracting these from the raw WHOIS text when the
  // structured field comes back empty. See lib/whois-fallback.js for
  // which registries this currently covers.
  const registrar = fallbackRegistrar(data)
  const registeredAt = fallbackCreated(data)
  const expiresAt = fallbackExpires(data)

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
