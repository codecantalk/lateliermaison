import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lateliermaison.com'),
  title: 'L\'Atelier Maison | Premium Home Services',
  description: 'Top-rated house cleaning and bathroom remodeling services in Atlanta, GA. Book your appointment online today.',
  openGraph: {
    title: 'L\'Atelier Maison | Premium Home Services',
    description: 'Top-rated house cleaning and bathroom remodeling services in Atlanta, GA.',
    url: 'https://www.lateliermaison.com',
    siteName: 'L\'Atelier Maison',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
