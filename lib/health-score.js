// lib/health-score.js
//
// Composite 0-100 health score per domain, built from three signals:
// domain expiry, SSL certificate validity, and DNS record stability.
// A single weak signal pulls the whole score down rather than being
// averaged away — matches the "worst problem, not average" FAQ copy
// on the landing page.

const DOMAIN_WARN_DAYS = 60
const SSL_WARN_DAYS = 21

function scoreDomain(expiresAt) {
  if (!expiresAt) return 100 // no WHOIS expiry data yet — don't penalize
  const days = (new Date(expiresAt).getTime() - Date.now()) / 86400000
  if (days < 0) return 0
  if (days < DOMAIN_WARN_DAYS) return Math.round(40 + (days / DOMAIN_WARN_DAYS) * 60)
  return 100
}

function scoreSsl({ ssl_checked_at, ssl_valid_to, ssl_authorized, ssl_error }) {
  if (!ssl_checked_at) return 100 // not checked yet — don't penalize
  if (!ssl_valid_to || ssl_authorized === false || ssl_error) return 0
  const days = (new Date(ssl_valid_to).getTime() - Date.now()) / 86400000
  if (days < 0) return 0
  if (days < SSL_WARN_DAYS) return Math.round(40 + (days / SSL_WARN_DAYS) * 60)
  return 100
}

function scoreDns(dnsChangedTypes) {
  if (!dnsChangedTypes || dnsChangedTypes.length === 0) return 100
  if (dnsChangedTypes.includes('NS')) return 40 // most severe — matches the red-flagged border on the DNS page
  return 70
}

function composite(domainScore, sslScore, dnsScore) {
  const min = Math.min(domainScore, sslScore, dnsScore)
  const avg = (domainScore + sslScore + dnsScore) / 3
  return Math.round(min * 0.7 + avg * 0.3)
}

// domainRow: a row from the `domains` table (expires_at, ssl_* columns)
// dnsChangedTypes: array of record types changed in the last 7 days, e.g. ['NS', 'MX']
export function computeHealthScore(domainRow, dnsChangedTypes) {
  const domainScore = scoreDomain(domainRow.expires_at)
  const sslScore = scoreSsl(domainRow)
  const dnsScore = scoreDns(dnsChangedTypes)
  const score = composite(domainScore, sslScore, dnsScore)

  const signals = { domain: domainScore, ssl: sslScore, dns: dnsScore }
  const worstSignal = Object.keys(signals).reduce((a, b) => (signals[a] <= signals[b] ? a : b))

  return { score, domainScore, sslScore, dnsScore, worstSignal }
}
