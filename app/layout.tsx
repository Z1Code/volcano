import type { Metadata } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'VOLCANO | Premium Nightclub Utah',
  description: 'Experience the ultimate nightlife at Volcano. Premium music, world-class DJs, and unforgettable nights in Salt Lake City, Utah.',
  keywords: ['nightclub', 'utah', 'salt lake city', 'nightlife', 'club', 'dj', 'events', 'vip'],
  authors: [{ name: 'Volcano Club' }],
  openGraph: {
    title: 'VOLCANO | Premium Nightclub Utah',
    description: 'Experience the ultimate nightlife in Salt Lake City',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
