import { Metadata } from 'next'
import LocalCleaningLandingPage, { LocalLandingConfig } from '@/components/LocalCleaningLandingPage'

export const metadata: Metadata = {
  title: 'DMV House Cleaning | Luxury Maid Service in DC, MD & Northern VA | L\'Atelier Maison',
  description: 'Premier DMV house cleaning serving Washington DC, Bethesda, Potomac, Arlington, Alexandria & McLean. 5.0 Google stars, eco-luxe formulas, bonded & insured.',
  keywords: [
    'dmv house cleaning',
    'house cleaning dmv',
    'luxury cleaning washington dc',
    'maid service bethesda md',
    'house cleaning potomac',
    'maid service mclean va',
    'house cleaning arlington va',
    'deep cleaning georgetown dc',
    'move out cleaning beltsville md'
  ],
  alternates: {
    canonical: 'https://www.lateliermaison.com/dmv/house-cleaning',
  },
  openGraph: {
    title: 'DMV House Cleaning | Luxury Maid Service in DC, MD & Northern VA',
    description: 'Bespoke house cleaning across Washington DC, Maryland, and Northern Virginia. Eco-friendly supplies, hospital-grade HEPA filters, 5.0 Star rated.',
    url: 'https://www.lateliermaison.com/dmv/house-cleaning',
    siteName: 'L\'Atelier Maison',
    images: [
      {
        url: '/luxury-bathroom.jpg',
        width: 1200,
        height: 630,
        alt: 'DMV House Cleaning by L\'Atelier Maison',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

const dmvConfig: LocalLandingConfig = {
  regionId: 'dmv',
  cityName: 'DMV Regional Area (DC, MD, VA)',
  shortName: 'DMV Area',
  stateLabel: 'Washington DC • Maryland • Northern Virginia',
  heroHeadline: 'White-Glove House Cleaning in the DMV Area.',
  heroSubtitle: 'Bespoke residential sanitization and routine housekeeping for Georgetown brownstones, Potomac and Bethesda estates, Arlington penthouses, and Northern Virginia luxury homes. Non-toxic, insured, and thoroughly vetted.',
  address: {
    street: '4600 Powder Mill Rd',
    cityStateZip: 'Beltsville, MD 20705',
    full: '4600 Powder Mill Rd, Beltsville, MD 20705',
  },
  phone: '334-487-5707',
  phoneClean: '3344875707',
  email: 'dmv@lateliermaison.com',
  hours: 'Monday — Saturday: 8:00 AM — 6:00 PM',
  heroImage: '/luxury-bathroom.jpg',
  googleReviewsUrl: process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || 'https://share.google/cJk8y6TGiLCE7k5i4',
  serviceAreas: [
    {
      district: 'Washington D.C. Districts',
      neighborhoods: ['Georgetown', 'Capitol Hill', 'Dupont Circle', 'Kalorama', 'Northwest DC', 'Foggy Bottom', 'Navy Yard', 'Woodley Park'],
    },
    {
      district: 'Montgomery & Prince George\'s County, MD',
      neighborhoods: ['Bethesda', 'Chevy Chase', 'Potomac', 'Silver Spring', 'Beltsville', 'Rockville', 'College Park', 'Gaithersburg'],
    },
    {
      district: 'Northern Virginia Corridor',
      neighborhoods: ['McLean', 'Great Falls', 'Arlington', 'Alexandria', 'Vienna', 'Tysons', 'Reston', 'Falls Church'],
    },
    {
      district: 'Greater Capital & Waterfront',
      neighborhoods: ['Annapolis', 'National Harbor', 'Fairfax', 'Oakton', 'Clarksville'],
    },
  ],
  allNeighborhoods: [
    'Washington DC', 'Georgetown', 'Capitol Hill', 'Bethesda', 'Chevy Chase', 
    'Potomac', 'Silver Spring', 'Beltsville', 'Rockville', 'Arlington', 
    'Alexandria', 'McLean', 'Great Falls', 'Vienna', 'Tysons', 
    'Reston', 'Annapolis', 'Dupont Circle', 'Kalorama', 'Falls Church'
  ],
  testimonials: [
    {
      name: 'Katherine B.',
      neighborhood: 'Georgetown, Washington DC',
      quote: 'Restoring our historic Georgetown townhouse without harsh chemical fumes was our primary requirement. Atelier Maison used pure eco-luxe formulas and left our antique hardwood floors glowing. Exemplary team.',
      service: 'Deep Sanctuary Clean',
      date: 'Verified Client',
    },
    {
      name: 'Robert H.',
      neighborhood: 'Bethesda, MD',
      quote: 'Meticulous deep cleaning before we moved into our home in Bethesda. Every cabinet interior, kitchen appliance, and marble bath looked brand new. Extremely impressed with their professionalism.',
      service: 'Move-In Detailed Reset',
      date: 'Verified Client',
    },
    {
      name: 'Julianna M.',
      neighborhood: 'McLean, VA',
      quote: 'The most dependable, high-end cleaning service in Northern Virginia. Their team treats our McLean residence with supreme respect and care. We have had them on a recurring bi-weekly schedule for months.',
      service: 'Recurring Maintenance',
      date: 'Verified Client',
    },
  ],
  faqs: [
    {
      q: 'Which parts of DC, Maryland, and Virginia do you service?',
      a: 'We service the entire National Capital Region including Northwest Washington DC, Montgomery County & Prince George’s County in Maryland (Bethesda, Potomac, Silver Spring, Beltsville, Rockville), and Northern Virginia (Arlington, Alexandria, McLean, Great Falls, Vienna, Tysons).',
    },
    {
      q: 'Do you service historic townhomes in Georgetown and Capitol Hill?',
      a: 'Yes. Our staff is trained in preserving delicate historic architectural details—such as plaster crown molding, antique hardwood floors, brass fixtures, and marble mantels—using PH-neutral, eco-luxe cleaners.',
    },
    {
      q: 'Are your DMV cleaning professionals bonded and insured?',
      a: 'Yes, fully. We carry $2,000,000 in commercial liability coverage and comprehensive bonding across the District of Columbia, Maryland, and Virginia.',
    },
    {
      q: 'Where is your DMV dispatch hub located?',
      a: 'Our regional office is stationed at 4600 Powder Mill Rd in Beltsville, MD. This central positioning allows us to quickly dispatch teams throughout DC, suburban Maryland, and across the Potomac into Northern Virginia.',
    },
    {
      q: 'Do I need to be home during the cleaning?',
      a: 'Most of our clients provide secure lockbox codes, garage codes, or front desk / concierge access. You are welcome to be home or return to a spotless, fresh sanctuary.',
    },
  ],
  geo: {
    latitude: 39.0348,
    longitude: -76.9075,
    addressLocality: 'Beltsville',
    addressRegion: 'MD',
    postalCode: '20705',
    streetAddress: '4600 Powder Mill Rd',
  },
}

export default function DmvHouseCleaningPage() {
  return <LocalCleaningLandingPage config={dmvConfig} />
}
