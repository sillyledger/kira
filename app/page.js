export default function Home() {
  return (
    <main style={{ 
      background: '#141414', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#E8B84B', fontSize: '32px', fontWeight: '500' }}>
          KIRA
        </h1>
        <p style={{ color: '#555', marginTop: '8px', fontSize: '14px' }}>
          Domain monitoring — coming soon
        </p>
      </div>
    </main>
  )
}
