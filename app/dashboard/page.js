'use client'

import { useState } from 'react'

const domains = [
  {
    id: 1,
    name: 'aegosintel',
    tld: '.com',
    status: 'ok',
    expiresIn: '721d',
    expiryDate: 'May 21, 2028',
    registrar: 'Spaceship',
    registered: 'May 21, 2026',
    ssl: '312 days left',
    sslStatus: 'ok',
    dns: 'Never changed',
    bar: 91,
  },
  {
    id: 2,
    name: 'two',
    tld: '.so',
    status: 'warn',
    expiresIn: '14d',
    expiryDate: 'Jun 26, 2026',
    registrar: 'Namecheap',
    registered: 'Sep 26, 2023',
    ssl: '66 days left',
    sslStatus: 'warn',
    dns: '3 days ago',
    bar: 6,
  },
  {
    id: 3,
    name: 'sorano',
    tld: '.space',
    status: 'ok',
    expiresIn: '269d',
    expiryDate: 'Mar 8, 2027',
    registrar: 'Porkbun',
    registered: 'Mar 8, 2025',
    ssl: '201 days left',
    sslStatus: 'ok',
    dns: 'Never changed',
    bar: 62,
  },
  {
    id: 4,
    name: 'tenkaro',
    tld: '.com',
    status: 'ok',
    expiresIn: '354d',
    expiryDate: 'Jun 1, 2027',
    registrar: 'Porkbun',
    registered: 'Jun 1, 2025',
    ssl: '178 days left',
    sslStatus: 'ok',
    dns: 'Never changed',
    bar: 74,
  },
  {
    id: 5,
    name: 'strevius',
    tld: '.com',
    status: 'dead',
    expiresIn: '–9d',
    expiryDate: 'Jun 3, 2026',
    registrar: 'GoDaddy',
    registered: 'Jun 3, 2024',
    ssl: 'Expired',
    sslStatus: 'dead',
    dns: 'Unknown',
    bar: 100,
  },
]

const gradients = {
  ok: 'linear-gradient(145deg, #e8f5ff 0%, #d0ecff 40%, #c8f5e8 100%)',
  warn: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 40%, #fde68a44 100%)',
  dead: 'linear-gradient(145deg, #fff5f5 0%, #fee2e2 40%, #fecaca44 100%)',
}

const barColors = { ok: '#16a34a', warn: '#d97706', dead: '#dc2626' }
const valColors = { ok: '#16a34a', warn: '#d97706', dead: '#dc2626' }

