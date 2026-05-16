import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'UNRVLD',
    template: '%s | UNRVLD',
  },
  description:
    'Premium media, web design, and digital strategy for brands that want to look sharper and move faster.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
