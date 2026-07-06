'use client'

import { useState, useEffect, useRef } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'

const statusColors = { ok: '#16a34a', warn: '#d97706', dead: '#dc2626' }
const badges = {
  ok:   { label: 'Healthy', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  warn: { label: 'Expiring', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  dead: { label: 'Expired', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
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
function toCard(row) {
  const dot = row.domain.lastIndexOf('.')
  return {
    id: row.id,
    name: dot > 0 ? row.domain.slice(0, dot) : row.domain,
    tld: dot > 0 ? row.domain.slice(dot) : '',
    status: deriveStatus(row.expires_at),
    expiryDate: fmtDate(row.expires_at),
    registrar: row.registrar || '—',
    registered: fmtMonth(row.registered_at),
    ssl: '—', sslStatus: 'ok', dns: '—', autoRenew: null,
  }
}

// very light client-side sanity check — the real validation is WhoisJSON on the server
function looksLikeDomain(v) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(v)
}

export default function Dashboard() {
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const { user } = useUser()

  // ── modal state ───────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/domains')
      const json = await res.json()
      setDomains((json.domains || []).map(toCard))
    } catch (e) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openModal() {
    setInput('')
    setError('')
    setModalOpen(true)
  }

  function closeModal() {
    if (adding) return // don't let them bail mid-request
    setModalOpen(false)
  }

  // focus the field when the modal opens
  useEffect(() => {
    if (modalOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 40)
      return () => clearTimeout(t)
    }
  }, [modalOpen])

  // Esc to close
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
    // optimistic remove — drop it from the UI immediately
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
        setDomains(prev) // roll back on failure
        window.alert('Couldn’t remove that domain. Try again.')
      }
    } catch (e) {
      setDomains(prev)
      window.alert('Network error. Try again.')
    }
    setDeletingId(null)
  }

  const filters = ['all', '.com', '.so', '.space', 'expiring']

  const filtered = domains.filter(d => {
    if (filter === 'all') return true
    if (filter === 'expiring') return d.status === 'warn'
    return d.tld === filter
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#fff' }}>

      {/* Sidebar */}
      <div style={{ background: '#fff', borderRight: '1px solid #ebebeb', padding: '16px 0', display: 'flex', flexDirection: 'column' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 16px 16px', borderBottom: '1px solid #ebebeb' }}>
          <div style={{ width: 28, height: 28, background: '#111', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>K</div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#111', letterSpacing: '-.3px' }}>Kira</span>
        </div>

        {/* Nav */}
        <div style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>

          {/* Monitor section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px', marginBottom: 2 }}>
            <span style={{ fontSize: 15 }}>◫</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '.06em', textTransform: 'uppercase' }}>Monitor</span>
          </div>
          <div style={{ borderLeft: '2px solid #f0f0f0', marginLeft: 19, paddingLeft: 14, marginBottom: 10 }}>
            {[['Domains', true, String(domains.length)], ['SSL Certs', false, null], ['DNS Records', false, null]].map(([name, active, count]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 6, fontSize: 13.5, color: active ? '#111' : '#555', fontWeight: active ? 500 : 400, background: active ? '#f5f5f5' : 'transparent', marginBottom: 1, cursor: 'pointer' }}>
                {name}
                {count && <span style={{ fontSize: 10.5, background: '#f0f0f0', color: '#999', padding: '1px 6px', borderRadius: 8, fontWeight: 500 }}>{count}</span>}
              </div>
            ))}
          </div>

          {/* Alerts section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px', marginBottom: 2 }}>
            <span style={{ fontSize: 15 }}>◎</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '.06em', textTransform: 'uppercase' }}>Alerts</span>
          </div>
          <div style={{ borderLeft: '2px solid #f0f0f0', marginLeft: 19, paddingLeft: 14, marginBottom: 10 }}>
            {[['Notifications', false, true], ['History', false, false]].map(([name, active, dot]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 6, fontSize: 13.5, color: active ? '#111' : '#555', fontWeight: active ? 500 : 400, background: active ? '#f5f5f5' : 'transparent', marginBottom: 1, cursor: 'pointer' }}>
                {name}
                {dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />}
              </div>
            ))}
          </div>

          {/* Account section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px', marginBottom: 2 }}>
            <span style={{ fontSize: 15 }}>◉</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '.06em', textTransform: 'uppercase' }}>Account</span>
          </div>
          <div style={{ borderLeft: '1.5px solid #ebebeb', marginLeft: 15, paddingLeft: 12 }}>
            {['Settings', 'Billing'].map(name => (
              <div key={name} style={{ padding: '6px 8px', borderRadius: 6, fontSize: 13.5, color: '#555', marginBottom: 1, cursor: 'pointer' }}>
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid #ebebeb', display: 'flex', alignItems: 'center', gap: 9 }}>
          <UserButton afterSignOutUrl="/" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{user?.firstName || user?.fullName || 'Account'}</div>
            <div style={{ fontSize: 11, color: '#999' }}>Free plan</div>
          </div>
        </div>
      </div>

      {/* Main */}
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
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: filter === f ? '#111' : '#e5e5e5', background: filter === f ? '#111' : '#fff', color: filter === f ? '#fff' : '#555', fontFamily: 'Inter, sans-serif' }}>
                {f === 'all' ? `All ${domains.length}` : f === 'expiring' ? '⚠ Expiring' : f}
              </button>
            ))}
          </div>

          <div style={{ height: 1, background: '#ebebeb', marginBottom: 28 }} />

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {filtered.map(d => {
              const isOpen = expanded === d.id
              const badge = badges[d.status]
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
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 20, background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: badge.color }} />
                        {badge.label}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 11, color: '#ccc' }}>Checked just now</div>
                      <div style={{ fontSize: 11, color: '#ccc', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</div>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ padding: '0 20px 20px' }}>
                      <div style={{ height: 1, background: '#f0f0f0', marginBottom: 14 }} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
                        {[
                          ['SSL cert', d.ssl, d.sslStatus],
                          ['Expiry date', d.expiryDate, d.status],
                          ['DNS changes', d.dns, 'neutral'],
                          ['Auto-renew', d.autoRenew === null ? '—' : d.autoRenew ? 'On' : 'Off', 'neutral'],
                        ].map(([lbl, val, st]) => (
                          <div key={lbl} style={{ padding: '8px 10px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                            <div style={{ fontSize: 10, color: '#bbb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{lbl}</div>
                            <div style={{ fontSize: 12.5, fontWeight: 500, color: st === 'neutral' ? '#333' : statusColors[st] || '#333' }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
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
      </div>

      {/* ── Add-domain modal ──────────────────────────────────────── */}
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
