import LocationsClient from '@/components/LocationsClient'

export const metadata = {
  title: 'Global Locations | L\'Atelier Maison',
  description: 'Find a L\'Atelier Maison office near you. Serving Atlanta, Washington DC, and Paris.',
}

export default function LocationsPage() {
  return <LocationsClient />
}
