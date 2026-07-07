import { auth } from '@clerk/nextjs/server'
import { sql } from '../../../lib/db'
import { checkSsl } from '../../../lib/ssl'

// Runs an on-demand SSL check for one domain and stores the result.
// Kept separate from /api/domains so it's reusable by both the manual
// re-check button and the future Trigger.dev background cron.
//
// Uses node:tls via lib/ssl, so this route must stay on the Node runtime
// (do not set runtime = 'edge').
export async function POST(request) {
  const { userId } = auth()
  if (!userId) {
    return Response.json({ error: 'Not signed in' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const id = body.id
  const rawDomain = (body.domain || '').trim().toLowerCase()

  // Resolve the target row, scoped to the signed-in user so nobody can
  // trigger checks against — or read — someone else's domains.
  let target
  if (id != null && id !== '') {
    const rows = await sql`
      SELECT id, domain FROM domains
      WHERE user_id = ${userId} AND id = ${id}
      LIMIT 1
    `
    target = rows[0]
  } else if (rawDomain) {
    const rows = await sql`
      SELECT id, domain FROM domains
      WHERE user_id = ${userId} AND domain = ${rawDomain}
      LIMIT 1
    `
    target = rows[0]
  } else {
    return Response.json({ error: 'Missing id or domain' }, { status: 400 })
  }

  if (!target) {
    return Response.json({ error: 'Domain not found' }, { status: 404 })
  }

  // Free TLS handshake — always resolves, even on failure.
  const ssl = await checkSsl(target.domain)

  const rows = await sql`
    UPDATE domains
    SET ssl_valid_from = ${ssl.ssl_valid_from},
        ssl_valid_to   = ${ssl.ssl_valid_to},
        ssl_issuer     = ${ssl.ssl_issuer},
        ssl_authorized = ${ssl.ssl_authorized},
        ssl_error      = ${ssl.ssl_error},
        ssl_checked_at = now()
    WHERE user_id = ${userId} AND id = ${target.id}
    RETURNING id, domain, ssl_valid_from, ssl_valid_to, ssl_issuer, ssl_authorized, ssl_error, ssl_checked_at
  `

  return Response.json({ domain: rows[0] })
}
