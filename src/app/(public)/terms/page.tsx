import React from 'react'

export const metadata = {
  title: 'Terms of Service | L\'Atelier Maison',
  description: 'Terms of Service for L\'Atelier Maison.'
}

export default function TermsPage() {
  return (
    <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', maxWidth: '800px' }}>
      <h1 className="font-serif" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Terms of Service</h1>
      <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="font-serif" style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Agreement to Terms</h2>
      <p style={{ marginBottom: '1rem', lineHeight: 1.8 }}>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>

      <h2 className="font-serif" style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. Services</h2>
      <p style={{ marginBottom: '1rem', lineHeight: 1.8 }}>L'Atelier Maison provides premium home cleaning, remodeling, and property management services. All quotes are estimates and subject to final inspection and agreement.</p>

      <h2 className="font-serif" style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. Cancellations</h2>
      <p style={{ marginBottom: '1rem', lineHeight: 1.8 }}>We require at least 24 hours notice for cancellations. Late cancellations may be subject to a fee as determined by your service agreement.</p>

      <h2 className="font-serif" style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. Contact Us</h2>
      <p style={{ marginBottom: '1rem', lineHeight: 1.8 }}>If you have any questions about these Terms, please contact us at ateliermaisonatl@gmail.com.</p>
    </div>
  )
}
