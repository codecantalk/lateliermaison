import LocationsClient from '@/components/LocationsClient'

export const metadata = {
  title: 'Operating Locations | L\'Atelier Maison',
  description: 'Find a L\'Atelier Maison office near you. Serving Atlanta and the DMV Area (Washington DC, Maryland, Northern Virginia).',
}

export default function LocationsPage() {
  return <LocationsClient />
}