const badges = {
  ok: { label: 'Healthy', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  warn: { label: 'Expiring', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  dead: { label: 'Expired', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
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
    <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', minHeight: '100vh' }}>

      {/* Sidebar */}
      <div style={{ background: '#fff', borderRight: '1px solid #ebebeb', padding: '20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px 20px', borderBottom: '1px solid #ebebeb' }}>
          <div style={{ width: 26, height: 26, background: '#111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600 }}>T</div>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-.3px' }}>Tenkaro</span>
        </div>
        <div style={{ padding: '14px 10px', flex: 1 }}>
          {[['Monitor', [['Domains', true], ['SSL Certs', false], ['DNS Records', false]]], ['Alerts', [['Notifications', false], ['History', false]]], ['Account', [['Settings', false], ['Billing', false]]]].map(([label, items]) => (
            <div key={label}>
              <div style={{ fontSize: 10, fontWeight: 500, color: '#bbb', letterSpacing: '.07em', textTransform: 'uppercase', padding: '0 8px', margin: '14px 0 4px' }}>{label}</div>
              {items.map(([name, active]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', borderRadius: 7, fontSize: 12.5, color: active ? '#111' : '#666', fontWeight: active ? 500 : 400, background: active ? '#f5f5f5' : 'transparent', marginBottom: 1, cursor: 'pointer' }}>
                  {name}
                  {name === 'Domains' && <span style={{ marginLeft: 'auto', fontSize: 10, background: '#efefef', color: '#999', padding: '1px 6px', borderRadius: 8, fontWeight: 500 }}>5</span>}
                  {name === 'Notifications' && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 14px', borderTop: '1px solid #ebebeb', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, color: '#fff' }}>P</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Pieter</div>
            <div style={{ fontSize: 10, color: '#bbb' }}>Free · 5/5 domains</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <div style={{ padding: '20px 24px 16px', background: '#f2f2f7' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px' }}>Your domains</div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 3 }}>Monitoring expiry, SSL &amp; DNS changes</div>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#111', color: '#fff', border: 'none', borderRadius: 20, padding: '9px 16px', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              + Add domain
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 13px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: filter === f ? '#111' : '#e0e0e0', background: filter === f ? '#111' : '#fff', color: filter === f ? '#fff' : '#777', fontFamily: 'Inter, sans-serif' }}>
                {f === 'all' ? 'All' : f === 'expiring' ? '⚠ Expiring' : f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 24px', flex: 1 }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
            {[['5', 'Total', '#111'], ['3', 'Healthy', '#16a34a'], ['1', 'Expiring', '#d97706'], ['1', 'Expired', '#dc2626']].map(([val, lbl, color]) => (
              <div key={lbl} style={{ padding: '14px 16px', borderRadius: 14, background: '#fff', border: '1px solid #ebebeb' }}>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px', color }}>{val}</div>
                <div style={{ fontSize: 11, color: '#bbb', marginTop: 4, fontWeight: 500 }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Alert */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, marginBottom: 20, fontSize: 12, color: '#92400e' }}>
            ⚠ <strong style={{ fontWeight: 600 }}>two.so</strong> expires in 14 days — renew now.
            <span style={{ marginLeft: 'auto', fontWeight: 500, cursor: 'pointer', color: '#b45309' }}>Dismiss</span>
          </div>

          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '.07em' }}>All domains</div>
            <div style={{ fontSize: 11, color: '#ccc' }}>Click a card to expand</div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {filtered.map(d => {
              const isOpen = expanded === d.id
              const badge = badges[d.status]
              return (
                <div key={d.id} onClick={() => setExpanded(isOpen ? null : d.id)} style={{ borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'transform .15s, box-shadow .15s', transform: isOpen ? 'translateY(-2px)' : 'none', boxShadow: isOpen ? '0 8px 32px rgba(0,0,0,.13)' : 'none' }}>
                  <div style={{ background: gradients[d.status], padding: '18px 18px 16px', border: '1px solid rgba(255,255,255,.8)', borderRadius: 20 }}>

                    {/* Card top */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,.75)', border: '1px solid rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#333', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
                        {d.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.7)', border: '1px solid rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#888' }}>↗</div>
                    </div>

                    {/* Name + badge */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.4px', marginBottom: 6 }}>
                        {d.name}<span style={{ color: '#888', fontWeight: 400 }}>{d.tld}</span>
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: badge.color }} />
                        {badge.label}
                      </div>
                    </div>

                    {/* Stat row */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,.45)', border: '1px solid rgba(255,255,255,.7)', borderRadius: 12, padding: '10px 0', marginBottom: 14 }}>
                      {[['Expires in', d.expiresIn, d.status], ['Last check', '2h ago', 'neutral']].map(([lbl, val, st], i) => (
                        <div key={lbl} style={{ flex: 1, textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(0,0,0,.08)' : 'none' }}>
                          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.3px', color: st === 'neutral' ? '#111' : valColors[st] || '#111' }}>{val}</div>
                          <div style={{ fontSize: 10, color: '#aaa', marginTop: 2, fontWeight: 500 }}>{lbl}</div>
                        </div>
                      ))}
                    </div>

                    {/* Bar */}
                    <div style={{ height: 3, borderRadius: 2, background: 'rgba(0,0,0,.07)', marginBottom: isOpen ? 14 : 0, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${d.bar}%`, background: barColors[d.status], borderRadius: 2 }} />
                    </div>

                    {/* Expanded detail */}
                    {isOpen && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                          {[['Registrar', d.registrar, 'neutral'], ['Registered', d.registered, 'neutral'], ['Expiry date', d.expiryDate, d.status], ['SSL cert', d.ssl, d.sslStatus], ['DNS changes', d.dns, 'neutral']].map(([lbl, val, st]) => (
                            <div key={lbl} style={{ padding: '7px 9px', background: 'rgba(255,255,255,.5)', borderRadius: 8, border: '1px solid rgba(255,255,255,.8)' }}>
                              <div style={{ fontSize: 9.5, color: '#bbb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{lbl}</div>
                              <div style={{ fontSize: 11.5, fontWeight: 500, color: st === 'neutral' ? '#333' : valColors[st] || '#333' }}>{val}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 7 }}>
                          <button style={{ flex: 1, padding: 8, borderRadius: 12, border: '1px solid rgba(255,255,255,.8)', background: 'rgba(255,255,255,.6)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', color: '#555' }}>Edit alerts</button>
                          <button style={{ flex: 1, padding: 8, borderRadius: 12, border: 'none', background: '#111', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', color: '#fff' }}>Renew ↗</button>
                        </div>
                      </>
                    )}

                    {/* Chevron */}
                    <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#bbb', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</div>
                  </div>
                </div>
              )
            })}

            {/* Add card */}
            <div style={{ borderRadius: 20, border: '2px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, padding: 32, cursor: 'pointer', background: '#fff', minHeight: 220 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 20 }}>+</div>
              <div style={{ fontSize: 12, color: '#ccc', fontWeight: 500 }}>Add a domain</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
