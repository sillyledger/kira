// lib/whois-fallback.js
//
// WhoisJSON normalizes structured fields per-registry, but its parser
// doesn't cover every registry's raw WHOIS text equally well. Confirmed
// gaps so far: TWNIC (.tw) returns null for expires/created even though
// the raw text has "Record expires/created on ..." lines; Afilias (.so)
// returns null for registrar even though the raw text has "Registrar: ...".
//
// These functions re-derive the missing field from data.rawdata[0] when
// the normalized field is empty. Used by the WHOIS route today — keep
// new TLD gaps patched here, not duplicated inline, so Trigger.dev's
// future background WHOIS sweep gets the same coverage for free.

function rawText(data) {
  return Array.isArray(data?.rawdata) ? data.rawdata[0] || '' : ''
}

// "2027-02-17 11:51:21" + "+8"  ->  "2027-02-17T11:51:21+08:00"
function twnicDate(m) {
  const sign = m[2][0]
  const hours = m[2].slice(1).padStart(2, '0')
  return `${m[1].replace(' ', 'T')}${sign}${hours}:00`
}

const EXPIRY_PATTERNS = [
  // TWNIC (.tw): "Record expires on 2027-02-17 11:51:21 (UTC+8)"
  { regex: /Record expires on (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \(UTC([+-]\d+)\)/, parse: twnicDate },
  // Generic ICANN gTLD fallback, in case `expires` is ever null elsewhere
  { regex: /Registry Expiry Date:\s*(\S+)/, parse: (m) => m[1] },
]

const CREATED_PATTERNS = [
  { regex: /Record created on (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \(UTC([+-]\d+)\)/, parse: twnicDate },
  { regex: /Creation Date:\s*(\S+)/, parse: (m) => m[1] },
]

// Matches "Registrar:" itself only — not "Registrar WHOIS Server:",
// "Registrar IANA ID:", etc., which all have a word between "Registrar"
// and the colon.
const REGISTRAR_PATTERNS = [
  /^Registrar:\s*(.+)$/m,
  /^Registration Service Provider:\s*(.+)$/m,
]

function extractDate(patterns, text) {
  for (const { regex, parse } of patterns) {
    const m = text.match(regex)
    if (m) {
      try { return parse(m) } catch { continue }
    }
  }
  return null
}

export function fallbackExpires(data) {
  if (data?.expires) return data.expires
  const text = rawText(data)
  return text ? extractDate(EXPIRY_PATTERNS, text) : null
}

export function fallbackCreated(data) {
  if (data?.created) return data.created
  const text = rawText(data)
  return text ? extractDate(CREATED_PATTERNS, text) : null
}

export function fallbackRegistrar(data) {
  if (data?.registrar?.name) return data.registrar.name
  const text = rawText(data)
  if (!text) return null
  for (const regex of REGISTRAR_PATTERNS) {
    const m = text.match(regex)
    if (m) return m[1].trim()
  }
  return null
}
