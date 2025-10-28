import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/lib/supabase/auth-context'
import Navbar from '@/components/Navbar'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Artisan Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#926829" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#926829" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <ServiceWorkerRegistration />
            <Navbar />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
