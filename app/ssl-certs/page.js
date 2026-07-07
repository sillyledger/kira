'use client'

import { useState, useEffect } from 'react'

const badges = {
  ok:      { label: 'Valid',    bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  warn:    { label: 'Expiring', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  dead:    { label: 'Issue',    bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  neutral: { label: 'Checking…', bg: '#f5f5f5', color: '#999', border: '#e5e5e5' },
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function sslView(row) {
  const dot = row.domain.lastIndexOf('.')
  const name = dot > 0 ? row.domain.slice(0, dot) : row.domain
  const tld = dot > 0 ? row.domain.slice(dot) : ''

  if (!row.ssl_checked_at) {
    return { name, tld, status: 'neutral', label: 'Checking…', expires: '—', sub: 'Not checked yet', subError: false, daysText: '' }
  }
  if (!row.ssl_valid_to) {
    return { name, tld, status: 'dead', label: 'No cert', expires: '—', sub: row.ssl_error || 'No certificate', subError: true, daysText: 'not reachable' }
  }

  const days = Math.floor((new Date(row.ssl_valid_to) - new Date()) / 86400000)
  let status = 'ok'
  let label = 'Valid'
  if (days < 0) { status = 'dead'; label = 'Expired' }
  else if (!row.ssl_authorized) { status = 'dead'; label = 'Invalid' }
  else if (days < 21) { status = 'warn'; label = 'Expiring' }

  const daysText = days < 0 ? `expired ${Math.abs(days)} days ago` : `${days} days left`
  return {
    name, tld, status, label,
    expires: fmtDate(row.ssl_valid_to),
    sub: row.ssl_issuer || 'Unknown issuer',
    subError: false,
    daysText,
  }
}

const filters = [
  ['all', 'All'],
  ['ok', 'Valid'],
  ['warn', '⚠ Expiring'],
  ['dead', 'Issues'],
]

export default function SslCerts() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [rechecking, setRechecking] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/domains')
      const json = await res.json()
      setRows(json.domains || [])
    } catch (e) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function recheckAll() {
    setRechecking(true)
    try {
      await Promise.all(rows.map(r =>
        fetch('/api/ssl-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: r.id }),
        }).catch(() => {})
      ))
      await load()
    } catch (e) {}
    setRechecking(false)
  }

  const views = rows.map(sslView)
  const shown = views.filter(v => filter === 'all' ? true : v.status === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 860, padding: '36px 24px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px', color: '#111' }}>SSL certificates</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Certificate expiry, issuer and chain validity across your domains</div>
          </div>
          <button onClick={recheckAll} disabled={rechecking || rows.length === 0} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: rechecking ? 'default' : 'pointer', fontFamily: 'Inter, sans-serif', marginTop: 4, opacity: (rechecking || rows.length === 0) ? 0.6 : 1 }}>
            {rechecking ? 'Checking…' : 'Re-check all'}
          </button>
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {filters.map(([key, label]) => {
            const count = key === 'all' ? views.length : views.filter(v => v.status === key).length
            return (
              <button key={key} onClick={() => setFilter(key)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: filter === key ? '#111' : '#e5e5e5', background: filter === key ? '#111' : '#fff', color: filter === key ? '#fff' : '#555', fontFamily: 'Inter, sans-serif' }}>
                {key === 'all' ? `All ${count}` : label}
              </button>
            )
          })}
        </div>

        {/* List */}
        <div style={{ border: '1px solid #e8e8e8', borderRadius: 14, overflow: 'hidden' }}>
          {shown.map((v, i) => {
            const badge = badges[v.status]
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < shown.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-.2px', color: '#111' }}>
                    {v.name}<span style={{ color: '#aaa', fontWeight: 400 }}>{v.tld}</span>
                  </div>
                  <div style={{ fontSize: 12, color: v.subError ? '#c0392b' : '#999', marginTop: 2 }}>{v.sub}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: v.expires === '—' ? '#bbb' : '#111', fontWeight: 500 }}>
                    {v.expires === '—' ? '—' : `Expires ${v.expires}`}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#aaa', marginTop: 2 }}>{v.daysText}</div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, padding: '4px 9px', borderRadius: 20, background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color, whiteSpace: 'nowrap' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: badge.color }} />
                  {v.label}
                </div>
              </div>
            )
          })}

          {!loading && shown.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: 13, color: '#aaa' }}>
              {rows.length === 0 ? 'No domains yet — add some on the dashboard.' : 'Nothing in this filter.'}
            </div>
          )}
        </div>

        {loading && <div style={{ fontSize: 13, color: '#aaa', marginTop: 20 }}>Loading…</div>}
      </div>
    </div>
  )
}
