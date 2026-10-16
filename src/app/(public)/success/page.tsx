import { Suspense } from 'react'
import SuccessClient from './SuccessClient'

export const metadata = {
  title: "Order Confirmed | L'Atelier Maison",
  description: "Your luxury home service reservation has been received and confirmed.",
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Loading reservation details...</p>
      </div>
    }>
      <SuccessClient />
    </Suspense>
  )
}
