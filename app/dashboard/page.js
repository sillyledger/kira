'use client'

import { useState } from 'react'

const domains = [
  {
    id: 1,
    name: 'aegosintel',
    tld: '.com',
    status: 'ok',
    expiryDate: 'May 21, 2028',
    registrar: 'Spaceship',
    registered: 'May 2026',
    ssl: '312 days left',
    sslStatus: 'ok',
    dns: 'Never',
    autoRenew: true,
  },
  {
    id: 2,
    name: 'two',
    tld: '.so',
    status: 'warn',
    expiryDate: 'Jun 26, 2026',
    registrar: 'Namecheap',
    registered: 'Sep 2023',
    ssl: '66 days left',
    sslStatus: 'warn',
    dns: '3 days ago',
    autoRenew: false,
  },
  {
    id: 3,
    name: 'sorano',
    tld: '.space',
    status: 'ok',
    expiryDate: 'Mar 8, 2027',
    registrar: 'Porkbun',
    registered: 'Mar 2025',
    ssl: '201 days left',
    sslStatus: 'ok',
    dns: 'Never',
    autoRenew: true,
  },
  {
    id: 4,
    name: 'tenkaro',
    tld: '.com',
    status: 'ok',
    expiryDate: 'Jun 1, 2027',
    registrar: 'Porkbun',
    registered: 'Jun 2025',
    ssl: '178 days left',
    sslStatus: 'ok',
    dns: 'Never',
    autoRenew: true,
  },
  {
    id: 5,
    name: 'strevius',
    tld: '.com',
    status: 'dead',
    expiryDate: 'Jun 3, 2026',
    registrar: 'GoDaddy',
    registered: 'Jun 2024',
    ssl: 'Expired',
    sslStatus: 'dead',
    dns: 'Unknown',
    autoRenew: false,
  },
]

