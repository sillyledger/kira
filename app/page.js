export default function Home() {
  const c = {
    bg: '#08090A',
    bgRaised: '#0C0E0D',
    card: 'rgba(255,255,255,0.03)',
    border: '#17191B',
    borderStrong: '#23262A',
    green: '#3FCF8E',
    mint: '#7FE3B6',
    amber: '#F0B44A',
    red: '#EC6A63',
    textHi: '#F7F8F8',
    textMid: '#9A9E9C',
    textLow: '#63676A',
  }
  const mono = "'JetBrains Mono', monospace"

  const features = [
    {
      title: 'Domain expiry tracking',
      body: 'We read WHOIS on a schedule that tightens as a renewal date approaches, so you get warned in weeks, not the morning it lapses.',
      span: 2,
      icon: <path d="M12 2L3 7v6c0 5 4 8.5 9 9 5-.5 9-4 9-9V7l-9-5z" stroke={c.green} strokeWidth="1.8" strokeLinejoin="round" fill="none" />,
    },
    {
      title: 'SSL certificate monitoring',
      body: 'Daily checks on chain validity, expiry, and issuer — before a browser starts warning your visitors for you.',
      span: 1,
      icon: <>
        <rect x="5" y="11" width="14" height="9" rx="2" stroke={c.green} strokeWidth="1.8" fill="none" />
        <path d="M8 11V8a4 4 0 018 0v3" stroke={c.green} strokeWidth="1.8" fill="none" />
      </>,
    },
    {
      title: 'DNS drift detection',
      body: 'We snapshot your records and flag anything that changes without you touching it.',
      span: 1,
      icon: <>
        <circle cx="12" cy="12" r="9" stroke={c.green} strokeWidth="1.8" fill="none" />
        <path d="M3 12h18M12 3a15 15 0 010 18 15 15 0 010-18z" stroke={c.green} strokeWidth="1.8" fill="none" />
      </>,
    },
    {
      title: 'Alerts that actually reach you',
      body: 'Email today, Slack and SMS on the way — sent the moment a check fails, not on your next login.',
      span: 2,
      icon: <>
        <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4" stroke={c.green} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" stroke={c.green} strokeWidth="1.8" fill="none" />
      </>,
    },
  ]

  const steps = [
    { num: '01', title: 'Add your domains', body: 'Paste a list or add them one at a time — 30 seconds each, no verification hoops.' },
    { num: '02', title: 'KiraPulse watches, quietly', body: 'WHOIS, SSL, and DNS checked on a schedule that tightens as risk increases. Nothing to poll on your end.' },
    { num: '03', title: 'You hear about it first', body: 'Before your customers do, before the support ticket, before the outage page.' },
  ]

  const plans = [
    {
      tier: 'Free', desc: 'For a personal project or two', price: '$0',
      features: ['3 domains', 'Domain, SSL & DNS monitoring', 'Daily checks', 'Email alerts'],
      featured: false,
    },
    {
      tier: 'Pro', desc: 'For a growing set of client or side projects', price: '$9',
      features: ['25 domains', 'Everything in Free', '6-hour check interval', 'Health score history & trends', 'Priority WHOIS refresh'],
      featured: true,
    },
    {
      tier: 'Agency', desc: 'For managing domains across clients', price: '$29',
      features: ['100 domains', 'Everything in Pro', '1-hour check interval', 'Team seats', 'API access'],
      featured: false,
    },
  ]

  const faqs = [
    { q: 'How often do you actually check my domains?', a: 'Free checks daily. Pro checks every 6 hours. Agency checks hourly. The interval also tightens automatically as a domain gets close to expiry, regardless of plan.' },
    { q: 'Do you need access to my registrar or DNS provider?', a: "No. KiraPulse only reads public WHOIS, certificate, and DNS records. There's no login to hand over and nothing that can write to your setup." },
    { q: 'What exactly is the health score?', a: "A 0–100 rollup of three signals: days until domain expiry, SSL certificate validity, and DNS record stability. Any one dropping pulls the whole score down, so it's built to reflect your worst problem, not average it away." },
    { q: 'Which registrars and DNS providers do you support?', a: "Any domain with public WHOIS and standard DNS records — we're not tied to a specific registrar, so moving providers later won't break monitoring." },
    { q: 'What happens when I hit my domain limit?', a: "You'll see it coming in the dashboard before you hit the wall. Existing domains keep being monitored either way — you just won't be able to add new ones until you upgrade." },
  ]

  return (
    <main style={{ background: c.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @keyframes kpPulse { 0% { transform: scale(1); opacity: 1 } 50% { transform: scale(2.4); opacity: 0 } 100% { opacity: 0 } }
        .kp-input::placeholder { color: #5A5F5C }
        .kp-cta:hover { background: #F2F2F2 }
        .kp-navlink:hover { color: #EDEDED }
        .kp-bento-card:hover { border-color: #23262A; background: rgba(255,255,255,0.05); }
        .kp-price-cta:hover { border-color: #3FCF8E; background: rgba(63,207,142,0.08); }
        .kp-bento-grid, .kp-steps-grid, .kp-pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .kp-bento-span2 { grid-column: span 2; }
        .kp-score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        details.kp-faq summary::-webkit-details-marker { display: none; }
        details.kp-faq .kp-faq-icon { transition: transform .2s ease; }
        details.kp-faq[open] .kp-faq-icon { transform: rotate(45deg); }
        @media (max-width: 860px) {
          .kp-bento-grid, .kp-steps-grid, .kp-pricing-grid { grid-template-columns: 1fr; }
          .kp-bento-span2 { grid-column: span 1; }
          .kp-score-grid { grid-template-columns: 1fr; gap: 32px; }
        }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#product" className="kp-navlink" style={{ fontSize: 14, color: c.textMid, fontWeight: 500, textDecoration: 'none', transition: 'color .15s' }}>Product</a>
          <a href="#pricing" className="kp-navlink" style={{ fontSize: 14, color: c.textMid, fontWeight: 500, textDecoration: 'none', transition: 'color .15s' }}>Pricing</a>
          <a href="#faq" className="kp-navlink" style={{ fontSize: 14, color: c.textMid, fontWeight: 500, textDecoration: 'none', transition: 'color .15s' }}>FAQ</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a href="/dashboard" className="kp-navlink" style={{ fontSize: 14, color: c.textMid, fontWeight: 500, textDecoration: 'none', transition: 'color .15s' }}>Sign in</a>
          <a href="#waitlist" style={{ fontSize: 14, fontWeight: 500, color: '#08090A', background: '#EDEDED', padding: '7px 14px', borderRadius: 8, textDecoration: 'none' }}>Join waitlist</a>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 26px 90px' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, padding: '6px 13px', borderRadius: 999, background: 'rgba(63,207,142,0.06)', border: '1px solid #23312A', color: c.mint, marginBottom: 28 }}>
          <span style={{ position: 'relative', width: 7, height: 7, display: 'inline-block' }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c.green, animation: 'kpPulse 2.2s ease-out infinite' }} />
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c.green }} />
          </span>
          Now in early access
        </div>

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

        <h1 style={{ fontSize: 'clamp(32px, 5.4vw, 56px)', fontWeight: 600, letterSpacing: '-2.5px', lineHeight: 1.05, color: c.textHi, margin: '0 0 22px', maxWidth: 640 }}>
          Never lose a domain to a missed renewal.
        </h1>

        <p style={{ fontSize: 17.5, lineHeight: 1.6, color: c.textMid, maxWidth: 520, margin: '0 0 38px' }}>
          KiraPulse watches your domains, SSL certificates, and DNS records, then warns you before anything expires — all tracked in one simple health score.
        </p>

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

        <div style={{ fontSize: 13, color: c.textLow, marginTop: 16 }}>
          Free for 3 domains at launch. No credit card.
        </div>
      </div>

      {/* Product preview */}
      <div id="product" style={{ position: 'relative', padding: '100px 26px', borderTop: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, fontFamily: mono, textTransform: 'uppercase', letterSpacing: '.06em', padding: '6px 12px', borderRadius: 999, background: 'rgba(63,207,142,0.06)', border: '1px solid #23312A', color: c.mint, marginBottom: 20 }}>
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

          <div style={{ background: c.bgRaised, border: `1px solid ${c.border}`, borderRadius: 20, padding: 8, boxShadow: '0 40px 100px -40px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px 18px' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.14)' }} />
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.14)' }} />
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.14)' }} />
              <span style={{ marginLeft: 8, fontFamily: mono, fontSize: 12, color: c.textLow }}>dashboard.kirapulse.com</span>
            </div>

            <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.8fr 1fr', gap: 12, padding: '12px 22px', fontFamily: mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: c.textLow }}>
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
                    <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: toneColor, background: `${dotColor}1F`, padding: '3px 9px', borderRadius: 6, width: 'fit-content' }}>{row.score}</span>
                    <span style={{ fontFamily: mono, fontSize: 12.5, color: row.tone === 'ok' ? c.textMid : toneColor }}>{row.ssl}</span>
                    <span style={{ fontFamily: mono, fontSize: 12.5, color: row.tone === 'ok' ? c.textMid : toneColor }}>{row.status}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ position: 'relative', padding: '100px 26px', borderTop: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ maxWidth: 560, marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, fontFamily: mono, textTransform: 'uppercase', letterSpacing: '.06em', padding: '6px 12px', borderRadius: 999, background: 'rgba(63,207,142,0.06)', border: '1px solid #23312A', color: c.mint, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.green }} />
              Coverage
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-1px', color: c.textHi, margin: '0 0 14px' }}>
              Three places things quietly break
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: c.textMid, margin: 0 }}>
              Domains lapse, certs expire, DNS drifts — usually with no warning until a customer hits the error page. KiraPulse checks all three, on its own schedule.
            </p>
          </div>

          <div className="kp-bento-grid">
            {features.map((f) => (
              <div key={f.title} className={`kp-bento-card${f.span === 2 ? ' kp-bento-span2' : ''}`} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 28, transition: 'border-color .2s ease, background .2s ease' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(63,207,142,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{f.icon}</svg>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: c.textHi, letterSpacing: '-.2px', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: c.textMid, margin: 0 }}>{f.body}</p>

                {f.title === 'Domain expiry tracking' && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: mono, fontSize: 12, color: c.textMid, whiteSpace: 'nowrap' }}>shiplog.io</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '82%', background: c.green, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: mono, fontSize: 12, color: c.textMid, whiteSpace: 'nowrap' }}>412d</span>
                  </div>
                )}

                {f.title === 'DNS drift detection' && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${c.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: mono, fontSize: 12, color: c.textMid }}>
                      <span style={{ background: 'rgba(255,255,255,0.06)', color: c.textHi, padding: '2px 7px', borderRadius: 5, fontSize: 11 }}>A</span>
                      203.0.113.4 — unchanged
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: mono, fontSize: 12, color: c.amber }}>
                      <span style={{ background: 'rgba(240,180,74,0.12)', color: c.amber, padding: '2px 7px', borderRadius: 5, fontSize: 11 }}>MX</span>
                      mail swapped 3h ago
                    </div>
                  </div>
                )}

                {f.title === 'Alerts that actually reach you' && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${c.border}` }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: `1px solid ${c.border}`, borderRadius: 10, padding: '9px 12px', fontSize: 12.5, color: c.textMid }}>
                      northwind.app — domain expires in 6 days
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health score spotlight */}
      <div style={{ position: 'relative', padding: '100px 26px', borderTop: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }} className="kp-score-grid">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, fontFamily: mono, textTransform: 'uppercase', letterSpacing: '.06em', padding: '6px 12px', borderRadius: 999, background: 'rgba(63,207,142,0.06)', border: '1px solid #23312A', color: c.mint, marginBottom: 22 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.green }} />
              The number
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-.8px', color: c.textHi, margin: '0 0 16px' }}>
              One score, three signals
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: c.textMid, margin: '0 0 28px' }}>
              Domain, SSL, and DNS each feed into a single 0–100 health score per site — so you can tell what needs attention at a glance, and watch it trend before it becomes a fire drill.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[{ label: 'Domain', val: 97 }, { label: 'SSL', val: 91 }, { label: 'DNS', val: 88 }].map((f) => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 60, fontSize: 13.5, color: c.textMid, flexShrink: 0 }}>{f.label}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${f.val}%`, background: c.green, borderRadius: 3 }} />
                  </div>
                  <span style={{ width: 28, textAlign: 'right', fontFamily: mono, fontSize: 12.5, color: c.textMid }}>{f.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 240, height: 240 }}>
              <svg width="240" height="240" viewBox="0 0 240 240">
                <circle cx="120" cy="120" r="96" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="14" />
                <circle cx="120" cy="120" r="96" fill="none" stroke={c.green} strokeWidth="14" strokeLinecap="round" strokeDasharray="603.2" strokeDashoffset="48.3" transform="rotate(-90 120 120)" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: mono, fontSize: 48, fontWeight: 600, color: c.green, letterSpacing: '-1px' }}>92</span>
                <span style={{ fontFamily: mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: c.textLow, marginTop: 4 }}>health score</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ position: 'relative', padding: '88px 26px', borderTop: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, fontFamily: mono, textTransform: 'uppercase', letterSpacing: '.06em', padding: '6px 12px', borderRadius: 999, background: 'rgba(63,207,142,0.06)', border: '1px solid #23312A', color: c.mint, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.green }} />
              Onboarding
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-1px', color: c.textHi, margin: '0 0 14px' }}>
              Set up before your coffee's cold
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: c.textMid, margin: 0 }}>
              No nameserver changes, no registrar login, nothing to install.
            </p>
          </div>

          <div className="kp-steps-grid">
            {steps.map((s) => (
              <div key={s.num}>
                <div style={{ fontFamily: mono, fontSize: 13, color: c.green, border: '1px solid rgba(63,207,142,0.3)', background: 'rgba(63,207,142,0.1)', width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>{s.num}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: c.textHi, letterSpacing: '-.2px', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: c.textMid, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ position: 'relative', padding: '100px 26px', borderTop: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, fontFamily: mono, textTransform: 'uppercase', letterSpacing: '.06em', padding: '6px 12px', borderRadius: 999, background: 'rgba(63,207,142,0.06)', border: '1px solid #23312A', color: c.mint, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.green }} />
              Pricing
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-1px', color: c.textHi, margin: '0 0 14px' }}>
              Simple, while it's early
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: c.textMid, margin: 0 }}>
              Free while you kick the tires. Upgrade when you're watching things that matter.
            </p>
          </div>

          <div className="kp-pricing-grid">
            {plans.map((p) => (
              <div key={p.tier} style={{
                background: c.card,
                border: p.featured ? `2px solid ${c.green}` : `1px solid ${c.border}`,
                borderRadius: 18, padding: '32px 28px', display: 'flex', flexDirection: 'column', position: 'relative',
              }}>
                {p.featured && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: c.green, color: '#08120D', fontFamily: mono, fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 999 }}>
                    Most popular
                  </div>
                )}
                <div style={{ fontSize: 15, fontWeight: 600, color: c.textHi, marginBottom: 6 }}>{p.tier}</div>
                <div style={{ fontSize: 13.5, color: c.textMid, marginBottom: 24 }}>{p.desc}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 26 }}>
                  <span style={{ fontFamily: mono, fontSize: 36, fontWeight: 600, color: c.textHi, letterSpacing: '-1px' }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: c.textMid }}>/mo</span>
                </div>
                <a href="#waitlist" className={p.featured ? 'kp-cta' : 'kp-price-cta'} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', height: 42, borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: 'none', marginBottom: 28, transition: 'background .15s, border-color .15s, background .15s',
                  background: p.featured ? '#FAFAFA' : 'transparent',
                  color: p.featured ? '#08090A' : c.textHi,
                  border: p.featured ? 'none' : `1px solid ${c.borderStrong}`,
                }}>
                  Join waitlist
                </a>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.features.map((feat) => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: c.textMid, lineHeight: 1.5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                        <path d="M20 6L9 17l-5-5" stroke={c.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" style={{ position: 'relative', padding: '88px 26px', borderTop: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, fontFamily: mono, textTransform: 'uppercase', letterSpacing: '.06em', padding: '6px 12px', borderRadius: 999, background: 'rgba(63,207,142,0.06)', border: '1px solid #23312A', color: c.mint, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.green }} />
              Questions
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-1px', color: c.textHi, margin: 0 }}>
              Before you ask
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: c.border, border: `1px solid ${c.border}`, borderRadius: 14, overflow: 'hidden' }}>
            {faqs.map((f, i) => (
              <details key={f.q} className="kp-faq" open={i === 0} style={{ background: c.bgRaised }}>
                <summary style={{ listStyle: 'none', cursor: 'pointer', padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 15.5, fontWeight: 500, color: c.textHi }}>
                  {f.q}
                  <svg className="kp-faq-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: c.textMid }}>
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </summary>
                <div style={{ padding: '0 26px 24px', fontSize: 14.5, lineHeight: 1.7, color: c.textMid }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ position: 'relative', padding: '88px 26px', borderTop: `1px solid ${c.border}`, textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, fontFamily: mono, textTransform: 'uppercase', letterSpacing: '.06em', padding: '6px 12px', borderRadius: 999, background: 'rgba(63,207,142,0.06)', border: '1px solid #23312A', color: c.mint, marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.green }} />
            Now in early access
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-1px', color: c.textHi, margin: '0 0 16px' }}>
            Stop finding out the hard way.
          </h2>
          <p style={{ fontSize: 16, color: c.textMid, margin: '0 0 34px' }}>
            Free for 3 domains. No credit card, no nameserver changes.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            <input
              className="kp-input"
              type="email"
              placeholder="you@company.com"
              style={{ width: 260, height: 46, padding: '0 15px', border: '1px solid #23262A', borderRadius: 10, fontSize: 15, fontFamily: 'Inter, sans-serif', color: '#EDEDED', outline: 'none', background: '#0E0F11' }}
            />
            <button className="kp-cta" style={{ height: 46, padding: '0 22px', background: '#FAFAFA', color: '#08090A', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', transition: 'background .15s' }}>
              Join the waitlist
            </button>
          </div>
          <span style={{ fontFamily: mono, fontSize: 13, color: c.textLow }}>takes about 10 seconds</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', padding: '56px 26px 36px', borderTop: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <svg width="24" height="24" viewBox="0 0 100 100" aria-hidden="true">
                <rect x="1" y="1" width="98" height="98" rx="24" fill="#0C0E0D" stroke="#294034" strokeWidth="1.5" />
                <path d="M50 20 L74 28 V50 C74 65 63 74 50 80 C37 74 26 65 26 50 V28 Z" fill="#3FCF8E" />
                <polyline points="30,53 42,53 46,42 52,64 57,48 61,53 70,53" fill="none" stroke="#0C0E0D" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 15, fontWeight: 600, color: c.textHi }}>KiraPulse</span>
            </div>
            <p style={{ fontSize: 13.5, color: c.textLow, maxWidth: 240, lineHeight: 1.6, margin: 0 }}>
              Domain, SSL, and DNS monitoring — with one health score watching all three.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 64 }}>
            <div>
              <h4 style={{ fontFamily: mono, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.06em', color: c.textLow, margin: '0 0 16px' }}>Product</h4>
              <a href="#product" className="kp-navlink" style={{ display: 'block', fontSize: 14, color: c.textMid, marginBottom: 12, textDecoration: 'none' }}>Overview</a>
              <a href="#pricing" className="kp-navlink" style={{ display: 'block', fontSize: 14, color: c.textMid, marginBottom: 12, textDecoration: 'none' }}>Pricing</a>
              <a href="#faq" className="kp-navlink" style={{ display: 'block', fontSize: 14, color: c.textMid, marginBottom: 0, textDecoration: 'none' }}>FAQ</a>
            </div>
            <div>
              <h4 style={{ fontFamily: mono, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.06em', color: c.textLow, margin: '0 0 16px' }}>Company</h4>
              <a href="https://ryoka.xyz" className="kp-navlink" style={{ display: 'block', fontSize: 14, color: c.textMid, marginBottom: 12, textDecoration: 'none' }}>Ryoka</a>
              <a href="#" className="kp-navlink" style={{ display: 'block', fontSize: 14, color: c.textMid, marginBottom: 12, textDecoration: 'none' }}>Twitter / X</a>
              <a href="#" className="kp-navlink" style={{ display: 'block', fontSize: 14, color: c.textMid, marginBottom: 0, textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1080, margin: '48px auto 0', paddingTop: 24, borderTop: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontFamily: mono, fontSize: 12.5, color: c.textLow }}>
          <span>&copy; 2026 KiraPulse, part of Ryoka</span>
          <span>built for people who'd rather not find out from a customer</span>
        </div>
      </div>

    </main>
  )
}
