export default function Home() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, background: '#111', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>K</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111', letterSpacing: '-.3px' }}>Kira</span>
        </div>
        <span style={{ fontSize: 13.5, color: '#555', fontWeight: 500, cursor: 'pointer' }}>Sign in</span>
      </div>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 26px 80px' }}>

        {/* Eyebrow */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, padding: '5px 12px', borderRadius: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', marginBottom: 26 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
          Now in early access
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(30px, 5.2vw, 52px)', fontWeight: 700, letterSpacing: '-2px', lineHeight: 1.07, color: '#111', margin: '0 0 20px', maxWidth: 620 }}>
          Never lose a domain to a missed renewal.
        </h1>

        {/* Subheadline */}
        <p style={{ fontSize: 16.5, lineHeight: 1.62, color: '#666', maxWidth: 512, margin: '0 0 32px' }}>
          Kira watches your domains, SSL certificates, and DNS records, then warns you before anything expires — all tracked in one simple health score.
        </p>

        {/* Waitlist CTA */}
        <div style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 420 }}>
          <input
            type="email"
            placeholder="you@company.com"
            style={{ flex: 1, height: 44, padding: '0 14px', border: '1px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#111', outline: 'none', background: '#fff' }}
          />
          <button style={{ height: 44, padding: '0 18px', background: '#111', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
            Join the waitlist
          </button>
        </div>

        {/* Reassurance */}
        <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 14 }}>
          Free for 3 domains at launch. No credit card.
        </div>

      </div>
    </main>
  )
}
