'use client'

import { useState, useEffect, useRef } from 'react'

const statusColors = { ok: '#16a34a', warn: '#d97706', dead: '#dc2626' }
const badges = {
  ok:   { label: 'Healthy', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  warn: { label: 'Needs attention', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  dead: { label: 'Critical', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtMonth(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
function deriveStatus(expires) {
  if (!expires) return 'ok'
  const days = (new Date(expires) - new Date()) / 86400000
  if (days < 0) return 'dead'
  if (days < 60) return 'warn'
  return 'ok'
}
function sslView(row) {
  if (!row.ssl_checked_at) return { ssl: '—', sslStatus: 'neutral', sslIssuer: null }
  if (!row.ssl_valid_to) return { ssl: 'No cert', sslStatus: 'dead', sslIssuer: null }

  const days = (new Date(row.ssl_valid_to) - new Date()) / 86400000
  let sslStatus = 'ok'
  if (days < 0) sslStatus = 'dead'
  else if (!row.ssl_authorized) sslStatus = 'dead'
  else if (days < 21) sslStatus = 'warn'

  return { ssl: fmtDate(row.ssl_valid_to), sslStatus, sslIssuer: row.ssl_issuer || null }
}
function dnsView(changedTypes) {
  if (!changedTypes || changedTypes.length === 0) return { dns: 'No changes (7d)', dnsTone: 'ok' }
  const dnsTone = changedTypes.includes('NS') ? 'dead' : 'warn'
  return { dns: `${changedTypes.join(', ')} changed`, dnsTone }
}
function scoreTier(score) {
  if (score < 40) return 'dead'
  if (score < 80) return 'warn'
  return 'ok'
}
function toCard(row) {
  const dot = row.domain.lastIndexOf('.')
  const s = sslView(row)
  const d = dnsView(row.dns_changed_types)
  return {
    id: row.id,
    domain: row.domain,
    name: dot > 0 ? row.domain.slice(0, dot) : row.domain,
    tld: dot > 0 ? row.domain.slice(dot) : '',
    status: deriveStatus(row.expires_at),
    expiryDate: fmtDate(row.expires_at),
    registrar: row.registrar || '—',
    registered: fmtMonth(row.registered_at),
    ssl: s.ssl, sslStatus: s.sslStatus, sslIssuer: s.sslIssuer,
    dns: d.dns, dnsTone: d.dnsTone,
    score: row.health_score ?? 100,
    domainScore: row.health_domain_score ?? 100,
    sslScore: row.health_ssl_score ?? 100,
    dnsScore: row.health_dns_score ?? 100,
  }
}

function looksLikeDomain(v) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(v)
}

export default function Dashboard() {
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')
  const [registrarFilter, setRegistrarFilter] = useState('all')
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [refreshingId, setRefreshingId] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const sslCheckedRef = useRef(new Set())

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/domains')
      const json = await res.json()
      const rows = json.domains || []
      setDomains(rows.map(toCard))
      backfillSsl(rows)
    } catch (e) {}
    setLoading(false)
  }

  async function backfillSsl(rows) {
    const need = rows.filter(r => !r.ssl_checked_at && !sslCheckedRef.current.has(r.id))
    if (need.length === 0) return
    need.forEach(r => sslCheckedRef.current.add(r.id))
    await Promise.all(need.map(r =>
      fetch('/api/ssl-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: r.id }),
      }).catch(() => {})
    ))
    load()
  }

  useEffect(() => { load() }, [])

  function openModal() {
    setInput('')
    setError('')
    setModalOpen(true)
  }

  function closeModal() {
    if (adding) return
    setModalOpen(false)
  }

  useEffect(() => {
    if (modalOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 40)
      return () => clearTimeout(t)
    }
  }, [modalOpen])

  useEffect(() => {
    if (!modalOpen) return
    function onKey(e) { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, adding])

  async function submitDomain() {
    const domain = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (!domain) { setError('Enter a domain.'); return }
    if (!looksLikeDomain(domain)) { setError('That doesn’t look like a valid domain.'); return }

    setError('')
    setAdding(true)
    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error || 'Couldn’t add that domain. Try again.')
        setAdding(false)
        return
      }
      await load()
      setAdding(false)
      setModalOpen(false)
    } catch (e) {
      setError('Network error. Try again.')
      setAdding(false)
    }
  }

  async function deleteDomain(d) {
    const full = `${d.name}${d.tld}`
    if (!window.confirm(`Stop monitoring ${full}? This can’t be undone.`)) return

    setDeletingId(d.id)
    const prev = domains
    setDomains(domains.filter(x => x.id !== d.id))
    if (expanded === d.id) setExpanded(null)

    try {
      const res = await fetch('/api/domains', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: d.id, domain: full }),
      })
      if (!res.ok) {
        setDomains(prev)
        window.alert('Couldn’t remove that domain. Try again.')
      }
    } catch (e) {
      setDomains(prev)
      window.alert('Network error. Try again.')
    }
    setDeletingId(null)
  }

  // Forces a fresh WHOIS + SSL check for one domain. Re-uses the existing
  // POST /api/domains (WHOIS) and /api/ssl-check (TLS) routes — both
  // already upsert on the domain, so this is just re-running "add" and
  // "SSL check" against a domain that already exists.
  async function refreshDomain(d) {
    setRefreshingId(d.id)
    try {
      await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: d.domain }),
      })
      await fetch('/api/ssl-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: d.id }),
      })
      await load()
    } catch (e) {
      window.alert('Refresh failed. Try again.')
    }
    setRefreshingId(null)
  }

  const tldCounts = domains.reduce((acc, d) => {
    if (d.tld) acc[d.tld] = (acc[d.tld] || 0) + 1
    return acc
  }, {})
  const tlds = Object.keys(tldCounts).sort((a, b) => tldCounts[b] - tldCounts[a] || a.localeCompare(b))
  const filters = ['all', ...tlds, 'attention']

  const registrars = Array.from(
    new Set(domains.map(d => d.registrar).filter(r => r && r !== '—'))
  ).sort((a, b) => a.localeCompare(b))

  useEffect(() => {
    if (filter !== 'all' && filter !== 'attention' && !tlds.includes(filter)) {
      setFilter('all')
    }
    if (registrarFilter !== 'all' && !registrars.includes(registrarFilter)) {
      setRegistrarFilter('all')
    }
  }, [domains]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = domains.filter(d => {
    if (registrarFilter !== 'all' && d.registrar !== registrarFilter) return false
    if (filter === 'all') return true
    if (filter === 'attention') return d.score < 80
    return d.tld === filter
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 860, padding: '36px 24px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px', color: '#111' }}>Your domains</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Monitoring expiry, SSL &amp; DNS changes</div>
          </div>
          <button onClick={openModal} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginTop: 4 }}>
            + Add domain
          </button>
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28, alignItems: 'center' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: filter === f ? '#111' : '#e5e5e5', background: filter === f ? '#111' : '#fff', color: filter === f ? '#fff' : '#555', fontFamily: 'Inter, sans-serif' }}>
              {f === 'all' ? `All ${domains.length}` : f === 'attention' ? '⚠ Needs attention' : f}
            </button>
          ))}

          {registrars.length > 1 && (
            <select
              value={registrarFilter}
              onChange={e => setRegistrarFilter(e.target.value)}
              style={{ marginLeft: 'auto', height: 32, padding: '0 30px 0 12px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: registrarFilter !== 'all' ? '#111' : '#e5e5e5', background: `${registrarFilter !== 'all' ? '#111' : '#fff'} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='${registrarFilter !== 'all' ? '%23fff' : '%23999'}' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center`, color: registrarFilter !== 'all' ? '#fff' : '#555', fontFamily: 'Inter, sans-serif', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', outline: 'none' }}
            >
              <option value="all">All registrars</option>
              {registrars.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ height: 1, background: '#ebebeb', marginBottom: 28 }} />

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {filtered.map(d => {
            const isOpen = expanded === d.id
            const badge = badges[scoreTier(d.score)]
            const isRefreshing = refreshingId === d.id
            return (
              <div
                key={d.id}
                onClick={() => setExpanded(isOpen ? null : d.id)}
                style={{ border: '1px solid', borderColor: isOpen ? '#d4d4d4' : '#e8e8e8', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', background: '#fff', boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,.07)' : 'none', transition: 'box-shadow .15s, border-color .15s' }}
              >
                <div style={{ padding: '22px 20px 18px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.3px', color: '#111', marginBottom: 4 }}>
                    {d.name}<span style={{ color: '#aaa', fontWeight: 400 }}>{d.tld}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
                    {d.registrar} · Registered {d.registered}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>
                      {d.status === 'dead' ? `Expired ${d.expiryDate}` : `Expires ${d.expiryDate}`}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{d.score}</span>
                      {badge.label}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 11, color: '#ccc' }}>{isRefreshing ? 'Refreshing…' : 'Checked just now'}</div>
                    <div style={{ fontSize: 11, color: '#ccc', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</div>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ padding: '0 20px 20px' }}>
                    <div style={{ height: 1, background: '#f0f0f0', marginBottom: 14 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
                      {[
                        ['SSL cert', d.sslIssuer ? `${d.ssl} · ${d.sslIssuer}` : d.ssl, d.sslStatus],
                        ['Expiry date', d.expiryDate, d.status],
                        ['DNS records', d.dns, d.dnsTone],
                        ['Health score', `${d.score} / 100`, scoreTier(d.score)],
                      ].map(([lbl, val, st]) => (
                        <div key={lbl} style={{ padding: '8px 10px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                          <div style={{ fontSize: 10, color: '#bbb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{lbl}</div>
                          <div style={{ fontSize: 12.5, fontWeight: 500, color: st === 'neutral' ? '#333' : statusColors[st] || '#333' }}>{val}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                      {[['Domain', d.domainScore], ['SSL', d.sslScore], ['DNS', d.dnsScore]].map(([label, val]) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 42, fontSize: 10.5, color: '#999', flexShrink: 0 }}>{label}</span>
                          <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#f0f0f0', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${val}%`, background: statusColors[scoreTier(val)], borderRadius: 2 }} />
                          </div>
                          <span style={{ width: 24, textAlign: 'right', fontFamily: 'monospace', fontSize: 10.5, color: '#999' }}>{val}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <button
                        onClick={e => { e.stopPropagation(); refreshDomain(d) }}
                        disabled={isRefreshing}
                        style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', fontSize: 12.5, fontWeight: 500, cursor: isRefreshing ? 'default' : 'pointer', fontFamily: 'Inter, sans-serif', color: '#444', opacity: isRefreshing ? 0.5 : 1 }}
                      >
                        {isRefreshing ? 'Refreshing…' : '↻ Refresh'}
                      </button>
                      <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', color: '#444' }}>Edit alerts</button>
                      <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: '#111', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', color: '#fff' }}>Renew ↗</button>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteDomain(d) }}
                      disabled={deletingId === d.id}
                      style={{ width: '100%', marginTop: 8, padding: '8px', borderRadius: 8, border: '1px solid #f0f0f0', background: '#fff', fontSize: 12.5, fontWeight: 500, cursor: deletingId === d.id ? 'default' : 'pointer', fontFamily: 'Inter, sans-serif', color: '#dc2626', opacity: deletingId === d.id ? 0.5 : 1 }}
                    >
                      {deletingId === d.id ? 'Removing…' : 'Remove domain'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {/* Add card */}
          <div
            onClick={openModal}
            style={{ border: '1px dashed #e5e5e5', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32, cursor: 'pointer', background: '#fff', minHeight: 160 }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <div style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 18 }}>+</div>
            <div style={{ fontSize: 12, color: '#ccc', fontWeight: 500 }}>Add a domain</div>
          </div>
        </div>

        {loading && <div style={{ fontSize: 13, color: '#aaa', marginTop: 20 }}>Loading…</div>}
      </div>

      {/* Add-domain modal */}
      {modalOpen && (
        <div
          onClick={closeModal}
          style={{ position: 'fixed', inset: 0, background: 'rgba(17,17,17,.32)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 400, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,.14)', padding: 24, fontFamily: 'Inter, sans-serif' }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.3px', color: '#111', marginBottom: 4 }}>Add a domain</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 18 }}>We’ll look it up and start tracking its expiry.</div>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); if (error) setError('') }}
              onKeyDown={e => { if (e.key === 'Enter' && !adding) submitDomain() }}
              placeholder="example.com"
              disabled={adding}
              style={{ width: '100%', height: 44, padding: '0 14px', border: '1px solid', borderColor: error ? '#fca5a5' : '#e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#111', outline: 'none', background: adding ? '#fafafa' : '#fff' }}
            />

            {error && (
              <div style={{ fontSize: 12.5, color: '#dc2626', marginTop: 8 }}>{error}</div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button
                onClick={closeModal}
                disabled={adding}
                style={{ flex: 1, height: 42, borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 13.5, fontWeight: 500, cursor: adding ? 'default' : 'pointer', fontFamily: 'Inter, sans-serif', color: '#555', opacity: adding ? 0.5 : 1 }}
              >
                Cancel
              </button>
              <button
                onClick={submitDomain}
                disabled={adding}
                style={{ flex: 1, height: 42, borderRadius: 10, border: 'none', background: '#111', fontSize: 13.5, fontWeight: 500, cursor: adding ? 'default' : 'pointer', fontFamily: 'Inter, sans-serif', color: '#fff', opacity: adding ? 0.7 : 1 }}
              >
                {adding ? 'Adding…' : 'Add domain'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
