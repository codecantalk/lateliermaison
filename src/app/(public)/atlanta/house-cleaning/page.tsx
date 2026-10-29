import { Metadata } from 'next'
import LocalCleaningLandingPage, { LocalLandingConfig } from '@/components/LocalCleaningLandingPage'

export const metadata: Metadata = {
  title: 'Atlanta House Cleaning | Luxury Maid Service & Housekeeping | L\'Atelier Maison',
  description: 'Top-rated Atlanta house cleaning and maid service serving Buckhead, Vinings, Midtown & Alpharetta. 5.0 Google stars, eco-friendly formulas, instant online quotes.',
  keywords: [
    'atlanta house cleaning',
    'house cleaning atlanta',
    'luxury cleaning atlanta',
    'maid service buckhead',
    'house cleaning vinings ga',
    'deep cleaning alpharetta',
    'move in cleaning midtown atlanta',
    'eco friendly house cleaning atlanta'
  ],
  alternates: {
    canonical: 'https://www.lateliermaison.com/atlanta/house-cleaning',
  },
  openGraph: {
    title: 'Atlanta House Cleaning | Luxury Maid Service in Atlanta, GA',
    description: 'Experience white-glove residential cleaning in Buckhead, Vinings, Midtown, and Alpharetta. 5.0 Star rated, fully insured.',
    url: 'https://www.lateliermaison.com/atlanta/house-cleaning',
    siteName: 'L\'Atelier Maison',
    images: [
      {
        url: '/luxury-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Atlanta House Cleaning by L\'Atelier Maison',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

const atlantaConfig: LocalLandingConfig = {
  regionId: 'atlanta',
  cityName: 'Atlanta, GA',
  shortName: 'Atlanta',
  stateLabel: 'Greater Atlanta & North Georgia Corridor',
  heroHeadline: 'Pristine Luxury House Cleaning in Atlanta, GA.',
  heroSubtitle: 'Meticulous residential sanctuary care for Buckhead estates, Midtown high-rises, Vinings family homes, and North Atlanta residences. Fully insured, eco-friendly formulas, and dedicated artisan crews.',
  address: {
    street: 'Cumberland Blvd SE',
    cityStateZip: 'Vinings / Atlanta, GA 30339',
    full: 'Cumberland Blvd SE, Vinings, GA 30339',
  },
  phone: '334-487-5707',
  phoneClean: '3344875707',
  email: 'atlanta@lateliermaison.com',
  hours: 'Monday — Saturday: 8:00 AM — 6:00 PM',
  heroImage: '/luxury-hero.jpg',
  googleReviewsUrl: process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || 'https://share.google/cJk8y6TGiLCE7k5i4',
  serviceAreas: [
    {
      district: 'Core Atlanta & Historic Districts',
      neighborhoods: ['Buckhead', 'Midtown', 'Inman Park', 'Virginia-Highland', 'Old Fourth Ward', 'Chastain Park', 'Ansley Park'],
    },
    {
      district: 'Cobb & Cumberland Corridor',
      neighborhoods: ['Vinings', 'Smyrna', 'East Cobb', 'Marietta', 'Sandy Springs'],
    },
    {
      district: 'North Fulton & Gwinnett',
      neighborhoods: ['Alpharetta', 'Milton', 'Johns Creek', 'Roswell', 'Brookhaven', 'Dunwoody'],
    },
    {
      district: 'Decatur & South Atlanta',
      neighborhoods: ['Decatur', 'Druid Hills', 'Peachtree City', 'Grant Park', 'Oakhurst'],
    },
  ],
  allNeighborhoods: [
    'Buckhead', 'Vinings', 'Midtown', 'Sandy Springs', 'Alpharetta', 
    'Dunwoody', 'Brookhaven', 'Johns Creek', 'Milton', 'Inman Park', 
    'Virginia-Highland', 'Chastain Park', 'Roswell', 'Druid Hills', 
    'Smyrna', 'Marietta', 'Ansley Park', 'Decatur', 'Peachtree City'
  ],
  testimonials: [
    {
      name: 'Eleanor V.',
      neighborhood: 'Buckhead, Atlanta',
      quote: 'L\'Atelier Maison did an exceptional job resetting our estate in Buckhead. Every marble countertop, baseboard, and fixture was left immaculate. The cleaners were discreet, polite, and remarkably punctual.',
      service: 'Deep Sanctuary Clean',
      date: 'Verified Client',
    },
    {
      name: 'Marcus K.',
      neighborhood: 'Midtown Atlanta',
      quote: 'Living in a high-rise condominium in Midtown, finding a cleaning team with true attention to detail was nearly impossible until Atelier Maison. Hands down the highest quality service in Atlanta.',
      service: 'Recurring Bi-Weekly Clean',
      date: 'Verified Client',
    },
    {
      name: 'Sophia & David T.',
      neighborhood: 'Vinings / Alpharetta',
      quote: 'We use their recurring bi-weekly service. Coming home on Friday to the fresh botanical scent, hand-scrubbed kitchen, and spotless hardwoods is pure luxury. Worth every single penny.',
      service: 'Recurring Maintenance',
      date: 'Verified Client',
    },
  ],
  faqs: [
    {
      q: 'Do you clean luxury condominiums and high-rises in Midtown and Buckhead?',
      a: 'Yes, absolutely. Our crews are experienced with high-rise logistics across Atlanta, including concierge check-in, freight elevator reservations, resident parking regulations, and key fob management.',
    },
    {
      q: 'Are your cleaners insured and bonded in Georgia?',
      a: 'Yes. We carry comprehensive $2,000,000 commercial general liability insurance and are fully bonded. Every artisan undergoes strict background checks and white-glove training before entering your home.',
    },
    {
      q: 'What cleaning supplies and vacuums do you bring to my Atlanta home?',
      a: 'We supply all equipment and supplies. We use hospital-grade HEPA filtration vacuums that capture 99.97% of airborne allergens and dust. All solutions are eco-luxe, botanical, and non-toxic—safe for pets, infants, natural marble, and hardwood finishes.',
    },
    {
      q: 'Can I request the same cleaning team for recurring visits?',
      a: 'Yes. Consistency is central to our philosophy. We assign a dedicated cleaning team to recurring clients so they develop deep familiarity with your layout, delicate surfaces, and personal preferences.',
    },
    {
      q: 'How does your 100% Satisfaction Guarantee work?',
      a: 'If any surface or room does not meet your high expectations, notify our Atlanta concierge within 24 hours and we will dispatch a team to reclean the area promptly at zero cost.',
    },
  ],
  geo: {
    latitude: 33.8644,
    longitude: -84.4691,
    addressLocality: 'Vinings',
    addressRegion: 'GA',
    postalCode: '30339',
    streetAddress: 'Cumberland Blvd SE',
  },
}

export default function AtlantaHouseCleaningPage() {
  return <LocalCleaningLandingPage config={atlantaConfig} />
}
