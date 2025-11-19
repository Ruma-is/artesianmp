import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/lib/supabase/auth-context'
import Navbar from '@/components/Navbar'
import GeminiChatbot from '@/components/GeminiChatbot'
import InstallPWA from '@/components/InstallPWA'
import Script from 'next/script'
import './globals.css'

// Rural Connection - Empowering Rural Artisans
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Rural Connection</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#926829" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <GeminiChatbot />
            <InstallPWA />
          </CartProvider>
        </AuthProvider>
        
        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((registration) => {
                    console.log('SW registered:', registration);
                  })
                  .catch((error) => {
                    console.log('SW registration failed:', error);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
