'use client'

import { useState } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'

const domains = [
  { id: 1, name: 'aegosintel', tld: '.com', status: 'ok', expiryDate: 'May 21, 2028', registrar: 'Spaceship', registered: 'May 2026', ssl: '312 days left', sslStatus: 'ok', dns: 'Never', autoRenew: true },
  { id: 2, name: 'two', tld: '.so', status: 'warn', expiryDate: 'Jun 26, 2026', registrar: 'Namecheap', registered: 'Sep 2023', ssl: '66 days left', sslStatus: 'warn', dns: '3 days ago', autoRenew: false },
  { id: 3, name: 'sorano', tld: '.space', status: 'ok', expiryDate: 'Mar 8, 2027', registrar: 'Porkbun', registered: 'Mar 2025', ssl: '201 days left', sslStatus: 'ok', dns: 'Never', autoRenew: true },
  { id: 4, name: 'kira', tld: '.watch', status: 'ok', expiryDate: 'Jul 6, 2027', registrar: 'Porkbun', registered: 'Jul 2026', ssl: '178 days left', sslStatus: 'ok', dns: 'Never', autoRenew: true },
  { id: 5, name: 'strevius', tld: '.com', status: 'dead', expiryDate: 'Jun 3, 2026', registrar: 'GoDaddy', registered: 'Jun 2024', ssl: 'Expired', sslStatus: 'dead', dns: 'Unknown', autoRenew: false },
]

const statusColors = { ok: '#16a34a', warn: '#d97706', dead: '#dc2626' }
const badges = {
  ok:   { label: 'Healthy', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  warn: { label: 'Expiring', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  dead: { label: 'Expired', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
}

export default function Dashboard() {
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')
  const { user } = useUser()

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
            {[['Domains', true, '5'], ['SSL Certs', false, null], ['DNS Records', false, null]].map(([name, active, count]) => (
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
            <button style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginTop: 4 }}>
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
                      <div style={{ fontSize: 11, color: '#ccc' }}>Checked 2h ago</div>
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
                          ['Auto-renew', d.autoRenew ? 'On' : 'Off', d.autoRenew ? 'ok' : 'dead'],
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
                    </div>
                  )}
                </div>
              )
            })}

            {/* Add card */}
            <div
              style={{ border: '1px dashed #e5e5e5', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32, cursor: 'pointer', background: '#fff', minHeight: 160 }}
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
