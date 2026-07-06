import tls from 'node:tls'

// Reads a domain's live SSL certificate by opening a TLS connection to
// port 443 and inspecting whatever the server presents in the handshake.
// No third-party API, no cost — the cert is handed over for free.
//
// rejectUnauthorized is false ON PURPOSE: we still want to read expired,
// self-signed, or mismatched certs so we can *report* them, rather than
// throwing. Validity is captured separately via `authorized`.
//
// Always resolves (never rejects) with a plain object shaped to the
// domains table's ssl_* columns, so the caller can store the result
// whether the check succeeded or failed.
export function checkSsl(rawDomain, { timeout = 8000 } = {}) {
  const host = String(rawDomain || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/:.*$/, '')

  const fail = (error) => ({
    ssl_valid_from: null,
    ssl_valid_to: null,
    ssl_issuer: null,
    ssl_authorized: false,
    ssl_error: error,
  })

  return new Promise((resolve) => {
    if (!host) {
      resolve(fail('No domain provided'))
      return
    }

    let settled = false
    const done = (result) => {
      if (settled) return
      settled = true
      try { socket.destroy() } catch (e) {}
      resolve(result)
    }

    const socket = tls.connect({
      host,
      port: 443,
      servername: host, // SNI — required or shared hosts hand back the wrong cert
      rejectUnauthorized: false,
      timeout,
    })

    socket.once('secureConnect', () => {
      const cert = socket.getPeerCertificate()

      if (!cert || Object.keys(cert).length === 0) {
        done(fail('No certificate returned'))
        return
      }

      const from = cert.valid_from ? new Date(cert.valid_from) : null
      const to = cert.valid_to ? new Date(cert.valid_to) : null
      const issuer = cert.issuer?.O || cert.issuer?.CN || null

      done({
        ssl_valid_from: from && !isNaN(from) ? from.toISOString() : null,
        ssl_valid_to: to && !isNaN(to) ? to.toISOString() : null,
        ssl_issuer: issuer,
        ssl_authorized: socket.authorized === true,
        // When the chain doesn't validate (expired, self-signed, hostname
        // mismatch...) we keep the cert data above but record why here.
        ssl_error: socket.authorized ? null : (socket.authorizationError ? String(socket.authorizationError) : 'Certificate not trusted'),
      })
    })

    socket.once('timeout', () => done(fail('Connection timed out')))

    socket.once('error', (err) => {
      // Common shapes: ECONNREFUSED (no 443), ENOTFOUND (bad domain),
      // ECONNRESET, etc. Store the code so the UI can show something useful.
      const code = err?.code || err?.message || 'Connection failed'
      done(fail(String(code)))
    })
  })
}
