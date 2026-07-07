'use client'

import { useEffect, useState } from 'react'

const TYPES = ['A', 'MX', 'TXT', 'NS', 'CNAME']

function isChangedRecently(changedAt) {
  if (!changedAt) return false
  return Date.now() - new Date(changedAt).getTime() < 7 * 24 * 3600 * 1000
}

function formatChanged(changedAt) {
  const diffMs = Date.now() - new Date(changedAt).getTime()
  const hours = Math.floor(diffMs / 3600000)
  if (hours < 1) return 'Changed just now'
  if (hours < 24) return `Changed ${hours}h ago`
  return `Changed ${Math.floor(hours / 24)}d ago`
}

const styles = {
  pillRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 },
  pill: (active) => ({
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid',
    borderColor: active ? '#111' : '#e5e5e5',
    background: active ? '#111' : '#fff',
    color: active ? '#fff' : '#555',
    fontFamily: 'Inter, sans-serif',
  }),
  card: (flagged) => ({
    background: '#fff',
    borderRadius: 14,
    border: '1px solid ' + (flagged ? '#fca5a5' : '#e8e8e8'),
    padding: '16px 20px',
  }),
  cardHeaderBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
  },
  domainName: { fontWeight: 700, fontSize: 14.5, letterSpacing: '-.2px', color: '#111' },
  recordCount: { fontSize: 12, color: '#999', marginLeft: 8, fontWeight: 400 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 10 },
  badge: (danger) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 11,
    fontWeight: 500,
    padding: '4px 9px',
    borderRadius: 20,
    background: danger ? '#fef2f2' : '#f0fdf4',
    border: `1px solid ${danger ? '#fecaca' : '#bbf7d0'}`,
    color: danger ? '#dc2626' : '#16a34a',
    whiteSpace: 'nowrap',
  }),
  chevron: (open) => ({
    display: 'inline-block',
    transition: 'transform 0.15s',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    color: '#aaa',
  }),
  table: { width: '100%', fontSize: 13, marginTop: 12, tableLayout: 'fixed', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontWeight: 500, color: '#999', padding: '6px 4px', borderBottom: '1px solid #f0f0f0' },
  thRight: { textAlign: 'right', fontWeight: 500, color: '#999', padding: '6px 4px', borderBottom: '1px solid #f0f0f0' },
  td: { padding: '8px 4px', fontFamily: 'monospace', fontSize: 12, borderBottom: '1px solid #f5f5f5', color: '#111' },
  tdRight: { padding: '8px 4px', textAlign: 'right', borderBottom: '1px solid #f5f5f5' },
  statusChanged: { color: '#dc2626', fontSize: 12 },
  statusOk: { color: '#aaa', fontSize: 12 },
  loading: { fontSize: 13, color: '#aaa', marginTop: 20 },
  errorText: { fontSize: 13, color: '#c0392b', marginTop: 20 },
}

function DomainCard({ entry }) {
  const [open, setOpen] = useState(false)
  const changedTypes = entry.records.filter((r) => isChangedRecently(r.changed_at))
  const hasNsChange = changedTypes.some((r) => r.record_type === 'NS')

  return (
    <div style={styles.card(hasNsChange)}>
      <button style={styles.cardHeaderBtn} onClick={() => setOpen(!open)}>
        <div>
          <span style={styles.domainName}>{entry.domain}</span>
          <span style={styles.recordCount}>{entry.records.length} records</span>
        </div>
        <div style={styles.headerRight}>
          {changedTypes.length > 0 ? (
            <span style={styles.badge(true)}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#dc2626' }} />
              {changedTypes.map((r) => r.record_type).join(', ')} changed
            </span>
          ) : (
            <span style={styles.badge(false)}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a' }} />
              All unchanged
            </span>
          )}
          <span style={styles.chevron(open)}>⌄</span>
        </div>
      </button>

      {open && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: '16%' }}>Type</th>
              <th style={{ ...styles.th, width: '50%' }}>Value</th>
              <th style={{ ...styles.thRight, width: '34%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {entry.records.map((r) => {
              const value = Array.isArray(r.value) ? r.value.join(', ') : String(r.value ?? '')
              const changed = isChangedRecently(r.changed_at)
              return (
                <tr key={r.record_type}>
                  <td style={styles.td}>{r.record_type}</td>
                  <td style={{ ...styles.td, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={value}>
                    {value || '—'}
                  </td>
                  <td style={styles.tdRight}>
                    {changed ? (
                      <span style={styles.statusChanged}>{formatChanged(r.changed_at)}</span>
                    ) : (
                      <span style={styles.statusOk}>Unchanged</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default function DnsRecordsPage() {
  const [domains, setDomains] = useState(null)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/dns-records')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setDomains(data.domains)
        }
      })
      .catch((err) => setError(String(err)))
  }, [])

  const filtered = domains
    ? domains.filter((entry) => {
        if (filter === 'all') return true
        if (filter === 'changed') return entry.records.some((r) => isChangedRecently(r.changed_at))
        return entry.records.some((r) => r.record_type === filter)
      })
    : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 860, padding: '36px 24px 60px' }}>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px', color: '#111' }}>DNS records</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Detect unauthorized changes to nameservers, mail, and verification records</div>
        </div>

        <div style={styles.pillRow}>
          <button style={styles.pill(filter === 'all')} onClick={() => setFilter('all')}>
            All {domains ? domains.length : ''}
          </button>
          <button style={styles.pill(filter === 'changed')} onClick={() => setFilter('changed')}>
            Changed
          </button>
          {TYPES.map((t) => (
            <button key={t} style={styles.pill(filter === t)} onClick={() => setFilter(t)}>
              {t}
            </button>
          ))}
        </div>

        {error && <div style={styles.errorText}>{error}</div>}
        {!domains && !error && <div style={styles.loading}>Loading…</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((entry) => (
            <DomainCard key={entry.domain} entry={entry} />
          ))}
        </div>

      </div>
    </div>
  )
}
