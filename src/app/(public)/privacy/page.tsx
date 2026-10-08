import React from 'react'

export const metadata = {
  title: 'Privacy Policy | L\'Atelier Maison',
  description: 'Privacy Policy for L\'Atelier Maison.'
}

export default function PrivacyPage() {
  return (
    <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', maxWidth: '800px' }}>
      <h1 className="font-serif" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Privacy Policy</h1>
      <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="font-serif" style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
      <p style={{ marginBottom: '1rem', lineHeight: 1.8 }}>We collect information that you provide directly to us, such as when you request a consultation, fill out a form, or contact us. This may include your name, email, phone number, address, and project details.</p>

      <h2 className="font-serif" style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
      <p style={{ marginBottom: '1rem', lineHeight: 1.8 }}>We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you about products, services, and offers.</p>

      <h2 className="font-serif" style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. Information Sharing</h2>
      <p style={{ marginBottom: '1rem', lineHeight: 1.8 }}>We do not share your personal information with third parties except as necessary to provide our services, comply with the law, or protect our rights.</p>

      <h2 className="font-serif" style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. Contact Us</h2>
      <p style={{ marginBottom: '1rem', lineHeight: 1.8 }}>If you have any questions about this Privacy Policy, please contact us at ateliermaisonatl@gmail.com.</p>
    </div>
  )
}