const statusColors = { ok: '#16a34a', warn: '#d97706', dead: '#dc2626' }
const badges = {
  ok:   { label: 'Healthy', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  warn: { label: 'Expiring', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  dead: { label: 'Expired', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
}
const expiryText = {
  ok:   { color: '#888' },
  warn: { color: '#d97706', fontWeight: 500 },
  dead: { color: '#dc2626', fontWeight: 500 },
}

const S = {
  shell: { display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  sidebar: { background: '#fff', borderRight: '1px solid #ebebeb', padding: '20px 0', display: 'flex', flexDirection: 'column' },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 18px', borderBottom: '1px solid #ebebeb' },
  logoMark: { width: 24, height: 24, background: '#111', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 },
  logoText: { fontSize: 13, fontWeight: 600, letterSpacing: '-.3px', color: '#111' },
  navSection: { padding: '12px 8px', flex: 1 },
  navLabel: { fontSize: 10, fontWeight: 500, color: '#bbb', letterSpacing: '.07em', textTransform: 'uppercase', padding: '0 8px', margin: '12px 0 3px' },
  navItem: (active) => ({ display: 'flex', alignItems: 'center', padding: '6px 8px', borderRadius: 6, fontSize: 12.5, color: active ? '#111' : '#666', fontWeight: active ? 500 : 400, background: active ? '#f5f5f5' : 'transparent', marginBottom: 1, cursor: 'pointer' }),
  sidebarFoot: { padding: '12px 14px', borderTop: '1px solid #ebebeb', display: 'flex', alignItems: 'center', gap: 8 },
  avatar: { width: 22, height: 22, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#fff', fontWeight: 600 },
}

export default function Dashboard() {
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')

  const filters = ['all', '.com', '.so', '.space', 'expiring']

  const filtered = domains.filter(d => {
    if (filter === 'all') return true
    if (filter === 'expiring') return d.status === 'warn'
    return d.tld === filter
  })

  return (
    <div style={S.shell}>

      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.logoWrap}>
          <div style={S.logoMark}>T</div>
          <span style={S.logoText}>Tenkaro</span>
        </div>
        <div style={S.navSection}>
          {[
            ['Monitor', [['Domains', true], ['SSL Certs', false], ['DNS Records', false]]],
            ['Alerts',  [['Notifications', false], ['History', false]]],
            ['Account', [['Settings', false], ['Billing', false]]],
          ].map(([label, items]) => (
            <div key={label}>
              <div style={S.navLabel}>{label}</div>
              {items.map(([name, active]) => (
                <div key={name} style={S.navItem(active)}>
                  {name}
                  {name === 'Domains' && <span style={{ marginLeft: 'auto', fontSize: 10, background: '#f0f0f0', color: '#999', padding: '1px 6px', borderRadius: 8 }}>5</span>}
                  {name === 'Notifications' && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={S.sidebarFoot}>
          <div style={S.avatar}>P</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#111' }}>Pieter</div>
            <div style={{ fontSize: 10, color: '#bbb' }}>Free · 5/5 domains</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>

        {/* Header */}
        <div style={{ padding: '28px 36px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px', color: '#111' }}>Your domains</div>
              <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 3, marginBottom: 20 }}>Monitoring expiry, SSL &amp; DNS changes</div>
            </div>
            <button style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginTop: 4 }}>
              + Add domain
            </button>
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: filter === f ? '#111' : '#e5e5e5', background: filter === f ? '#111' : '#fff', color: filter === f ? '#fff' : '#777', fontFamily: 'Inter, sans-serif' }}>
                {f === 'all' ? `All ${domains.length}` : f === 'expiring' ? '⚠ Expiring' : f}
              </button>
            ))}
          </div>

          <div style={{ height: 1, background: '#ebebeb', marginLeft: -36, marginRight: -36 }} />
        </div>

        {/* Grid */}
        <div style={{ padding: '24px 36px', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {filtered.map(d => {
              const isOpen = expanded === d.id
              const badge = badges[d.status]
              const sc = statusColors[d.status]
              const et = expiryText[d.status]
              return (
                <div
                  key={d.id}
                  onClick={() => setExpanded(isOpen ? null : d.id)}
                  style={{ border: '1px solid', borderColor: isOpen ? '#d0d0d0' : '#e8e8e8', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', background: '#fff', boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,.08)' : 'none', transition: 'box-shadow .15s, border-color .15s' }}
                >
                  {/* Status bar */}
                  <div style={{ height: 3, background: sc }} />

                  {/* Card body */}
                  <div style={{ padding: '16px 16px 14px' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.3px', color: '#111', marginBottom: 3 }}>
                      {d.name}<span style={{ color: '#bbb', fontWeight: 400 }}>{d.tld}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#bbb', marginBottom: 12 }}>
                      {d.registrar} · Registered {d.registered}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ fontSize: 12, ...et }}>
                        {d.status === 'dead' ? `Expired ${d.expiryDate}` : `Expires ${d.expiryDate}`}
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: badge.color }} />
                        {badge.label}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 11, color: '#ddd' }}>Checked 2h ago</div>
                      <div style={{ fontSize: 11, color: '#ccc', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isOpen && (
                    <div style={{ padding: '0 16px 16px' }}>
                      <div style={{ height: 1, background: '#f5f5f5', marginBottom: 12 }} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                        {[
                          ['SSL cert', d.ssl, d.sslStatus],
                          ['Expiry date', d.expiryDate, d.status],
                          ['DNS changes', d.dns, 'neutral'],
                          ['Auto-renew', d.autoRenew ? 'On' : 'Off', d.autoRenew ? 'ok' : 'dead'],
                        ].map(([lbl, val, st]) => (
                          <div key={lbl} style={{ padding: '7px 9px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                            <div style={{ fontSize: 9.5, color: '#bbb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{lbl}</div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: st === 'neutral' ? '#333' : statusColors[st] || '#333' }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 7 }}>
                        <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', color: '#555' }}>Edit alerts</button>
                        <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: '#111', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', color: '#fff' }}>Renew ↗</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Add card */}
            <div style={{ border: '1px dashed #e5e5e5', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32, cursor: 'pointer', background: '#fff', minHeight: 140 }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 18 }}>+</div>
              <div style={{ fontSize: 12, color: '#ccc', fontWeight: 500 }}>Add a domain</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
