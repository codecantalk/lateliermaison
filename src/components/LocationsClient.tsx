'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap/dist/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './LandingPage.module.css'
import FamilyBanner from './FamilyBanner'
import LocationsMapHero from './LocationsMapHero'
import { MapPin, Phone, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const operationalRegions = [
  {
    region: 'Atlanta Metropolitan Hub',
    state: 'Georgia, USA',
    badge: 'Flagship Headquarters',
    address: 'Cumberland Blvd SE, Vinings / Atlanta, GA 30339',
    phone: '334-487-5707',
    email: 'atlanta@lateliermaison.com',
    cleaningPage: '/atlanta/house-cleaning',
    locationsSlug: 'atlanta',
    img: '/luxury-hero.jpg',
    desc: 'Our flagship Atlanta headquarters delivers luxury house cleaning, estate concierge care, and master remodeling throughout greater Atlanta.',
    serviceAreas: [
      'Buckhead',
      'Vinings',
      'Midtown',
      'Sandy Springs',
      'Alpharetta',
      'Dunwoody',
      'Brookhaven',
      'Johns Creek',
      'Milton',
      'Inman Park'
    ]
  },
  {
    region: 'DMV Regional Division',
    state: 'DC, Maryland & Northern Virginia',
    badge: 'Capital & Mid-Atlantic Hub',
    address: '4600 Powder Mill Rd, Beltsville, MD 20705',
    phone: '334-487-5707',
    email: 'dmv@lateliermaison.com',
    cleaningPage: '/dmv/house-cleaning',
    locationsSlug: 'washington-dc',
    img: '/luxury-bathroom.jpg',
    desc: 'Bespoke residential cleaning and artisan estate care serving Washington DC brownstones, Maryland waterfront properties, and Virginia estates.',
    serviceAreas: [
      'Washington DC (Georgetown & Capitol Hill)',
      'Bethesda & Potomac, MD',
      'Silver Spring & Beltsville, MD',
      'Arlington & Alexandria, VA',
      'McLean & Great Falls, VA',
      'Rockville & Annapolis, MD'
    ]
  }
]

export default function LocationsClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 250)

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.from('.loc-title', { 
        y: 30, 
        opacity: 0, 
        duration: 0.8, 
        ease: 'power3.out', 
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.loc-title',
          start: 'top 90%',
          once: true
        }
      })

      // Card reveal with fallback
      gsap.utils.toArray('.loc-card').forEach((card: any) => {
        gsap.from(card, {
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            once: true
          }
        })
      })
    }, containerRef)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.wrapper} style={{ backgroundColor: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}>
      
      {/* 1. Interactive 3D Animated Regional Cartography Hero */}
      <LocationsMapHero />

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="OUR" 
          suffix="Reach." 
          content="L'Atelier Maison operates exclusively in our two core regional divisions: Atlanta, Georgia and the DMV Area (Washington D.C., Maryland, and Northern Virginia). Our dedicated local teams deliver meticulous house cleaning, luxury remodeling, and estate management with absolute perfection."
        />
        
        <div style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
          
          <div className="container" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d97706', fontWeight: 700 }}>
              Operating Divisions
            </span>
            <h2 className="font-serif loc-title" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: '#0B132B', margin: '0.5rem 0 1rem 0' }}>
              Where We Serve.
            </h2>
            <p className="loc-title" style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.15rem', color: '#475569', lineHeight: 1.6 }}>
              Local concierge teams dedicated to luxury residences across Atlanta, GA and the DMV corridor.
            </p>
          </div>

          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem' }}>
              {operationalRegions.map((region, idx) => (
                <div 
                  key={idx} 
                  className={`loc-card ${styles.glassCard}`} 
                  style={{ 
                    padding: '2.5rem', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0', 
                    backgroundColor: '#ffffff',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Image Header with Badge */}
                    <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.75rem' }}>
                      <Image 
                        src={region.img} 
                        alt={region.region} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        className={styles.zoomImage} 
                        sizes="(max-width: 768px) 100vw, 50vw" 
                      />
                      <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(11, 19, 43, 0.85)', backdropFilter: 'blur(8px)', color: '#facc15', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {region.badge}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c5a059', fontWeight: 600 }}>
                      {region.state}
                    </div>
                    <h3 className="font-serif" style={{ fontSize: '2rem', color: '#0B132B', margin: '0.25rem 0 1rem 0' }}>
                      {region.region}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {region.desc}
                    </p>

                    {/* Direct Contact Info */}
                    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#334155' }}>
                          <MapPin size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{region.address}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Phone size={16} color="#d97706" style={{ flexShrink: 0 }} />
                          <a href={`tel:${region.phone.replace(/[^0-9]/g, '')}`} style={{ color: '#1e3a8a', textDecoration: 'none', fontWeight: 600 }}>
                            {region.phone}
                          </a>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Mail size={16} color="#d97706" style={{ flexShrink: 0 }} />
                          <a href={`mailto:${region.email}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                            {region.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Service Areas Pills */}
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.6rem' }}>
                        Key Communities Served:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {region.serviceAreas.map((area, i) => (
                          <span 
                            key={i} 
                            style={{ 
                              background: '#f1f5f9', 
                              color: '#334155', 
                              fontSize: '0.78rem', 
                              padding: '0.25rem 0.65rem', 
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0'
                            }}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dual CTA buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                    <Link 
                      href={region.cleaningPage} 
                      className="btn btn-primary" 
                      style={{ 
                        width: '100%', 
                        textAlign: 'center', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.85rem'
                      }}
                    >
                      <Sparkles size={16} color="#facc15" />
                      <span>{region.region.includes('Atlanta') ? 'Atlanta House Cleaning' : 'DMV House Cleaning'}</span>
                      <ArrowRight size={15} />
                    </Link>
                    
                    <Link 
                      href={`/locations/${region.locationsSlug}`} 
                      className="btn btn-outline" 
                      style={{ 
                        width: '100%', 
                        textAlign: 'center',
                        borderColor: '#cbd5e1',
                        color: '#334155',
                        fontSize: '0.88rem'
                      }}
                    >
                      <span>Explore Regional Overview</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="container" style={{ marginTop: '4rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #0B132B 0%, #1e3a8a 100%)', 
              color: '#ffffff', 
              padding: '3rem', 
              borderRadius: '16px',
              textAlign: 'center' 
            }}>
              <ShieldCheck size={36} color="#c5a059" style={{ margin: '0 auto 1rem auto' }} />
              <h3 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                Uncompromising Service in Every Neighborhood
              </h3>
              <p style={{ maxWidth: '650px', margin: '0 auto 2rem auto', color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Every home in Atlanta and the DMV corridor receives vetted master artisans, eco-luxury non-toxic solutions, and our 100% satisfaction guarantee.
              </p>
              <Link href="/estimate" className="btn btn-primary" style={{ backgroundColor: '#d97706', border: 'none', padding: '0.9rem 2.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Get an Instant Quote
              </Link>
            </div>
          </div>

        </div>
      </div> {/* END CONTENT WRAPPER */}

    </div>
  )
}
