'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ maxWidth: '500px', textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>💥</div>
            <h2 style={{ color: '#926829', marginBottom: '15px' }}>
              Critical Error
            </h2>
            <p style={{ color: '#666', marginBottom: '25px' }}>
              The application encountered a critical error. Please refresh the page.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '12px 24px',
                backgroundColor: '#926829',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
