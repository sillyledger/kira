export default function Home() {
  const c = {
    bg: '#08090A',
    bgRaised: '#0C0E0D',
    border: '#17191B',
    green: '#3FCF8E',
    mint: '#7FE3B6',
    amber: '#F0B44A',
    red: '#EC6A63',
    textHi: '#F7F8F8',
    textMid: '#9A9E9C',
    textLow: '#63676A',
  }

  return (
    <main style={{ background: c.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @keyframes kpPulse { 0% { transform: scale(1); opacity: 1 } 50% { transform: scale(2.4); opacity: 0 } 100% { opacity: 0 } }
        .kp-input::placeholder { color: #5A5F5C }
        .kp-cta:hover { background: #F2F2F2 }
        .kp-navlink:hover { color: #EDEDED }
      `}</style>

      {/* Top glow */}
      <div style={{ position: 'absolute', top: -160, left: '50%', transform: 'translateX(-50%)', width: 900, height: 440, background: 'radial-gradient(ellipse at center, rgba(63,207,142,0.10), rgba(63,207,142,0) 62%)', pointerEvents: 'none' }} />

      {/* Nav */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px', borderBottom: `1px solid ${c.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="30" height="30" viewBox="0 0 100 100" aria-hidden="true">
            <rect x="1" y="1" width="98" height="98" rx="24" fill="#0C0E0D" stroke="#294034" strokeWidth="1.5" />
            <path d="M50 20 L74 28 V50 C74 65 63 74 50 80 C37 74 26 65 26 50 V28 Z" fill="#3FCF8E" />
            <polyline points="30,53 42,53 46,42 52,64 57,48 61,53 70,53" fill="none" stroke="#0C0E0D" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 16, fontWeight: 600, color: c.textHi, letterSpacing: '-.3px' }}>KiraPulse</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a href="/dashboard" className="kp-navlink" style={{ fontSize: 14, color: c.textMid, fontWeight: 500, textDecoration: 'none', transition: 'color .15s' }}>Sign in</a>
          <a href="#waitlist" style={{ fontSize: 14, fontWeight: 500, color: '#08090A', background: '#EDEDED', padding: '7px 14px', borderRadius: 8, textDecoration: 'none' }}>Join waitlist</a>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 26px 90px' }}>

        {/* Eyebrow */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, padding: '6px 13px', borderRadius: 999, background: 'rgba(63,207,142,0.06)', border: '1px solid #23312A', color: c.mint, marginBottom: 28 }}>
          <span style={{ position: 'relative', width: 7, height: 7, display: 'inline-block' }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c.green, animation: 'kpPulse 2.2s ease-out infinite' }} />
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c.green }} />
          </span>
          Now in early access
        </div>

        {/* Pulse trace */}
        <div style={{ width: '100%', maxWidth: 400, marginBottom: 26 }}>
          <svg viewBox="0 0 400 40" style={{ width: '100%', height: 40, display: 'block', overflow: 'visible' }}>
            <path id="hero-pulse-path" d="M0,20 H156 L170,20 L181,4 L195,36 L208,9 L219,20 H400" fill="none" stroke="#1D2321" strokeWidth="1.5" />
            <circle r="3.5" fill={c.green} style={{ filter: 'drop-shadow(0 0 6px rgba(63,207,142,0.5))' }}>
              <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
                <mpath href="#hero-pulse-path" />
              </animateMotion>
            </circle>
          </svg>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(32px, 5.4vw, 56px)', fontWeight: 600, letterSpacing: '-2.5px', lineHeight: 1.05, color: c.textHi, margin: '0 0 22px', maxWidth: 640 }}>
          Never lose a domain to a missed renewal.
        </h1>

        {/* Subheadline */}
        <p style={{ fontSize: 17.5, lineHeight: 1.6, color: c.textMid, maxWidth: 520, margin: '0 0 38px' }}>
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
        <div style={{ fontSize: 13, color: c.textLow, marginTop: 16 }}>
          Free for 3 domains at launch. No credit card.
        </div>

      </div>

      {/* Product preview */}
      <div style={{ position: 'relative', padding: '100px 26px', borderTop: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>

          {/* Section head */}
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '.06em', padding: '6px 12px', borderRadius: 999, background: 'rgba(63,207,142,0.06)', border: '1px solid #23312A', color: c.mint, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.green }} />
              Live preview
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-1px', color: c.textHi, margin: '0 0 14px' }}>
              What KiraPulse actually watches
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: c.textMid, margin: 0 }}>
              Every domain gets one score. Drill in and you'll see exactly why it moved.
            </p>
          </div>

          {/* Preview card */}
          <div style={{ background: c.bgRaised, border: `1px solid ${c.border}`, borderRadius: 20, padding: 8, boxShadow: '0 40px 100px -40px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px 18px' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.14)' }} />
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.14)' }} />
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.14)' }} />
              <span style={{ marginLeft: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: c.textLow }}>dashboard.kirapulse.com</span>
            </div>

            <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, overflow: 'hidden' }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.8fr 1fr', gap: 12, padding: '12px 22px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: c.textLow }}>
                <span>Domain</span><span>Health</span><span>SSL</span><span>Status</span>
              </div>

              {[
                { domain: 'shiplog.io', score: 96, ssl: '84d left', status: 'All checks passing', tone: 'ok' },
                { domain: 'acme-labs.dev', score: 78, ssl: '12d left', status: 'SSL renews soon', tone: 'warn' },
                { domain: 'northwind.app', score: 41, ssl: '6d left', status: 'Domain expiring — act now', tone: 'crit' },
                { domain: 'vantage-hq.com', score: 100, ssl: '412d left', status: 'All checks passing', tone: 'ok' },
              ].map((row) => {
                const toneColor = row.tone === 'ok' ? c.mint : row.tone === 'warn' ? c.amber : c.red
                const dotColor = row.tone === 'ok' ? c.green : row.tone === 'warn' ? c.amber : c.red
                return (
                  <div key={row.domain} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.8fr 1fr', gap: 12, alignItems: 'center', padding: '16px 22px', borderTop: `1px solid ${c.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500, color: c.textHi }}>
                      <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-block', flexShrink: 0 }}>
                        {row.tone === 'ok' && <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: dotColor, animation: 'kpPulse 2.2s ease-out infinite' }} />}
                        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: dotColor }} />
                      </span>
                      {row.domain}
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: toneColor, background: `${dotColor}1F`, padding: '3px 9px', borderRadius: 6, width: 'fit-content' }}>{row.score}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: row.tone === 'ok' ? c.textMid : toneColor }}>{row.ssl}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: row.tone === 'ok' ? c.textMid : toneColor }}>{row.status}</span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>

    </main>
  )
}