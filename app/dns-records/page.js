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

function DomainCard({ entry }) {
  const [open, setOpen] = useState(false)
  const changedTypes = entry.records.filter((r) => isChangedRecently(r.changed_at))
  const hasNsChange = changedTypes.some((r) => r.record_type === 'NS')

  return (
    <div
      className={`bg-white rounded-xl border ${
        hasNsChange ? 'border-red-300' : 'border-gray-200'
      } p-4`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <span className="font-medium text-[15px]">{entry.domain}</span>
          <span className="text-sm text-gray-500 ml-2">{entry.records.length} records</span>
        </div>
        <div className="flex items-center gap-2">
          {changedTypes.length > 0 ? (
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700">
              {changedTypes.map((r) => r.record_type).join(', ')} changed
            </span>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700">
              All unchanged
            </span>
          )}
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
        </div>
      </button>

      {open && (
        <table className="w-full text-sm mt-3 table-fixed">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="text-left font-medium py-1.5 w-1/6">Type</th>
              <th className="text-left font-medium py-1.5 w-1/2">Value</th>
              <th className="text-right font-medium py-1.5 w-1/3">Status</th>
            </tr>
          </thead>
          <tbody>
            {entry.records.map((r) => {
              const value = Array.isArray(r.value) ? r.value.join(', ') : String(r.value ?? '')
              const changed = isChangedRecently(r.changed_at)
              return (
                <tr key={r.record_type} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 font-mono text-xs">{r.record_type}</td>
                  <td className="py-2 font-mono text-xs truncate" title={value}>
                    {value || '—'}
                  </td>
                  <td className="py-2 text-right">
                    {changed ? (
                      <span className="text-red-600 text-xs">{formatChanged(r.changed_at)}</span>
                    ) : (
                      <span className="text-gray-500 text-xs">Unchanged</span>
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
    <div className="max-w-[860px] mx-auto">
      <div className="mb-6">
        <h1 className="text-[22px] font-medium mb-1">DNS records</h1>
        <p className="text-sm text-gray-500">
          Detect unauthorized changes to nameservers, mail, and verification records
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full text-sm px-3.5 py-1.5 border ${
            filter === 'all' ? 'bg-black text-white border-black' : 'border-gray-200'
          }`}
        >
          All {domains ? domains.length : ''}
        </button>
        <button
          onClick={() => setFilter('changed')}
          className={`rounded-full text-sm px-3.5 py-1.5 border ${
            filter === 'changed' ? 'bg-black text-white border-black' : 'border-gray-200'
          }`}
        >
          Changed
        </button>
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full text-sm px-3.5 py-1.5 border ${
              filter === t ? 'bg-black text-white border-black' : 'border-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {!domains && !error && <p className="text-sm text-gray-500">Loading…</p>}

      <div className="flex flex-col gap-4">
        {filtered.map((entry) => (
          <DomainCard key={entry.domain} entry={entry} />
        ))}
      </div>
    </div>
  )
}
