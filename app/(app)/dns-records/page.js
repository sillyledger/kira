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
  page: { maxWidth: 860, margin: '0 auto' },
  headerWrap: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 500, margin: '0 0 4px' },
  subtitle: { fontSize: 14, color: '#6b7280', margin: 0 },
  pillRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 },
  pill: (active) => ({
    borderRadius: 999,
    fontSize: 13,
    padding: '6px 14px',
    border: '1px solid ' + (active ? '#111827' : '#e5e7eb'),
    background: active ? '#111827' : '#fff',
    color: active ? '#fff' : '#111827',
    cursor: 'pointer',
  }),
  cardList: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: (flagged) => ({
    background: '#fff',
    borderRadius: 12,
    border: '1px solid ' + (flagged ? '#fca5a5' : '#e5e7eb'),
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
  domainName: { fontWeight: 500, fontSize: 15 },
  recordCount: { fontSize: 13, color: '#6b7280', marginLeft: 8 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 10 },
  badge: (danger) => ({
    fontSize: 12,
    padding: '3px 10px',
    borderRadius: 999,
    background: danger ? '#fef2f2' : '#f0fdf4',
    color: danger ? '#b91c1c' : '#15803d',
  }),
  chevron: (open) => ({
    display: 'inline-block',
    transition: 'transform 0.15s',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
  }),
  table: { width: '100%', fontSize: 13, marginTop: 12, tableLayout: 'fixed', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontWeight: 500, color: '#6b7280', padding: '6px 4px', borderBottom: '1px solid #e5e7eb' },
  thRight: { textAlign: 'right', fontWeight: 500, color: '#6b7280', padding: '6px 4px', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '8px 4px', fontFamily: 'monospace', fontSize: 12, borderBottom: '1px solid #f3f4f6' },
  tdRight: { padding: '8px 4px', textAlign: 'right', borderBottom: '1px solid #f3f4f6' },
  statusChanged: { color: '#dc2626', fontSize: 12 },
  statusOk: { color: '#6b7280', fontSize: 12 },
  loading: { fontSize: 14, color: '#6b7280' },
  errorText: { fontSize: 14, color: '#dc2626' },
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
            <span style={styles.badge(true)}>{changedTypes.map((r) => r.record_type).join(', ')} changed</span>
          ) : (
            <span style={styles.badge(false)}>All unchanged</span>
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
    <div style={styles.page}>
      <div style={styles.headerWrap}>
        <h1 style={styles.title}>DNS records</h1>
        <p style={styles.subtitle}>Detect unauthorized changes to nameservers, mail, and verification records</p>
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

      {error && <p style={styles.errorText}>{error}</p>}
      {!domains && !error && <p style={styles.loading}>Loading…</p>}

      <div style={styles.cardList}>
        {filtered.map((entry) => (
          <DomainCard key={entry.domain} entry={entry} />
        ))}
      </div>
    </div>
  )
}
