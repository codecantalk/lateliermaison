import { Metadata } from 'next'
import CleaningClient from '@/components/CleaningClient'

export const metadata: Metadata = {
  title: 'Luxury House Cleaning & Maid Services | L\'Atelier Maison',
  description: 'Bespoke residential house cleaning and luxury maid services in Greater Atlanta, GA and the DMV Area (Washington DC, Maryland, Northern Virginia). Select your dedicated market.',
  alternates: {
    canonical: 'https://www.lateliermaison.com/services/housecleaning',
  },
  openGraph: {
    title: 'Luxury House Cleaning & Maid Services | L\'Atelier Maison',
    description: 'White-glove residential cleaning in Greater Atlanta and the DMV Area. Fully insured, eco-friendly formulas, 5.0 Google rated.',
    url: 'https://www.lateliermaison.com/services/housecleaning',
    siteName: 'L\'Atelier Maison',
    images: [
      {
        url: '/luxury-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'L\'Atelier Maison House Cleaning Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function CleaningServicePage() {
  return <CleaningClient />
}
