import React from 'react'

export const metadata = {
  title: 'Privacy Policy | L\'Atelier Maison',
  description: 'Privacy Policy for L\'Atelier Maison - Luxury Home Services.'
}

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '160px', paddingBottom: '120px' }}>
      <div className="container" style={{ maxWidth: '850px', margin: '0 auto', padding: '0 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#0f172a', marginBottom: '1rem', lineHeight: 1.1 }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', color: '#64748b', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Effective Date: {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div style={{ fontFamily: 'var(--font-sans)', color: '#334155', fontSize: '1.1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <section>
            <p>
              L'Atelier Maison ("we," "our," or "us") respects your privacy and is committed to protecting the personal data of our esteemed clientele. This Privacy Policy details how we collect, use, and safeguard information when you engage with our luxury home cleaning, bespoke renovations, and estate management services.
            </p>
          </section>

          <section>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              1. Information We Collect
            </h2>
            <p style={{ marginBottom: '1rem' }}>To provide our premium property services, we may collect the following categories of information:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Contact Information:</strong> Name, phone number, primary residence address, and email addresses.</li>
              <li><strong>Property Details:</strong> Specifications regarding your estate, square footage, security access protocols, and specific renovation or cleaning requirements.</li>
              <li><strong>Financial Information:</strong> Billing details and payment histories for services rendered.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              2. How We Use Your Information
            </h2>
            <p style={{ marginBottom: '1rem' }}>We utilize your personal data exclusively to deliver uncompromising service standards, specifically to:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Execute and manage our luxury home cleaning and bespoke remodeling projects.</li>
              <li>Coordinate estate management logistics and schedule artisan visits.</li>
              <li>Process secure payments and issue detailed invoicing.</li>
              <li>Communicate project updates, maintenance schedules, and tailored service offerings.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              3. Client Confidentiality & Data Sharing
            </h2>
            <p>
              Discretion is a core pillar of L'Atelier Maison. We do not sell, rent, or trade your personal information. We may share necessary details strictly with our vetted in-house artisans, verified contractors, or legal authorities when required by law to protect our rights and ensure the safety of your property.
            </p>
          </section>

          <section>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              4. Security Protocols
            </h2>
            <p>
              We employ industry-standard technical and organizational measures designed to secure your personal and property data against unauthorized access, loss, or alteration. Access to your property details is heavily restricted on a strict need-to-know basis.
            </p>
          </section>

          <section>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              5. Contact Our Office
            </h2>
            <p>
              For any inquiries regarding our privacy practices or to update your client profile, please contact our administrative office at: <br/><br/>
              <strong>Email:</strong> ateliermaisonatl@gmail.com
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
