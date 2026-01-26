import type { Metadata } from 'next'
import { Inter, Bebas_Neue, Plus_Jakarta_Sans } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-nav',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://volcanoclub.com'),
  title: 'VOLCANO | Premium Nightclub Utah',
  description: 'Experience the ultimate nightlife at Volcano. Premium music, world-class DJs, and unforgettable nights in Salt Lake City, Utah.',
  keywords: ['nightclub', 'utah', 'salt lake city', 'nightlife', 'club', 'dj', 'events', 'vip'],
  authors: [{ name: 'Volcano Club' }],
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'VOLCANO | Premium Nightclub Utah',
    description: 'Experience the ultimate nightlife in Salt Lake City',
    type: 'website',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} ${plusJakarta.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
