'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser, useClerk } from '@clerk/nextjs'

const NAV = {
  monitor: [
    { name: 'Domains', href: '/dashboard', showCount: true },
    { name: 'SSL Certs', href: '/ssl-certs' },
    { name: 'DNS Records', href: '/dns-records' },
  ],
  alerts: [
    { name: 'Notifications', href: null },
    { name: 'History', href: null },
  ],
}

function NavRow({ item, active, count }) {
  const base = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 8px',
    borderRadius: 6,
    fontSize: 13.5,
    marginBottom: 1,
  }

  // Opens a modal / runs an action (e.g. Clerk account) — clickable, no route
  if (item.action) {
    return (
      <div onClick={item.action} style={{ ...base, color: '#555', fontWeight: 400, cursor: 'pointer' }}>
        {item.name}
      </div>
    )
  }

  // Not built yet — muted, non-clickable, tagged "Soon"
  if (!item.href) {
    return (
      <div style={{ ...base, color: '#c4c4c4', fontWeight: 400, cursor: 'default' }}>
        {item.name}
        <span style={{ fontSize: 9.5, background: '#f5f5f5', color: '#bbb', padding: '1px 6px', borderRadius: 8, fontWeight: 600, letterSpacing: '.02em' }}>
          SOON
        </span>
      </div>
    )
  }

  return (
    <Link href={item.href} style={{ textDecoration: 'none' }}>
      <div style={{ ...base, color: active ? '#111' : '#555', fontWeight: active ? 500 : 400, background: active ? '#f5f5f5' : 'transparent', cursor: 'pointer' }}>
        {item.name}
        {item.showCount && count !== null && (
          <span style={{ fontSize: 10.5, background: '#f0f0f0', color: '#999', padding: '1px 6px', borderRadius: 8, fontWeight: 500 }}>
            {count}
          </span>
        )}
      </div>
    </Link>
  )
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const { user } = useUser()
  const { openUserProfile } = useClerk()
  const [domainCount, setDomainCount] = useState(null)

  useEffect(() => {
    fetch('/api/domains')
      .then(res => res.json())
      .then(json => setDomainCount((json.domains || []).length))
      .catch(() => {})
  }, [])

  const account = [
    { name: 'Settings', action: openUserProfile },
    { name: 'Billing', href: null },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#fff' }}>

      {/* Sidebar */}
      <div style={{ background: '#fff', borderRight: '1px solid #ebebeb', padding: '16px 0', display: 'flex', flexDirection: 'column' }}>

        {/* Logo — links home to Domains */}
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 16px 16px', borderBottom: '1px solid #ebebeb', cursor: 'pointer' }}>
            <svg width="28" height="28" viewBox="0 0 100 100" aria-hidden="true">
              <rect x="1" y="1" width="98" height="98" rx="24" fill="#0C0E0D" stroke="#294034" strokeWidth="1.5" />
              <path d="M50 20 L74 28 V50 C74 65 63 74 50 80 C37 74 26 65 26 50 V28 Z" fill="#3FCF8E" />
              <polyline points="30,53 42,53 46,42 52,64 57,48 61,53 70,53" fill="none" stroke="#0C0E0D" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111', letterSpacing: '-.3px' }}>KiraPulse</span>
          </div>
        </Link>

        {/* Nav */}
        <div style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px', marginBottom: 2 }}>
            <span style={{ fontSize: 15 }}>◫</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '.06em', textTransform: 'uppercase' }}>Monitor</span>
          </div>
          <div style={{ borderLeft: '2px solid #f0f0f0', marginLeft: 19, paddingLeft: 14, marginBottom: 10 }}>
            {NAV.monitor.map(item => (
              <NavRow key={item.name} item={item} active={pathname === item.href} count={domainCount} />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px', marginBottom: 2 }}>
            <span style={{ fontSize: 15 }}>◎</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '.06em', textTransform: 'uppercase' }}>Alerts</span>
          </div>
          <div style={{ borderLeft: '2px solid #f0f0f0', marginLeft: 19, paddingLeft: 14, marginBottom: 10 }}>
            {NAV.alerts.map(item => (
              <NavRow key={item.name} item={item} active={pathname === item.href} count={null} />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px', marginBottom: 2 }}>
            <span style={{ fontSize: 15 }}>◉</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '.06em', textTransform: 'uppercase' }}>Account</span>
          </div>
          <div style={{ borderLeft: '1.5px solid #ebebeb', marginLeft: 15, paddingLeft: 12 }}>
            {account.map(item => (
              <NavRow key={item.name} item={item} active={false} count={null} />
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

      {/* Page content */}
      {children}
    </div>
  )
}
