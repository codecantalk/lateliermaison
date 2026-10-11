import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

// Capitalize and format city names (e.g., "washington-dc" -> "Washington DC")
const formatCityName = (slug: string) => {
  if (!slug) return 'Our Location'
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const cityName = formatCityName(resolvedParams.city)
  
  return {
    title: `Luxury Home Cleaning & Remodeling in ${cityName} | L'Atelier Maison`,
    description: `Top-rated luxury home cleaning, bespoke remodeling, and premium property care services in ${cityName}. Fully insured, master artisans, and a 100% satisfaction guarantee.`,
    alternates: {
      canonical: `https://lateliermaison.vercel.app/locations/${resolvedParams.city}`,
    },
  }
}

export default async function CityLocationPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  const cityName = formatCityName(resolvedParams.city)

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Dynamic Keyframes for Background Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtlePan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatSlow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}} />

      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        paddingTop: '120px', 
        paddingBottom: '60px', 
        background: 'linear-gradient(-45deg, #f8fafc, #e2e8f0, #f1f5f9, #ffffff)',
        backgroundSize: '400% 400%',
        animation: 'subtlePan 15s ease infinite',
        color: '#1e293b',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(203,213,225,0.4) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(40px)', animation: 'floatSlow 8s ease-in-out infinite' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(226,232,240,0.5) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(30px)', animation: 'floatSlow 12s ease-in-out infinite reverse' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            
            {/* Left Content */}
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.25rem 0.75rem', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                <span style={{ color: '#d97706', fontSize: '0.75rem' }}>★ ★ ★ ★ ★</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>Serving {cityName}</span>
              </div>
              
              <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.15, marginBottom: '1.25rem', fontWeight: 400, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Uncompromising luxury home services in <span style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>{cityName}</span>.
              </h1>
              
              <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '2rem', lineHeight: 1.7, maxWidth: '480px' }}>
                Atelier Maison brings bespoke remodeling, luxury cleaning, and comprehensive estate care to {cityName}. Experience the highest standard of living, crafted exclusively by our master artisans.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/estimate" className="btn btn-primary">
                  Get a Free Estimate
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Contact Our Team
                </Link>
              </div>
            </div>

            {/* Right Asymmetrical Graphic */}
            <div style={{ position: 'relative', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ 
                 position: 'relative', 
                 width: '100%', 
                 maxWidth: '380px', 
                 aspectRatio: '4/5', 
                 backgroundColor: '#ffffff', 
                 borderRadius: '20px', 
                 padding: '1.5rem',
                 boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
                 transform: 'rotate(2deg)',
                 animation: 'floatSlow 10s ease-in-out infinite'
               }}>
                 <div style={{ width: '100%', height: '100%', border: '1px dashed #cbd5e1', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', padding: '2rem', textAlign: 'center' }}>
                   <div style={{ width: '48px', height: '48px', backgroundColor: '#1e3a8a', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', color: '#ffffff' }}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                   </div>
                   <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.5rem', fontFamily: 'serif' }}>Local Excellence</h3>
                   <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>Dedicated architectural and service teams based in {cityName}, ready to elevate your property.</p>
                 </div>
               </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Trust Banner (Reused styling pattern) */}
      <section style={{ backgroundColor: '#ffffff', paddingBottom: '3rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, marginTop: '-3rem' }}>
          <div style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '12px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
              padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 5vw, 3rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'clamp(1rem, 4vw, 2.5rem)',
              alignItems: 'center',
              border: '1px solid rgba(0,0,0,0.02)'
            }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#1e293b', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#334155' }}>Fully Insured</span>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Licensed & Bonded in {cityName}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#1e293b', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#334155' }}>Master Artisans</span>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Vetted Local Experts</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#1e293b', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#334155' }}>100% Satisfaction</span>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Guaranteed Results</p>
            </div>

          </div>
        </div>
      </section>

      {/* Services Contextual to City */}
      <section className="container" style={{ padding: 'clamp(4rem, 8vw, 8rem) 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#1e3a8a', marginBottom: '1rem' }}>
            Our Services in {cityName}
          </h2>
          <p style={{ color: '#4b5563', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Whether you reside in the heart of {cityName} or the surrounding suburbs, our team is equipped to elevate your living space.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { title: 'Luxury Cleaning', desc: `Meticulous deep cleaning tailored to the finest homes in ${cityName}.` },
            { title: 'Home Remodeling', desc: 'Bespoke kitchen, bathroom, and full-home renovations by master builders.' },
            { title: 'Property Care', desc: 'Comprehensive estate management and maintenance for peace of mind.' },
          ].map((service, idx) => (
            <div key={idx} style={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>{service.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0 }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Local Call to Action */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 5%', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: '#1e293b', marginBottom: '1.5rem' }}>
              Ready to transform your <br/>{cityName} home?
            </h2>
            <p style={{ color: '#4b5563', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Our dedicated local team is standing by to schedule your consultation. Experience the Atelier Maison difference today.
            </p>
            <Link href="/contact" className="btn btn-primary">Book a Consultation</Link>
          </div>
          
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#1e3a8a', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Service Area Information</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ color: '#d97706', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#475569', lineHeight: 1.5 }}>Proudly serving the greater {cityName} metropolitan area.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ color: '#d97706', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#475569', lineHeight: 1.5 }}>Fully licensed and insured according to local regulations.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ color: '#d97706', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#475569', lineHeight: 1.5 }}>Local master artisans familiar with regional architecture styles.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
