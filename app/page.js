export default function Home() {
  return (
    <main style={{ background: '#08090A', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @keyframes kpPulse { 0% { transform: scale(1); opacity: 1 } 50% { transform: scale(2.4); opacity: 0 } 100% { opacity: 0 } }
        .kp-input::placeholder { color: #5A5F5C }
        .kp-cta:hover { background: #F2F2F2 }
        .kp-navlink:hover { color: #EDEDED }
      `}</style>

      {/* Top glow */}
      <div style={{ position: 'absolute', top: -160, left: '50%', transform: 'translateX(-50%)', width: 900, height: 440, background: 'radial-gradient(ellipse at center, rgba(63,207,142,0.10), rgba(63,207,142,0) 62%)', pointerEvents: 'none' }} />

      {/* Nav */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px', borderBottom: '1px solid #17191B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="30" height="30" viewBox="0 0 100 100" aria-hidden="true">
            <rect x="1" y="1" width="98" height="98" rx="24" fill="#0C0E0D" stroke="#294034" strokeWidth="1.5" />
            <path d="M50 20 L74 28 V50 C74 65 63 74 50 80 C37 74 26 65 26 50 V28 Z" fill="#3FCF8E" />
            <polyline points="30,53 42,53 46,42 52,64 57,48 61,53 70,53" fill="none" stroke="#0C0E0D" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#F7F8F8', letterSpacing: '-.3px' }}>KiraPulse</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a href="/dashboard" className="kp-navlink" style={{ fontSize: 14, color: '#9A9E9C', fontWeight: 500, textDecoration: 'none', transition: 'color .15s' }}>Sign in</a>
          <a href="#waitlist" style={{ fontSize: 14, fontWeight: 500, color: '#08090A', background: '#EDEDED', padding: '7px 14px', borderRadius: 8, textDecoration: 'none' }}>Join waitlist</a>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 26px 90px' }}>

        {/* Eyebrow */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, padding: '6px 13px', borderRadius: 999, background: 'rgba(63,207,142,0.06)', border: '1px solid #23312A', color: '#7FE3B6', marginBottom: 32 }}>
          <span style={{ position: 'relative', width: 7, height: 7, display: 'inline-block' }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#3FCF8E', animation: 'kpPulse 2.2s ease-out infinite' }} />
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#3FCF8E' }} />
          </span>
          Now in early access
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(32px, 5.4vw, 56px)', fontWeight: 600, letterSpacing: '-2.5px', lineHeight: 1.05, color: '#F7F8F8', margin: '0 0 22px', maxWidth: 640 }}>
          Never lose a domain to a missed renewal.
        </h1>

        {/* Subheadline */}
        <p style={{ fontSize: 17.5, lineHeight: 1.6, color: '#9A9E9C', maxWidth: 520, margin: '0 0 38px' }}>
          KiraPulse watches your domains, SSL certificates, and DNS records, then warns you before anything expires — all tracked in one simple health score.
        </p>

        {/* Waitlist CTA */}
        <div id="waitlist" style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 440 }}>
          <input
            className="kp-input"
            type="email"
            placeholder="you@company.com"
            style={{ flex: 1, height: 46, padding: '0 15px', border: '1px solid #23262A', borderRadius: 10, fontSize: 15, fontFamily: 'Inter, sans-serif', color: '#EDEDED', outline: 'none', background: '#0E0F11' }}
          />
          <button className="kp-cta" style={{ height: 46, padding: '0 22px', background: '#FAFAFA', color: '#08090A', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', transition: 'background .15s' }}>
            Join the waitlist
          </button>
        </div>

        {/* Reassurance */}
        <div style={{ fontSize: 13, color: '#63676A', marginTop: 16 }}>
          Free for 3 domains at launch. No credit card.
        </div>

      </div>
    </main>
  )
}
