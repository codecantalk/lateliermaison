import React from 'react'

export const metadata = {
  title: 'Terms of Service | L\'Atelier Maison',
  description: 'Terms of Service for L\'Atelier Maison - Luxury Home Services.'
}

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '160px', paddingBottom: '120px' }}>
      <div className="container" style={{ maxWidth: '850px', margin: '0 auto', padding: '0 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#0f172a', marginBottom: '1rem', lineHeight: 1.1 }}>
            Terms of Service
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', color: '#64748b', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Effective Date: {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div style={{ fontFamily: 'var(--font-sans)', color: '#334155', fontSize: '1.1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <section>
            <p>
              Welcome to L'Atelier Maison. These Terms of Service ("Terms") govern your engagement with our premium portfolio of offerings, including luxury home cleaning, bespoke remodeling, and comprehensive estate management services. By booking a consultation or authorizing work, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              1. Scope of Services
            </h2>
            <p style={{ marginBottom: '1rem' }}>L'Atelier Maison provides high-end property solutions. Our core services include:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Bespoke Renovations & Remodeling:</strong> Custom architectural updates, premium material sourcing, and complete interior overhauls.</li>
              <li><strong>Luxury Home Cleaning:</strong> White-glove, deep-cleaning services tailored to protect delicate surfaces, fine art, and luxury finishes.</li>
              <li><strong>Estate Management & Property Services:</strong> Ongoing maintenance, seasonal property preparation, and dedicated caretaking for premium residences.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              2. Estimates & Agreements
            </h2>
            <p>
              All initial quotes and estimates provided via our platform or during preliminary consultations are subject to a final on-site inspection. A binding agreement is only formed once a formal Statement of Work (SOW) is signed by both the client and L'Atelier Maison management. We reserve the right to adjust estimates if the scope of work changes or unforeseen structural issues are discovered during remodeling.
            </p>
          </section>

          <section>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              3. Scheduling & Cancellations
            </h2>
            <p>
              We understand that schedules change. For luxury cleaning and routine property services, we require a minimum of 48 hours' notice for cancellations or rescheduling. For large-scale remodeling projects, cancellation terms will be dictated by your specific Statement of Work. Late cancellations may incur a fee to compensate our artisans for reserved time.
            </p>
          </section>

          <section>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              4. Liability & Insurance
            </h2>
            <p>
              L'Atelier Maison is fully licensed, bonded, and insured. While our master artisans operate with the utmost care, we require clients to secure all highly valuable, irreplaceable, or fragile items prior to the commencement of heavy remodeling or deep cleaning services. Our liability for any accidental damage is limited to the extent covered by our commercial insurance policies.
            </p>
          </section>

          <section>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              5. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, or to discuss a specific clause related to an upcoming project, please reach out to our team: <br/><br/>
              <strong>Email:</strong> support@lateliermaison.com
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
